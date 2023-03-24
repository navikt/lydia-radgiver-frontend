import {Request, Response} from "express";
import {ClientRequest} from "http";
import {createProxyMiddleware, Options} from "http-proxy-middleware"
import logger from "./logging";
import {Config} from "./config";
import winston from "winston";
import http from "http";

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
                return nyPath;
            },
            onProxyReq: (proxyReq : ClientRequest, req: Request, res: Response) => {
                proxyReq.setHeader('Authorization', `Bearer ${res.locals.on_behalf_of_token}`)
                proxyReq.setHeader("x-request-id", res.locals.requestId)
            },
            onProxyRes: (proxyRes: http.IncomingMessage, req: Request) => {
                if(proxyRes.statusCode >= 500 && proxyRes.statusCode < 600) {
                    logger.error(`Frackend proxy fikk serverfeil med statuskode: ${proxyRes.statusCode} melding: ${proxyRes.statusMessage}`)
                }
                if(proxyRes.statusCode >= 400 && proxyRes.statusCode < 500) {
                    logger.warn(`Frackend proxy fikk klientfeil med statuskode: ${proxyRes.statusCode} melding: ${proxyRes.statusMessage}`)
                }
            },
        }
    }
    createExpressMiddleWare() {
        return createProxyMiddleware(this.options)
    }
}





