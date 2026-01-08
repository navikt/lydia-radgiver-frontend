import { Request, Response } from "express";
import { ClientRequest } from "http";
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
    ];

    this.options = {
      target: config.lydiaApi.uri,
      changeOrigin: true,
      pathRewrite: (path: string) => {
        return path.replace("/api", "");
      },
      on: {
        proxyReq: (
          clientRequest: ClientRequest,
          _req: Request,
          res: Response,
        ) => {
          if (
            whitelistedPaths.filter((whitelistedPath) =>
              clientRequest.path.startsWith(whitelistedPath),
            ).length > 0
          ) {
            clientRequest.setHeader(
              "Authorization",
              `Bearer ${res.locals.on_behalf_of_token}`,
            );
            clientRequest.setHeader("x-request-id", res.locals.requestId);
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
