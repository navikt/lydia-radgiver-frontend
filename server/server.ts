import express from "express"
import path from "path"
import proxy from "./proxy";

const basePath = "/lydia-radgiver";
const buildPath = path.resolve(__dirname, "../../client/dist");
const server = express();
const port = process.env.PORT || 8080;

server.use(basePath, express.static(buildPath));
server.use("/assets", express.static(`${buildPath}/assets`));

server.use(proxy)

server.get(`/internal/isAlive`, (req, res) => {
    res.sendStatus(200);
});

server.get(`/internal/isReady`, (req, res) => {
    res.sendStatus(200);
});



server.listen(port, () => console.log(`Server listening on port ${port}`));
