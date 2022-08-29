import express, {NextFunction, Request, Response} from "express";
import helmet from "helmet";
import path from "path";
import apiMetrics from "prometheus-api-metrics";

import {LydiaApiProxy} from "./proxy";
import {
    onBehalfOfTokenMiddleware,
    validerTokenFraFakedings,
    validerTokenFraWonderwall,
} from "./onBehalfOf";
import {Config, isInLocalMode} from "./config";
import logger from "./logging";
import {AuthError} from "./error";
import {hentInnloggetAnsattMiddleware} from "./brukerinfo";
import {memorySessionManager, redisSessionManager} from "./RedisStore";

export default class Application {
    expressApp: express.Express;

    constructor(config: Config = new Config()) {
        const buildPath = path.resolve(__dirname, "../client/dist");
        this.expressApp = express();
        this.expressApp.set("trust proxy", 1);

        this.expressApp.use(apiMetrics());
        this.expressApp.use(helmet());

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
            isInLocalMode()
                ? validerTokenFraFakedings(config.azureConfig, config._jwkSet)
                : validerTokenFraWonderwall(config.azureConfig, config._jwkSet);

        this.expressApp.get("/loggut", (req, res, next) => {
            req.session.destroy((err) => {
                if (err) {
                    next(err)
                }
            })
            return res.redirect("/oauth2/logout?post_logout_redirect_uri=https://nav.no")
        })

        this.expressApp.use(
            "/innloggetAnsatt",
            tokenValidator,
            hentInnloggetAnsattMiddleware
        );

        const lydiaApiProxy = new LydiaApiProxy(
            config
        ).createExpressMiddleWare();
        // Proxy må ligge under healthcheck endepunktene for at de skal nås

        this.expressApp.use(
            "/api",
            tokenValidator,
            isInLocalMode()
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
