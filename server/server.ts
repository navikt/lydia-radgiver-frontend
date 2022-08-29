import http from 'http'
import Application from './app';
import {Config, Server} from './config';
import logger from "./logging"
import { setupRemoteJwkSet } from "./jwks";
import dotenv from "dotenv"
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import express, {Express} from "express";
import path from "path"; // nødvendig for at ts-node skal skjønne at disse typene eksisterer

interface AppProvider {
    application: Express,
    serverConfig: Server
}


const appProvider = async (): Promise<AppProvider> => {
    if (process.env.NAIS_CLUSTER_NAME === "labs-gcp") {
        const application = express()
        application.get(
            ["/internal/isAlive", "/internal/isReady"],
            (req, res) => {
                res.sendStatus(200);
            }
        );
        const buildPath = path.resolve(__dirname, "../client/dist");
        application.get("/assets", express.static(`${buildPath}/assets`));
        application.use("/", express.static(buildPath));
        application.use("/*", express.static(buildPath));
        return Promise.resolve({application, serverConfig: new Server()})
    } else {
        return setupRemoteJwkSet()
            .then(jwkSet => {
                const config = new Config({jwkSet})
                const application = new Application(config)
                return {application: application.expressApp, serverConfig: config.server}
            })
    }
}

const main = () => {
    dotenv.config({ path: "../env.local"})
    appProvider().then(appProvider => {
        const server = http.createServer(appProvider.application);

        const gracefulClose = () => {
            server.close(() => {
                logger.info("App shutting down...")
                process.exit(0)
            })
        }

        server.listen(appProvider.serverConfig.port, () => {
            logger.info(`Server listening on port ${appProvider.serverConfig.port}`);
        });

        process.on("SIGTERM", gracefulClose)
        process.on("SIGINT", gracefulClose)
    })



}

main()
