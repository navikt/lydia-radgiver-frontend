import express from "express";
import path from "path";

export const labsApplication = () => {
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
    return application
}
