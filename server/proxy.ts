import {Request, Response} from "express";
import {createProxyMiddleware, Options} from "http-proxy-middleware"

import { Config } from "./config";
import {getBearerToken, hentOnBehalfOfToken } from "./onBehalfOf";
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
                logger.info(`Proxy fra '${req.path}' til '${targetURI + nyPath}'`);
                return nyPath;
            },
            onProxyReq: async (proxyReq, req: Request, res: Response) => {
                const accessToken = getBearerToken(req)
                try {
                    const oboToken = await hentOnBehalfOfToken(accessToken, config)
                    proxyReq.setHeader('Authorization', `Bearer ${oboToken}`)
                } catch (e) {
                    res.status(418).send("Teapot")
                }
            }
        }
    }
    createExpressMiddleWare() {
        return createProxyMiddleware(this.options)
    } 
}





