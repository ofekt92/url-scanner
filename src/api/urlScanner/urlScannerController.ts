import type { Request, RequestHandler, Response } from "express";

import { UrlScannerService } from "./urlScannerService";
import { handleServiceResponse, validateRequest } from "@/common/middleware/httpHandlers";
import { GetResultsIdRequest, getResultsIdRequestSchema } from "./types";

class UrlScannerController {
    public scanUrl: RequestHandler = async (req: Request, res: Response) => {

        const request: GetResultsIdRequest = req.body;
        const serviceResponse = await (new UrlScannerService()).scanUrl(request.url);

        return handleServiceResponse(serviceResponse, res);
    }
}

export const urlScannerController = new UrlScannerController();