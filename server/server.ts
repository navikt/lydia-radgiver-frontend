import http from 'http'
import Application from './app';
import {Config, Server} from './config';
import logger from "./logging"
import { setupRemoteJwkSet } from "./jwks";
import dotenv from "dotenv"
import {Express} from "express";
import {labsApplication} from "./labsApplication";

interface AppProvider {
    application: Express,
    serverConfig: Server
}

const appProvider = async (): Promise<AppProvider> => {
    if (process.env.NAIS_CLUSTER_NAME === "labs-gcp") {
        return Promise.resolve({application : labsApplication(), serverConfig: new Server()})
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
