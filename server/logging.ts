import winston from "winston";

const stdoutLogger = winston.createLogger({
    level: "info",
    format:
        process.env.NODE_ENV === "development"
            ? winston.format.cli()
            : winston.format.json(),
    transports: [new winston.transports.Console()],
    exceptionHandlers: [new winston.transports.Console()],
});

const info = (message: string, ...meta: any[]) => {
    stdoutLogger.info(message, ...meta);
};

const warn = (message: string, ...meta: any[]) => {
    stdoutLogger.warn(message, ...meta);
};

const error = (message: string, ...meta: any[]) => {
    stdoutLogger.error(message, ...meta);
};

export default {
    info,
    warn,
    error,
};
