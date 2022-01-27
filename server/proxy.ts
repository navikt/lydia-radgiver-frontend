import { Request } from "express";
import {createProxyMiddleware, Options} from "http-proxy-middleware"
import { isNais } from "./env";
import {hentAccessToken, hentOnBehalfOfToken, lydiaApiScope} from "./onBehalfOf";

const basePath = "/api"

// Service name discovery: https://doc.nais.io/clusters/service-discovery/#service-discovery-in-kubernetes
const targetURI = isNais ? "http://lydia-api" : "http://localhost:8080"

const options: Options = {
    target: targetURI,
    changeOrigin: true,
    pathRewrite: (path : string, req : Request) => {
        const nyPath = path.replace((basePath), '');
        console.log(`Proxy fra '${req.path}' til '${targetURI + nyPath}'`);
        return nyPath;
    },
    router: async req => {
        const accessToken = hentAccessToken(req)
        // @ts-ignore
        req.headers["authorization"] = `Bearer ${await hentOnBehalfOfToken(lydiaApiScope, accessToken)}`
        return undefined
    }
};

export const lydiaApiProxy = createProxyMiddleware(options);
