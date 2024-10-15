import { extendZodWithOpenApi } from '@asteasolutions/zod-to-openapi';
import { z } from 'zod';

extendZodWithOpenApi(z);

export type UrlStats = {
    malicious: number;
    suspicious: number;
    undetected: number;
    harmless: number;
    timeout: number;
}


export type GetResultsIdRequest = z.infer<typeof getResultsIdRequestSchema>;
export const getResultsIdRequestSchema = z.object({
    url: z.string({ message: "You must provide a url." })
        .url({ message: "You must provide a valid url." }),
});

export type GetResultIdResponseData = z.infer<typeof getResultIdResponseSchema>;
export const getResultIdResponseSchema = z.object({
    data: z.object({
        type: z.string(),
        id: z.string({ message: "We must get an ID from the API" }),
    }),
});

export type GetAnalysisResultResponseData = z.infer<typeof getAnalysisResultResponseSchema>;
export const getAnalysisResultResponseSchema = z.object({
    data: z.object({
        id: z.string(),
        type: z.string(),
        attributes: z.object({
            stats: z.object({
                malicious: z.number(),
                suspicious: z.number(),
                undetected: z.number(),
                harmless: z.number(),
                timeout: z.number(),
            }),
        }),
    }),
});

