import request from "supertest";
import {Express} from "express";
import {Config, miljøVariabler} from "../config";
import Application from "../app";
import nock from "nock";
import {generateLocalKeys, setupLocalJwkSet} from "../jwks";
import {KeyLike} from "jose/dist/types/types";
import {decodeJwt, SignJWT} from "jose";
import {register} from "prom-client";
import {hentBrukerinfoFraToken} from "../brukerinfo";

const azureOpenidConfigTokenUri = "http://azure.com";
const azureOpenidConfigTokenPath = "/azure-openid-config/token";
const azureOpenidConfigTokenEndpoint = `${azureOpenidConfigTokenUri}${azureOpenidConfigTokenPath}`;
const lydiaApiUri = "http://lydia-api.lokal";
const azureClientId = "azureAppClientId";

let privateKey: KeyLike;

const mockEnv = () => {
    process.env[miljøVariabler.clusterName] = "local";
    process.env["OBO_TOKEN_ENC_KEY"] = "min_kryptonøkkel";
    process.env[miljøVariabler.nameSpace] = "pia";
    process.env[miljøVariabler.azureAppClientId] = azureClientId;
    process.env[miljøVariabler.azureOpenidConfigIssuer] = "azure";
    process.env[miljøVariabler.azureOpenidConfigTokenEndpoint] = azureOpenidConfigTokenEndpoint;
    process.env[miljøVariabler.azureAppClientSecret] = "azureAppClientSecret";
    process.env[miljøVariabler.serverPort] = "8080";
    process.env[miljøVariabler.lydiaApiUri] = lydiaApiUri;
    process.env[miljøVariabler.jwkUri] = "hei123";
    process.env[miljøVariabler.fiaSuperbrukerGroupId] = "ensuperbrukerGroupId"
    process.env[miljøVariabler.fiaSaksbehandlerGroupId] = "ensaksbehandlerGroupId"
    process.env[miljøVariabler.fiaLesetilgangGroupId] = "enlesetilgangGroupId"
    process.env[miljøVariabler.sessionHemmelighet] = "secret"
    process.env[miljøVariabler.csrfHemmelighet] = "csrf"
    process.env[miljøVariabler.cookieHemmelighet] = "cookie"
};

export async function createMockToken() {
    const jwtSigner = new SignJWT({
        azp: "hei1234",
        name: "Testuser Testuser",
        sub: "1",
        NAVident: "hei123",
        groups: ["ensuperbrukerGroupId"]
    })
        .setIssuedAt()
        .setProtectedHeader({alg: "RS256"})
        .setIssuer("azure")
        .setAudience(azureClientId)
        .setExpirationTime("2h")
        .setNotBefore(Math.round(Date.now() / 1000 - 5000));
    return jwtSigner.sign(privateKey);
}

async function setupJwkSet() {
    const keys = await generateLocalKeys();
    privateKey = keys.privateKey;
    return setupLocalJwkSet(keys.publicJwkKeys);
}

const init = async () => {
    mockEnv();
    const jwkSet = await setupJwkSet();
    register.clear();
    return new Application(new Config({jwkSet})).expressApp;
};

describe("Tester liveness og readiness", () => {
    let expressApp: Express;
    beforeAll(async () => {
        expressApp = await init();
    });

    test("Appen skal respondere på readiness", async () => {
        const superTest = request(expressApp);
        const responses = await Promise.all([
            superTest.get("/internal/isAlive"),
            superTest.get("/internal/isReady"),
        ]);
        const livenessReadynesPassed = responses.every((res) => res.statusCode === 200);
        expect(livenessReadynesPassed).toBeTruthy();
    });
});

describe("Tester proxy mot lydia-api", () => {
    let expressApp: Express;
    beforeAll(async () => {
        expressApp = await init();
    });
    test("Kall til /api/{endepunkt} uten Bearer token skal returnere 401 før de treffer proxy", async () => {
        const res = await request(expressApp).get("/api/test");
        expect(res.statusCode).toBe(401);
    });
    test("Kall til /api/{endepunkt} uten gyldig Bearer token skal få 401", async () => {
        const ugyldigTokenFraWonderwall = "ugyldig";
        const azureNockScope = nock(azureOpenidConfigTokenUri, {
            reqheaders: {
                authorization: `Bearer ${ugyldigTokenFraWonderwall}`,
            },
        })
            .post(azureOpenidConfigTokenPath)
            .reply(401);

        const res = await request(expressApp)
            .get("/api/test")
            .set("Authorization", `Bearer ${ugyldigTokenFraWonderwall}`);
        expect(res.statusCode).toBe(401);
        expect(azureNockScope.isDone()).toBeFalsy();
    });

    test("Kall til /api/{endepunkt} med gyldig Bearer token skal gi 200", async () => {
        const gyldigTokenFraWonderwall = await createMockToken();
        const mockOBOToken = {
            token_type: "Bearer",
            scope: "https://graph.microsoft.com/user.read",
            expires_in: 3269,
            ext_expires_in: 0,
            access_token:
                "eyJ0eXAiOiJKV1QiLCJub25jZSI6IkFRQUJBQUFBQUFCbmZpRy1tQTZOVGFlN0NkV1c3UWZkQ0NDYy0tY0hGa18wZE50MVEtc2loVzRMd2RwQVZISGpnTVdQZ0tQeVJIaGlDbUN2NkdyMEpmYmRfY1RmMUFxU21TcFJkVXVydVJqX3Nqd0JoN211eHlBQSIsImFsZyI6IlJTMjU2IiwieDV0IjoiejAzOXpkc0Z1aXpwQmZCVksxVG4yNVFIWU8wIiwia2lkIjoiejAzOXpkc0Z1aXpwQmZCVksxVG4yNVFIWU8wIn0.eyJhdWQiOiJodHRwczovL2dyYXBoLm1pY3Jvc29mdC5jb20iLCJpc3MiOiJodHRwczovL3N0cy53aW5kb3dzLm5ldC83MmY5ODhiZi04NmYxLTQxYWYtOTFhYi0yZDdjZDAxMWRiNDcvIiwiaWF0IjoxNDkzOTMwMzA1LCJuYmYiOjE0OTM5MzAzMDUsImV4cCI6MTQ5MzkzMzg3NSwiYWNyIjoiMCIsImFpbyI6IkFTUUEyLzhEQUFBQU9KYnFFWlRNTnEyZFcxYXpKN1RZMDlYeDdOT29EMkJEUlRWMXJ3b2ZRc1k9IiwiYW1yIjpbInB3ZCJdLCJhcHBfZGlzcGxheW5hbWUiOiJUb2RvRG90bmV0T2JvIiwiYXBwaWQiOiIyODQ2ZjcxYi1hN2E0LTQ5ODctYmFiMy03NjAwMzViMmYzODkiLCJhcHBpZGFjciI6IjEiLCJmYW1pbHlfbmFtZSI6IkNhbnVtYWxsYSIsImdpdmVuX25hbWUiOiJOYXZ5YSIsImlwYWRkciI6IjE2Ny4yMjAuMC4xOTkiLCJuYW1lIjoiTmF2eWEgQ2FudW1hbGxhIiwib2lkIjoiZDVlOTc5YzctM2QyZC00MmFmLThmMzAtNzI3ZGQ0YzJkMzgzIiwib25wcmVtX3NpZCI6IlMtMS01LTIxLTIxMjc1MjExODQtMTYwNDAxMjkyMC0xODg3OTI3NTI3LTI2MTE4NDg0IiwicGxhdGYiOiIxNCIsInB1aWQiOiIxMDAzM0ZGRkEwNkQxN0M5Iiwic2NwIjoiVXNlci5SZWFkIiwic3ViIjoibWtMMHBiLXlpMXQ1ckRGd2JTZ1JvTWxrZE52b3UzSjNWNm84UFE3alVCRSIsInRpZCI6IjcyZjk4OGJmLTg2ZjEtNDFhZi05MWFiLTJkN2NkMDExZGI0NyIsInVuaXF1ZV9uYW1lIjoibmFjYW51bWFAbWljcm9zb2Z0LmNvbSIsInVwbiI6Im5hY2FudW1hQG1pY3Jvc29mdC5jb20iLCJ1dGkiOiJWR1ItdmtEZlBFQ2M1dWFDaENRSkFBIiwidmVyIjoiMS4wIn0.cubh1L2VtruiiwF8ut1m9uNBmnUJeYx4x0G30F7CqSpzHj1Sv5DCgNZXyUz3pEiz77G8IfOF0_U5A_02k-xzwdYvtJUYGH3bFISzdqymiEGmdfCIRKl9KMeoo2llGv0ScCniIhr2U1yxTIkIpp092xcdaDt-2_2q_ql1Ha_HtjvTV1f9XR3t7_Id9bR5BqwVX5zPO7JMYDVhUZRx08eqZcC-F3wi0xd_5ND_mavMuxe2wrpF-EZviO3yg0QVRr59tE3AoWl8lSGpVc97vvRCnp4WVRk26jJhYXFPsdk4yWqOKZqzr3IFGyD08WizD_vPSrXcCPbZP3XWaoTUKZSNJg",
            refresh_token:
                "OAQABAAAAAABnfiG-mA6NTae7CdWW7QfdAALzDWjw6qSn4GUDfxWzJDZ6lk9qRw4An{a lot of characters here}",
        };

        const azureNockScope = nock(azureOpenidConfigTokenUri)
            .post(azureOpenidConfigTokenPath)
            .reply(200, mockOBOToken);

        const lydiaApiNockScope = nock(lydiaApiUri).get("/virksomhet").reply(200);

        const responseForTestEndpoint = await request(expressApp)
            .get("/api/virksomhet")
            .set("Authorization", `Bearer ${gyldigTokenFraWonderwall}`);
        expect(responseForTestEndpoint.statusCode).toBe(200);

        const responseForInnloggetAnsatt = await request(expressApp)
            .get("/innloggetAnsatt")
            .set("Authorization", `Bearer ${gyldigTokenFraWonderwall}`);

        expect(responseForInnloggetAnsatt.body.ident).toBe("hei123");
        expect(responseForInnloggetAnsatt.body.navn).toBe("Testuser Testuser");

        expect(azureNockScope.isDone());
        expect(lydiaApiNockScope.isDone());
    });

    test("skal kunne si hvor lenge brukeren har et gyldig token", async () => {
        const token = await createMockToken()
        const jwtPayload = decodeJwt(token)
        const brukerinfo = hentBrukerinfoFraToken(jwtPayload)
        const nå = Date.now()
        expect(brukerinfo.tokenUtloper < nå).toBeFalsy();
        const treTimer = 1000 * 60 * 60 * 3
        expect(brukerinfo.tokenUtloper < nå + treTimer).toBeTruthy();
    });
});


describe("Tester uthenting av metrikker", () => {
    let expressApp: Express;
    beforeAll(async () => {
        expressApp = await init();
    });

    test("Appen skal hente metrics om HTTP kall", async () => {
        const superTest = request(expressApp);
        const livenessCheck = await superTest.get("/internal/isAlive")
        expect(livenessCheck.statusCode).toBe(200)
        const metricsCollection = await superTest.get("/internal/metrics")
        expect(metricsCollection.text).toContain("process_cpu_user_seconds_total")
        expect(metricsCollection.text).toContain("http_request_size_bytes_bucket")
        expect(metricsCollection.text).toContain("http_response_size_bytes_bucket")
        expect(metricsCollection.text).toContain("http_response_size_bytes_bucket")
        expect(metricsCollection.text).toContain("http_request_duration_seconds_sum")
        expect(metricsCollection.text).toContain("http_request_duration_seconds_count")
        expect(metricsCollection.text).toContain("http_request_duration_seconds_count{method=\"GET\",route=\"/internal/isAlive\",code=\"200\"}")
    });
});
