import * as redis from "redis";
import session from "express-session";
import { inCloudMode } from "./app";
import { RedisStore } from "connect-redis";
import logger from "./logging";

function sessionSecrets(): string[] {
    const configuredSecrets = process.env.SESSION_SECRETS;
    if (configuredSecrets !== undefined) {
        let parsed: unknown;
        try {
            parsed = JSON.parse(configuredSecrets);
        } catch (error) {
            if (!(error instanceof SyntaxError)) throw error;
            throw new Error("SESSION_SECRETS må være en gyldig JSON-liste");
        }
        if (
            !Array.isArray(parsed) ||
            parsed.length === 0 ||
            !parsed.every(
                (secret): secret is string =>
                    typeof secret === "string" && secret.trim().length > 0,
            )
        ) {
            throw new Error(
                "SESSION_SECRETS må være en liste med minst én ikke-tom secret",
            );
        }
        logger.info(
            `Sesjonssignering: SESSION_SECRETS aktiv; signerer med første verdi, godtar ${parsed.length} verdi(er)`,
        );
        return parsed;
    }

    const legacySecret = process.env.SESSION_SECRET;
    if (!legacySecret?.trim()) {
        throw new Error("SESSION_SECRETS eller SESSION_SECRET må være satt");
    }
    logger.info(
        "Sesjonssignering: SESSION_SECRET aktiv; signerer og verifiserer med én verdi",
    );
    return [legacySecret];
}

const valkeyConfig = {
    username: process.env.VALKEY_USERNAME_FIA_SESSION || "",
    password: process.env.VALKEY_PASSWORD_FIA_SESSION || "",
    uri: process.env.REDIS_URI_FIA_SESSION,
};

async function getRedisStore() {
    const redisClient = redis.createClient({
        url: valkeyConfig.uri,
        username: valkeyConfig.username,
        password: valkeyConfig.password,
        pingInterval: 3000,
    });
    redisClient.on("error", (err) => {
        logger.error("Feil fra redis: ", err);
    });
    await redisClient.connect();
    return redisClient;
}

export async function sessionManager() {
    const secret = sessionSecrets();
    return session({
        store: new RedisStore({
            client: await getRedisStore(),
            disableTouch: true, // Gjør slik at man ikke kan endre TTL på valkey store
        }),
        secret,
        saveUninitialized: false,
        resave: false,
        cookie: {
            sameSite: "lax",
            secure: inCloudMode(),
            httpOnly: true,
            maxAge: 60 * 60 * 1000, // 1 time levetid på session cookie
        },
    });
}

export async function inMemorySessionManager(
    store: session.Store = new session.MemoryStore(),
) {
    return session({
        store,
        saveUninitialized: false,
        resave: false,
        secret: sessionSecrets(),
        cookie: {
            secure: inCloudMode(),
            httpOnly: true,
        },
    });
}
