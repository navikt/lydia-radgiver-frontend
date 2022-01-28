import express, {NextFunction, Request, Response} from "express"
import path from "path"
import { lydiaApiProxy } from "./proxy";

import {AuthError, preAuthSjekk} from "./onBehalfOf";

const basePath = "/lydia-radgiver";
const buildPath = path.resolve(__dirname, "../client/dist");
const app = express();

app.use(basePath, express.static(buildPath));
app.use("/assets", express.static(`${buildPath}/assets`));

app.get(`/internal/isAlive`, (req, res) => {
    res.sendStatus(200);
});

app.get(`/internal/isReady`, (req, res) => {
    res.sendStatus(200);
});

// Proxy må ligge under healthcheck endepunktene for at de skal nås
app.use("/api",
    preAuthSjekk,
    lydiaApiProxy
)

app.use((error: Error, req: Request, res: Response, _: NextFunction) => {
    if (error instanceof AuthError) {
        return res.status(401).send(error.message)
    }
    console.error(error)
    return res.status(500).send("Intern server-feil")
})

export default app;