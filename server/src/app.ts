import { randomUUID } from "crypto";
import path from "path";
import cookieParser from "cookie-parser";
import { doubleCsrf } from "csrf-csrf";
import express, {
    NextFunction,
    Request,
    RequestHandler,
    Response,
} from "express";
import helmet from "helmet";
import apiMetrics from "prometheus-api-metrics";
import { hentInnloggetAnsattMiddleware } from "./brukerinfo";
import { Config } from "./config";
import { AuthError } from "./error";
import logger from "./logging";
import {
    onBehalfOfTokenMiddleware,
    validerTokenFraFakedings,
    validerTokenFraWonderwall,
} from "./onBehalfOf";
import { LydiaApiProxy } from "./proxy";

export const inCloudMode = () =>
    process.env.NAIS_CLUSTER_NAME === "dev-gcp" ||
    process.env.NAIS_CLUSTER_NAME === "prod-gcp";

export const inLocalMode = () => process.env.NAIS_CLUSTER_NAME === "lokal";

export default class Application {
    expressApp: express.Express;

    constructor(config: Config = new Config(), sessionManager: RequestHandler) {
        const buildPath = path.resolve(__dirname, "../client/dist");
        this.expressApp = express();
        this.expressApp.set("trust proxy", 1);

        this.expressApp.use(apiMetrics({ metricsPath: "/internal/metrics" }));
        this.expressApp.use(
            helmet({
                contentSecurityPolicy: {
                    directives: {
                        defaultSrc: ["'self'"],
                        scriptSrc: [
                            "'self'",
                            "'unsafe-inline'",
                            "'unsafe-eval'",
                            "https://cdn.nav.no/",
                        ],
                        connectSrc: ["'self'", "*.nav.no"],
                        styleSrc: ["'self'", "'unsafe-inline'"],
                        imgSrc: ["'self'", "data:", "*.nav.no"],
                    },
                },
            }),
        );

        this.expressApp.all("/{*any}", (req, res, next) => {
            res.locals.requestId = randomUUID();
            next();
        });

        this.expressApp.get(
            ["/internal/isAlive", "/internal/isReady"],
            (req, res) => {
                res.sendStatus(200);
            },
        );

        this.expressApp.use(sessionManager);

        const tokenValidator = inLocalMode()
            ? validerTokenFraFakedings(config.azure, config._jwkSet)
            : validerTokenFraWonderwall(config.azure, config._jwkSet);

        const {
            generateCsrfToken, // Use this in your routes to provide a CSRF hash cookie and token.
            doubleCsrfProtection, // This is the default CSRF protection middleware.
        } = doubleCsrf({
            getSecret: () => config.secrets.csrf,
            getSessionIdentifier: (req: Request) => req.session.id,
            cookieName: "__fia.intern.nav.no-x-csrf-token",
        });
        const csrfTokenRoute = (request: Request, response: Response) => {
            const csrfToken = generateCsrfToken(request, response, {
                overwrite: true,
                validateOnReuse: true,
            });
            response.json({ csrfToken });
        };
        this.expressApp.use(cookieParser(config.secrets.cookie));
        this.expressApp.get("/csrf-token", tokenValidator, csrfTokenRoute);
        this.expressApp.use(doubleCsrfProtection);

        this.expressApp.get("/loggut", (req, res, next) => {
            req.session.destroy((err) => {
                if (err) {
                    next(err);
                }
            });
            return res.redirect(
                "/oauth2/logout?post_logout_redirect_uri=https://nav.no",
            );
        });

        this.expressApp.get(
            "/innloggetAnsatt",
            tokenValidator,
            hentInnloggetAnsattMiddleware(config.azure, config._jwkSet),
        );

        const lydiaApiProxy = new LydiaApiProxy(
            config,
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
            lydiaApiProxy,
        );

        this.expressApp.use(
            "/proxy",
            tokenValidator,
            inLocalMode()
                ? (req, res, next) => {
                      return next();
                  }
                : onBehalfOfTokenMiddleware(config),
            lydiaApiProxy,
        );

        this.expressApp.get("/assets", express.static(`${buildPath}/assets`));
        this.expressApp.use("/", express.static(buildPath));

        this.expressApp.use("/{*any}", express.static(buildPath));

        this.expressApp.use(
            (
                error: Error,
                req: Request,
                res: Response,
                _next: NextFunction,
            ) => {
                if (error instanceof AuthError) {
                    return res.status(401).send(error.message);
                }
                logger.error(error.message);
                return res.status(500).send("Intern server-feil");
            },
        );
    }
}
