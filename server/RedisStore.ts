import Redis, {RedisOptions} from "ioredis";
import session from "express-session";
import connectRedis from "connect-redis";

export const redisSessionManager = () => {
    const redisStore = connectRedis(session);
    const redisConfig: RedisOptions = {
        host: process.env.REDIS_HOST || 'redis',
        port: +process.env.REDIS_PORT
    }
    const client = new Redis(redisConfig);
    return session({
        store: new redisStore({
            client,
            disableTouch: true, // Gjør slik at man ikke kan endre TTL på redis store
        }),
        secret: process.env.SESSION_SECRET, // Hent fra gcp
        saveUninitialized: false,
        resave: false,
        cookie: {
            sameSite: "strict",
            secure: true,
            httpOnly: true,
            maxAge: Date.now() + 3600000, // 1 time levetid på session cookie
        },
    });
};

export const memorySessionManager = () => {
    return session({
        saveUninitialized: false,
        resave: false,
        secret: "lovely cat",
        cookie: {},
    });
};
