import { ClientRequest, IncomingMessage, ServerResponse } from "http";
import { Response } from "express";
import { createProxyMiddleware, Options } from "http-proxy-middleware";
import { Config } from "./config";

export class LydiaApiProxy {
    options: Options;
    constructor(config: Config) {
        const whitelistedPaths = [
            "/sykefravarsstatistikk",
            "/iasak/radgiver",
            "/virksomhet",
            "/statusoversikt",
            "/iatjenesteoversikt",
            "/iasak/minesaker",
            `/iasak/team`,
            `/iasak/nyflyt`,
            `/api/v1`,
        ];

        this.options = {
            target: config.lydiaApi.uri,
            changeOrigin: true,
            pathRewrite: (path: string) => {
                if (path.startsWith("/proxy")) {
                    return path.replace("/proxy", "");
                } else if (
                    path.startsWith("/api") &&
                    !path.startsWith("/api/v1") // For å tillate at /api/v1 ikke blir omskrevet til /v1
                ) {
                    return path.replace("/api", "");
                }
                return path;
            },
            on: {
                proxyReq: (
                    clientRequest: ClientRequest,
                    _req: IncomingMessage,
                    rawRes: ServerResponse<IncomingMessage>,
                ) => {
                    const res = rawRes as Response;
                    if (
                        whitelistedPaths.filter((whitelistedPath) =>
                            clientRequest.path.startsWith(whitelistedPath),
                        ).length > 0
                    ) {
                        clientRequest.setHeader(
                            "Authorization",
                            `Bearer ${res.locals.on_behalf_of_token}`,
                        );
                        clientRequest.setHeader(
                            "x-request-id",
                            res.locals.requestId,
                        );
                    } else {
                        res.sendStatus(404);
                    }
                },
            },
        };
    }
    createExpressMiddleWare() {
        return createProxyMiddleware(this.options);
    }
}
