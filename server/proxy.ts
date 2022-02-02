import { Request } from "express";
import {createProxyMiddleware, Options} from "http-proxy-middleware"

import { Config } from "./config";
import {getBearerToken, hentOnBehalfOfToken, validerAccessToken } from "./onBehalfOf";
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
            router: async req => {
                const accessToken = getBearerToken(req)
                const oboToken = await hentOnBehalfOfToken(accessToken, config)
                req.headers["Authorization"] = `Bearer ${oboToken}`
                return undefined
            }
        }
    }
    createExpressMiddleWare() {
        return createProxyMiddleware(this.options)
    } 
}





