import http from 'http'
import app from './app';

const main = () => {
    const port = process.env.PORT || 8080;
    const server = http.createServer(app);

    server.listen(port, () => {
        console.log(`Server listening on port ${port}`);
    });
    
    process.on("SIGTERM", () => {
        server.close()
    })
}

main()