import * as redis from 'redis';
import session from "express-session";
import { inCloudMode } from "./app";
import { RedisStore } from "connect-redis";
import logger from "./logging";

const valkeyConfig = {
    username: process.env.VALKEY_USERNAME_FIA_SESSION || "",
    password: process.env.VALKEY_PASSWORD_FIA_SESSION || "",
    uri: process.env.REDIS_URI_FIA_SESSION
};

async function getRedisStore() {
    const redisClient = redis.createClient({
        url: valkeyConfig.uri,
        username: valkeyConfig.username,
        password: valkeyConfig.password,
        pingInterval: 3000
    });
    redisClient.on("error", (err) => {
      logger.error("Feil fra redis: ", err);
    });
    await redisClient.connect();
    return redisClient;
}

export async function sessionManager(){
  return session({
    store: new RedisStore({
      client: await getRedisStore(),
      disableTouch: true, // Gjør slik at man ikke kan endre TTL på valkey store
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
}

export async function inMemorySessionManager() {
  return session({
    saveUninitialized: false,
    resave: false,
    secret: process.env.SESSION_SECRET,
    cookie: {
      secure: inCloudMode(),
      httpOnly: true,
    },
  });
}
