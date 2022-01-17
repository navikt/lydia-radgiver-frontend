import { createProxyMiddleware } from "http-proxy-middleware"

// FIXME: Bytt ut dette når serveren er oppe
const options = {
    target: 'https://jsonplaceholder.typicode.com', // Api host
    changeOrigin: true,
    pathRewrite: {
        '^/api': '/posts/1' // Api sin endpoint
    },
};

export default createProxyMiddleware(options);
