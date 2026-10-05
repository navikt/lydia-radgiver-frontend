import express, { RequestHandler } from "express";
import session from "express-session";
import request from "supertest";
import {
    inMemorySessionManager,
    sessionManager,
} from "../SessionStore";
import logger from "../logging";

const oldSecret = "test-old-session-signing-key";
const newSecret = "test-new-session-signing-key";
const originalSecrets = process.env.SESSION_SECRETS;
const originalSecret = process.env.SESSION_SECRET;
const originalCluster = process.env.NAIS_CLUSTER_NAME;

function restoreEnv(name: string, value: string | undefined) {
    if (value === undefined) delete process.env[name];
    else process.env[name] = value;
}

function appWithSession(manager: RequestHandler) {
    const app = express();
    app.use(manager);
    app.get("/write", (req, res) => {
        req.session.accessToken = "test-session-data";
        res.sendStatus(204);
    });
    app.get("/read", (req, res) => {
        res.status(req.session.accessToken ? 200 : 401).end();
    });
    return app;
}

async function cookieFrom(app: ReturnType<typeof appWithSession>) {
    const response = await request(app).get("/write");
    const cookie = response.headers["set-cookie"]?.[0];
    if (!cookie) throw new Error("Sesjonscookie mangler");
    return cookie;
}

beforeEach(() => {
    delete process.env.SESSION_SECRETS;
    process.env.SESSION_SECRET = oldSecret;
    process.env.NAIS_CLUSTER_NAME = "local";
});

afterEach(() => {
    restoreEnv("SESSION_SECRETS", originalSecrets);
    restoreEnv("SESSION_SECRET", originalSecret);
    restoreEnv("NAIS_CLUSTER_NAME", originalCluster);
    jest.restoreAllMocks();
});

describe("Rotering av sesjonssecret", () => {
    test("gamle cookies virker under overgang og etter bytte av signeringssecret", async () => {
        const store = new session.MemoryStore();
        const oldApp = appWithSession(await inMemorySessionManager(store));
        const oldCookie = await cookieFrom(oldApp);

        process.env.SESSION_SECRETS = JSON.stringify([oldSecret, newSecret]);
        const transitionApp = appWithSession(
            await inMemorySessionManager(store),
        );
        expect(
            (await request(transitionApp).get("/read").set("Cookie", oldCookie))
                .status,
        ).toBe(200);
        const transitionCookie = await cookieFrom(transitionApp);
        expect(
            (await request(oldApp).get("/read").set("Cookie", transitionCookie))
                .status,
        ).toBe(200);

        process.env.SESSION_SECRETS = JSON.stringify([newSecret, oldSecret]);
        const rotatedApp = appWithSession(await inMemorySessionManager(store));
        expect(
            (await request(rotatedApp).get("/read").set("Cookie", oldCookie))
                .status,
        ).toBe(200);
        const newCookie = await cookieFrom(rotatedApp);
        expect(
            (await request(oldApp).get("/read").set("Cookie", newCookie)).status,
        ).toBe(401);
        expect(
            (await request(rotatedApp).get("/read").set("Cookie", newCookie))
                .status,
        ).toBe(200);

        process.env.SESSION_SECRETS = JSON.stringify([newSecret]);
        const finalApp = appWithSession(await inMemorySessionManager(store));
        expect(
            (await request(finalApp).get("/read").set("Cookie", oldCookie))
                .status,
        ).toBe(401);
        expect(
            (await request(finalApp).get("/read").set("Cookie", newCookie))
                .status,
        ).toBe(200);
    });

    test("logger konfigurasjonsmodus og antall, men aldri secret-verdier", async () => {
        const log = jest.spyOn(logger, "info").mockImplementation();
        process.env.SESSION_SECRETS = JSON.stringify([newSecret, oldSecret]);
        await inMemorySessionManager();

        expect(log).toHaveBeenCalledWith(
            "Sesjonssignering: SESSION_SECRETS aktiv; signerer med første verdi, godtar 2 verdi(er)",
        );
        expect(JSON.stringify(log.mock.calls)).not.toContain(oldSecret);
        expect(JSON.stringify(log.mock.calls)).not.toContain(newSecret);

        delete process.env.SESSION_SECRETS;
        await inMemorySessionManager();
        expect(log).toHaveBeenCalledWith(
            "Sesjonssignering: SESSION_SECRET aktiv; signerer og verifiserer med én verdi",
        );
    });

    test.each([
        "not JSON",
        "{}",
        '"a secret"',
        "[]",
        "[null]",
        '[""]',
        '["   "]',
        '["valid", 12]',
    ])("avviser ugyldig SESSION_SECRETS: %s", async (value) => {
        process.env.SESSION_SECRETS = value;
        await expect(inMemorySessionManager()).rejects.toThrow(
            "SESSION_SECRETS",
        );
        await expect(sessionManager()).rejects.toThrow("SESSION_SECRETS");
    });

    test("avviser manglende secrets", async () => {
        delete process.env.SESSION_SECRET;
        await expect(inMemorySessionManager()).rejects.toThrow(
            "SESSION_SECRETS eller SESSION_SECRET må være satt",
        );
    });
});
