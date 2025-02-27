import Redis, { RedisOptions } from "iovalkey";
import session from "express-session";
import { inCloudMode } from "./app";
import { RedisStore } from "connect-redis";

export const sessionManager = () => {
  const valkeyConfig: RedisOptions = {
    username: process.env.VALKEY_USERNAME_FIA_SESSION || "brukernavn",
    password: process.env.VALKEY_PASSWORD_FIA_SESSION || "passord",
    tls: {
      host: process.env.VALKEY_HOST_FIA_SESSION,
      port: Number(process.env.VALKEY_PORT_FIA_SESSION),
    }
  };
  const client = new Redis(valkeyConfig);
  return session({
    store: new RedisStore({
      client,
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
};

export const inMemorySessionManager = () => {
  return session({
    saveUninitialized: false,
    resave: false,
    secret: process.env.SESSION_SECRET,
    cookie: {},
  });
};
