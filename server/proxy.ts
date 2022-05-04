import {Request, Response} from "express";
import { ClientRequest } from "http";
import {createProxyMiddleware, Options} from "http-proxy-middleware"

import { Config } from "./config";
import logger from "./logging"

export class LydiaApiProxy {
    options : Options
    constructor(config: Config) {
        const targetURI = config.lydiaApi.uri
        this.options = {
            target: targetURI,
            changeOrigin: true,
            pathRewrite: (path : string, req : Request) => {
                const nyPath = path.replace("/api", '');
                return nyPath;
            },
            onProxyReq: (proxyReq : ClientRequest, req: Request, res: Response) => {
                proxyReq.setHeader('Authorization', `Bearer ${res.locals.on_behalf_of_token}`)
            }
        }
    }
    createExpressMiddleWare() {
        return createProxyMiddleware(this.options)
    } 
}





