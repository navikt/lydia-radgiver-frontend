import {Request, Response} from "express";
import {ClientRequest} from "http";
import {createProxyMiddleware, Options} from "http-proxy-middleware"
import logger from "./logging";
import {Config} from "./config";
import winston from "winston";

export class LydiaApiProxy {
    options : Options
    constructor(config: Config) {
        const targetURI = config.lydiaApi.uri
        this.options = {
            target: targetURI,
            changeOrigin: true,
            logLevel: "debug",
            pathRewrite: (path : string, req : Request) => {
                const nyPath = path.replace("/api", '');
                logger.info(`DEBUG pcn: pathRewrite original: ${path} ny: ${nyPath}`)
                return nyPath;
            },
            onProxyReq: (proxyReq : ClientRequest, req: Request, res: Response) => {
                proxyReq.setHeader('Authorization', `Bearer ${res.locals.on_behalf_of_token}`)
                proxyReq.setHeader("x-request-id", res.locals.requestId)
                logger.info(`DEBUG pcn: Proxying path: ${req.path}`)
            },
            onOpen: () => {
                logger.info(`DEBUG pcn: Proxy onOpen`)
            },
            onClose: () => {
                logger.info(`DEBUG pcn: Proxy onClose`)
            },
            onProxyRes: () => {
                logger.info(`DEBUG pcn: Proxy onProxyRes`)
            },
            onProxyReqWs: () => {
                logger.info(`DEBUG pcn: Proxy onProxyReqWs`)
            },
            onError: (err: Error) => {
                logger.info(`DEBUG pcn: Proxy onError: ${err.name} - ${err.message}\n${err.stack}`)
            }
        }
    }
    createExpressMiddleWare() {
        return createProxyMiddleware(this.options)
    }
}





