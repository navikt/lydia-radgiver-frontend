import RedisStore from "connect-redis"
import Redis, {RedisOptions} from "ioredis";
import session from "express-session";
import {inCloudMode} from "./app";

export const redisSessionManager = () => {
    const redisConfig: RedisOptions = {
        host: process.env.REDIS_HOST || 'redis',
        port: +process.env.REDIS_PORT
    }
    const client = new Redis(redisConfig);
    return session({
        store: new RedisStore({
            client,
            disableTouch: true, // Gjør slik at man ikke kan endre TTL på redis store
        }),
        secret: process.env.SESSION_SECRET, // Hent fra gcp
        saveUninitialized: false,
        resave: false,
        cookie: {
            sameSite: "lax",
            secure: inCloudMode(),
            httpOnly: true,
            maxAge: 60 * 60 * 1000, // 1 time levetid på session cookie
        },
    });
};

export const memorySessionManager = () => {
    return session({
        saveUninitialized: false,
        resave: false,
        secret: process.env.SESSION_SECRET,
        cookie: {},
    });
};
