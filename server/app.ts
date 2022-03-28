import express, { NextFunction, Request, Response } from "express";
import path from "path";
import apiMetrics from "prometheus-api-metrics"

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


export default class Application {
    expressApp: express.Express;

    constructor(config: Config = new Config()) {
        const basePath = "/lydia-radgiver";
        const buildPath = path.resolve(__dirname, "../client/dist");
        const storybookPath = path.resolve(__dirname, "../client/storybook-static");
        this.expressApp = express();

        this.expressApp.get(["/internal/isAlive", "/internal/isReady"], (req, res) => {
            res.sendStatus(200);
        });

        this.expressApp.use(apiMetrics())

        this.expressApp.use(basePath, express.static(buildPath));
        this.expressApp.use("/assets", express.static(`${buildPath}/assets`));

        this.expressApp.use("/internal/storybook", express.static(storybookPath));
        this.expressApp.use(
            "/storybook-static/assets",
            express.static(`${storybookPath}/assets`)
        );



        this.expressApp.use(
            ["local", "lokal"].includes(process.env.NAIS_CLUSTER_NAME)
                ? memorySessionManager()
                : redisSessionManager()
        );
        const lydiaApiProxy = new LydiaApiProxy(config).createExpressMiddleWare();
        const tokenValidator =
            process.env.NAIS_CLUSTER_NAME === "lokal"
                ? validerTokenFraFakedings(config.azure, config._jwkSet)
                : validerTokenFraWonderwall(config.azure, config._jwkSet);

        // Proxy må ligge under healthcheck endepunktene for at de skal nås
        this.expressApp.use(
            "/api",
            tokenValidator,
            process.env.NAIS_CLUSTER_NAME === "lokal"
                ? (req, res, next) => {
                      return next();
                  }
                : onBehalfOfTokenMiddleware(config),
            lydiaApiProxy
        );

        this.expressApp.use(
            "/innloggetAnsatt",
            tokenValidator,
            hentInnloggetAnsattMiddleware
        );

        this.expressApp.use(
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
