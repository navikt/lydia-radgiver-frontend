import http from 'http'
import Application from './app';
import { Config } from './config';

const main = () => {
    const config = new Config()
    const application = new Application(config)
    const server = http.createServer(application.expressApp);

    const gracefulClose = () => {
        server.close(() => {
            console.log("App shutting down...")
            process.exit(0)
        })
    }

    server.listen(config.server.port, () => {
        console.log(`Server listening on port ${config.server.port}`);
    });
    
    process.on("SIGTERM", gracefulClose)
    process.on("SIGINT", gracefulClose)
}

main()