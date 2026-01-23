import http from "http";
import Application from "./app";
import { Config } from "./config";
import logger from "./logging";
import { setupRemoteJwkSet } from "./jwks";
import dotenv from "dotenv";
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import * as types from "./types"; // nødvendig for at ts-node skal skjønne at disse typene eksisterer
import { inMemorySessionManager, sessionManager } from "./SessionStore";

const main = () => {
    dotenv.config({ path: "../env.local" });
    setupRemoteJwkSet()
        .then(async (jwkSet) => {
            const sessonManager = ["local", "lokal"].includes(
                process.env.NAIS_CLUSTER_NAME,
            ) // Treffer både lokal og testkjøring
                ? await inMemorySessionManager()
                : await sessionManager();
            return { jwkSet, sessonManager };
        })
        .then(({ jwkSet, sessonManager }) => {
            const config = new Config({ jwkSet });
            const application = new Application(config, sessonManager);
            const server = http.createServer(application.expressApp);

            const gracefulClose = () => {
                server.close(() => {
                    logger.info("App shutting down...");
                    process.exit(0);
                });
            };

            server.listen(config.server.port, () => {
                logger.info(`Server listening on port ${config.server.port}`);
            });

            process.on("SIGTERM", gracefulClose);
            process.on("SIGINT", gracefulClose);
        });
};

main();
