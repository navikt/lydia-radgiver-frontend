import { createProxyMiddleware } from "http-proxy-middleware"
import { isNais } from "./env";

// Service name discovery: https://doc.nais.io/clusters/service-discovery/#service-discovery-in-kubernetes
const targetURI = isNais ? "http://lydia-api" : "http://localhost:8080"

const options = {
    target: targetURI,
    changeOrigin: true,
    pathRewrite: {
        '^/api': '/isAlive' // TODO: skriv denne om til en funksjon
    },
};

export default createProxyMiddleware(options);
