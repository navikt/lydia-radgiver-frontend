import express, {NextFunction, Request, Response} from "express"
import path from "path"
import { LydiaApiProxy } from "./proxy";

import {AuthError, preAuthSjekk} from "./onBehalfOf";
import { Config } from "./config";

export default class Application {
    expressApp: express.Express
    constructor(config : Config = new Config()){
        const basePath = "/lydia-radgiver";
        const buildPath = path.resolve(__dirname, "../client/dist");
        this.expressApp = express();
        
        this.expressApp.use(basePath, express.static(buildPath));
        this.expressApp.use("/assets", express.static(`${buildPath}/assets`));
        
        this.expressApp.get(`/internal/isAlive`, (req, res) => {
            res.sendStatus(200);
        });
        
        this.expressApp.get(`/internal/isReady`, (req, res) => {
            res.sendStatus(200);
        });
        
        const lydiaApiProxy = new LydiaApiProxy(config);
        // Proxy må ligge under healthcheck endepunktene for at de skal nås
        this.expressApp.use("/api",
            preAuthSjekk,
            lydiaApiProxy.createExpressMiddleWare()
        )
        
        this.expressApp.use((error: Error, req: Request, res: Response, _: NextFunction) => {
            if (error instanceof AuthError) {
                return res.status(401).send(error.message)
            }
            console.error(error)
            return res.status(500).send("Intern server-feil")
        })
    }
}