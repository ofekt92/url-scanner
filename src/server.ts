import cors from "cors";

import express, { type Express } from "express";
import helmet from "helmet";
import { pino } from "pino";

import { openAPIRouter } from "@/api-docs/openAPIRouter";
import { healthCheckRouter } from "@/api/healthCheck/healthCheckRouter";
import errorHandler from "@/common/middleware/errorHandler";
import rateLimiter from "@/common/middleware/rateLimiter";
import requestLogger from "@/common/middleware/requestLogger";
import { env } from "@/common/utils/envConfig";
import { urlScannerRouter } from "./api/urlScanner/urlScannerRouter";


const logger = pino({ name: "server start" });
const app: Express = express();

// Set the application to trust the reverse proxy
app.set("trust proxy", true);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors({ origin: env.CORS_ORIGIN, credentials: true }));
app.use(helmet());
app.use(rateLimiter);

app.use(requestLogger);
app.use("*", (req, res, next) => {
    logger.info(`request received: ${req.method}`);
    console.log(`request received: ${req.body}`);
    next();
});

app.use("/health-check", healthCheckRouter);
app.use("/api/scanner", urlScannerRouter);

app.use(openAPIRouter);

app.use(errorHandler());

export { app, logger };
