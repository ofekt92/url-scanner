import { ServiceResponse } from "@/common/models/serviceResponse";
import {
    GetAnalysisResultResponseData,
    getAnalysisResultResponseSchema,
    getResultIdResponseSchema,
} from "./types";

import { Score } from "@/models/score";
import { ScoringService } from "./scoringService";
import { env } from "@/common/utils/envConfig";

export class UrlScannerService {
    private baseUrl: string = "https://www.virustotal.com/api/v3";
    private scoringService: ScoringService;

    constructor() {
        this.scoringService = new ScoringService();
    }

    public async scanUrl(url: string): Promise<ServiceResponse<Score | null>> {

        const resultId = await this.getAnalysisId(url);

        console.log("ResultId: ", resultId);
        if (!resultId) {
            return ServiceResponse.failure("Failed to get result id", null, 500);
        }

        const analaysisResultResponse = await this.getAnalysisResult(resultId);
        console.log("AnalysisResult: ", analaysisResultResponse);

        if (!analaysisResultResponse) {
            return ServiceResponse.failure("Failed to get analysis result", null, 500);
        }

        const score = this.scoringService.calculateScore(analaysisResultResponse.data.attributes.stats);
        console.log("Score: ", score);
        return ServiceResponse.success({ score }, 200);
    }


    private async getAnalysisId(url: string): Promise<string | null> {
        const resultId = await this.callVirusTotalApi(`/urls?url=${url}`, 'POST');
        const zodResult = await getResultIdResponseSchema.safeParseAsync(resultId);

        if (!zodResult.success) {
            return null;
        }

        return resultId.data.id;
    }

    private async getAnalysisResult(resultId: string): Promise<GetAnalysisResultResponseData | null> {
        const analaysisResultResponse = await this.callVirusTotalApi(`/analyses/${resultId}`, 'GET');
        const analysisResultZod = await getAnalysisResultResponseSchema.safeParseAsync(analaysisResultResponse);


        if (!analysisResultZod.success) {
            return null;
        }

        return analaysisResultResponse;
    }

    private async callVirusTotalApi(url: string, method: string, headers?: Record<string, string>, body?: Record<string, string>): Promise<any> {
        const response = await fetch(`${this.baseUrl}/${url}`, {
            method,
            body: JSON.stringify(body),
            headers: {
                'Content-Type': 'application/json',
                'X-Apikey': process.env.VIRUS_TOTAL_API_KEY!,
            },
        });

        if (!response.ok) {
            console.error(await response.text())
            return null;
        }

        return response.json();
    }
}