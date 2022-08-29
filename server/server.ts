import http from 'http'
import Application from './app';
import {Config, isInLabsMode, ServerConfig} from './config';
import logger from "./logging"
import { setupRemoteJwkSet } from "./jwks";
import dotenv from "dotenv"
import {Express} from "express";
import {labsApplication} from "./labsApplication";

interface AppProvider {
    application: Express,
    serverConfig: ServerConfig
}

const appProvider = async (): Promise<AppProvider> => {
    if (isInLabsMode()) {
        return Promise.resolve({application: labsApplication(), serverConfig: new ServerConfig()})
    } else {
        return setupRemoteJwkSet()
            .then(jwkSet => {
                const config = new Config({jwkSet})
                const application = new Application(config)
                return {application: application.expressApp, serverConfig: config.serverConfig}
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
