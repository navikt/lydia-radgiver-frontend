import http from 'http'
import app from './app';

const main = () => {
    const port = process.env.PORT || 8080;
    const server = http.createServer(app);

    const gracefulClose = () => {
        server.close(() => {
            console.log("App shutting down...")
            process.exit(0)
        })
    }

    server.listen(port, () => {
        console.log(`Server listening on port ${port}`);
    });
    
    process.on("SIGTERM", gracefulClose)
    process.on("SIGINT", gracefulClose)
}

main()