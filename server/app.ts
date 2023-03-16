import express, { NextFunction, Request, Response } from "express";
import helmet from "helmet";
import path from "path";
import apiMetrics from "prometheus-api-metrics";

import { LydiaApiProxy } from "./proxy";
import {
    onBehalfOfTokenMiddleware,
    validerTokenFraFakedings,
    validerTokenFraWonderwall,
} from "./onBehalfOf";
import { Config } from "./config";
import logger from "./logging";
import { AuthError } from "./error";
import { hentInnloggetAnsattMiddleware } from "./brukerinfo";
import { memorySessionManager, redisSessionManager } from "./RedisStore";
import { randomUUID } from "crypto";
import { doubleCsrf } from "csrf-csrf";
import cookieParser from "cookie-parser";

export const inCloudMode = () => process.env.NAIS_CLUSTER_NAME === "dev-gcp" || process.env.NAIS_CLUSTER_NAME === "prod-gcp"

export const inLocalMode = () => process.env.NAIS_CLUSTER_NAME === "lokal"


export default class Application {
    expressApp: express.Express;

    constructor(config: Config = new Config()) {
        const buildPath = path.resolve(__dirname, "../client/dist");
        this.expressApp = express();
        this.expressApp.set("trust proxy", 1);

        this.expressApp.use(apiMetrics());
            this.expressApp.use(helmet({
                contentSecurityPolicy: {
                    directives: {
                        defaultSrc: ["'self'"],
                        scriptSrc: ["'self'", "'unsafe-inline'", "'unsafe-eval'"],
                        connectSrc: ["'self'", "*.nav.no"],
                        styleSrc: ["'self'", "'unsafe-inline'"],
                        imgSrc: ["'self'"],
                    },
                }
            }));

        this.expressApp.all("*", (req, res, next) => {
            res.locals.requestId = randomUUID()
            next()
        })

        this.expressApp.get(
            ["/internal/isAlive", "/internal/isReady"],
            (req, res) => {
                res.sendStatus(200);
            }
        );

        this.expressApp.use(
            ["local", "lokal"].includes(process.env.NAIS_CLUSTER_NAME) // Treffer både lokal og testkjøring
                ? memorySessionManager()
                : redisSessionManager()
        );

        const tokenValidator =
            inLocalMode()
                ? validerTokenFraFakedings(config.azure, config._jwkSet)
                : validerTokenFraWonderwall(config.azure, config._jwkSet);

        const {
            generateToken, // Use this in your routes to provide a CSRF hash cookie and token.
            doubleCsrfProtection, // This is the default CSRF protection middleware.
        } = doubleCsrf({
            getSecret: () => config.secrets.csrf,
            cookieName: "__fia.intern.nav.no-x-csrf-token"
        });
        const csrfTokenRoute = (request, response) => {
            const csrfToken = generateToken(response, request);
            response.json({ csrfToken });
        };
        this.expressApp.use(cookieParser(config.secrets.cookie))
        this.expressApp.get("/csrf-token", tokenValidator, csrfTokenRoute);
        this.expressApp.use(doubleCsrfProtection);

        this.expressApp.get("/loggut", (req, res, next) => {
            req.session.destroy((err) => {
                if (err) {
                    next(err)
                }
            })
            return res.redirect("/oauth2/logout?post_logout_redirect_uri=https://nav.no")
        })

        this.expressApp.get(
            "/innloggetAnsatt",
            tokenValidator,
            hentInnloggetAnsattMiddleware(config.azure, config._jwkSet)
        );

        const lydiaApiProxy = new LydiaApiProxy(
            config
        ).createExpressMiddleWare();
        // Proxy må ligge under healthcheck endepunktene for at de skal nås

        this.expressApp.use(
            "/api",
            tokenValidator,
            inLocalMode()
                ? (req, res, next) => {
                    return next();
                }
                : onBehalfOfTokenMiddleware(config),
            lydiaApiProxy
        );
        this.expressApp.get("/assets", express.static(`${buildPath}/assets`));
        this.expressApp.use("/", express.static(buildPath));

        this.expressApp.use("/*", express.static(buildPath));

        this.expressApp.use(
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            (error: Error, req: Request, res: Response, _: NextFunction) => {
                if (error instanceof AuthError) {
                    return res.status(401).send(error.message);
                }
                logger.error(error.message);
                return res.status(500).send("Intern server-feil");
            }
        );
    }
}
