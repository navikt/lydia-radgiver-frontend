import { Request, Response } from "express";
import { ClientRequest } from "http";
import { createProxyMiddleware, Options } from "http-proxy-middleware"

import { Config } from "./config";

export class LydiaApiProxy {
    options : Options
    constructor(config: Config) {
        const whitelistedPaths = [
            '/sykefravarsstatistikk',
            '/iasak/radgiver',
            '/virksomhet',
            '/statusoversikt',
        ]

        this.options = {
            target: config.lydiaApi.uri,
            changeOrigin: true,
            pathRewrite: (path : string) => {
                return path.replace("/api", '');
            },
            onProxyReq: (proxyReq : ClientRequest, _req: Request, res: Response) => {
                if (whitelistedPaths.filter(whitelistedPath => proxyReq.path.startsWith(whitelistedPath)).length > 0) {
                    proxyReq.setHeader('Authorization', `Bearer ${res.locals.on_behalf_of_token}`)
                    proxyReq.setHeader("x-request-id", res.locals.requestId)
                } else {
                    res.sendStatus(404)
                }
            },
        }
    }
    createExpressMiddleWare() {
        return createProxyMiddleware(this.options)
    }
}





