import express from "express"
import path from "path"
import { lydiaApiProxy } from "./proxy";
import http from 'http'
import { onBehalfOfTokenMiddleWare } from "./onBehalfOf";
import { naisCluster, naisNamespace } from "./env";

const basePath = "/lydia-radgiver";
const buildPath = path.resolve(__dirname, "../../client/dist");
const app = express();
const port = process.env.PORT || 8080;

app.use(basePath, express.static(buildPath));
app.use("/assets", express.static(`${buildPath}/assets`));

app.get(`/internal/isAlive`, (req, res) => {
    res.sendStatus(200);
});

app.get(`/internal/isReady`, (req, res) => {
    res.sendStatus(200);
});


const lydiaApiScope = `api://${naisCluster}.${naisNamespace}.lydia-api/.default`

// Proxy må ligge under healthcheck endepunktene for at de skal nås
app.use("/api",
    onBehalfOfTokenMiddleWare(lydiaApiScope),
    lydiaApiProxy
)

const server = http.createServer(app);

server.listen(port, () => {
    console.log(`Server listening on port ${port}`);
});

process.on("SIGTERM", () => {
    server.close()
})