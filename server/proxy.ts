import { Request } from "express";
import {createProxyMiddleware, Options} from "http-proxy-middleware"
import { Config } from "./config";
import {hentAccessToken, hentOnBehalfOfToken } from "./onBehalfOf";


export class LydiaApiProxy {
    options : Options
    constructor(config: Config) {
        const targetURI = config.lydiaApi.uri
        this.options = {
            target: targetURI,
            changeOrigin: true,
            pathRewrite: (path : string, req : Request) => {
                const nyPath = path.replace("/api", '');
                console.log(`Proxy fra '${req.path}' til '${targetURI + nyPath}'`);
                return nyPath;
            },
            router: async req => {
                const accessToken = hentAccessToken(req)
                // @ts-ignore
                req.headers["authorization"] = `Bearer ${await hentOnBehalfOfToken(accessToken, config)}`
                return undefined
            }
        }
    }
    createExpressMiddleWare() {
        return createProxyMiddleware(this.options)
    } 
}





