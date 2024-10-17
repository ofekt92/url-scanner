import { env } from "@/common/utils/envConfig";
import { app, logger } from "@/server";
import fs from "fs";
import https from "https";
import path from "path";

const privateKey = fs.readFileSync(path.join(__dirname, '../urlsec.key'), 'utf8');
const certificate = fs.readFileSync(path.join(__dirname, '../urlsec.crt'), 'utf8');
const ca = fs.readFileSync(path.join(__dirname, '../ca.crt'), 'utf8');
const credentials = { key: privateKey, cert: certificate, ca };


// Create HTTPS server
const httpsServer = https.createServer(credentials, app).listen(env.PORT, () => {
  const { NODE_ENV, HOST, PORT } = env;
  logger.info(`Server (${NODE_ENV}) running on port https://${HOST}:${PORT}`);

});

const onCloseSignal = () => {
  logger.info("sigint received, shutting down");
  httpsServer.close(() => {
    logger.info("server closed");
    process.exit();
  });
  setTimeout(() => process.exit(1), 10000).unref(); // Force shutdown after 10s
};

process.on("SIGINT", onCloseSignal);
process.on("SIGTERM", onCloseSignal);
