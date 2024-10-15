import express, { type Router } from "express";
import { urlScannerController } from "./urlScannerController";
import { validateRequest } from "@/common/middleware/httpHandlers";
import { getResultsIdRequestSchema } from "./types";
import { OpenAPIRegistry } from "@asteasolutions/zod-to-openapi";
import { createApiResponse } from "@/api-docs/openAPIResponseBuilders";
import { scoreSchema } from "@/models/score";

export const urlScannerRegistry = new OpenAPIRegistry();
export const urlScannerRouter: Router = express.Router();

urlScannerRegistry.register("UrlScanner", getResultsIdRequestSchema);

urlScannerRegistry.registerPath({
    method: "post",
    path: "/api/scanner/scan",
    tags: ["UrlScanner"],
    request: {
        body: {
            content: {
                "application/json": {
                    schema: getResultsIdRequestSchema
                }
            }
        }
    },
    responses: createApiResponse(scoreSchema, "Success"),
});

urlScannerRouter.post("/scan", validateRequest(getResultsIdRequestSchema), urlScannerController.scanUrl);
