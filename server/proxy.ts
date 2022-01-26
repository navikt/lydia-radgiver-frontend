import { Request } from "express";
import { createProxyMiddleware } from "http-proxy-middleware"
import { isNais } from "./env";

const basePath = "/api"

// Service name discovery: https://doc.nais.io/clusters/service-discovery/#service-discovery-in-kubernetes
const targetURI = isNais ? "http://lydia-api" : "http://localhost:8080"

const options = {
    target: targetURI,
    changeOrigin: true,
    pathRewrite: (path : string, req : Request) => {
        const nyPath = path.replace((basePath), '');
        console.log(`Proxy fra '${req.path}' til '${targetURI + nyPath}'`);
        return nyPath;
    }
};

export const lydiaApiProxy = createProxyMiddleware(options);
