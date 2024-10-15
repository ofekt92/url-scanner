import { z } from 'zod';
import { extendZodWithOpenApi } from '@asteasolutions/zod-to-openapi';

extendZodWithOpenApi(z);

export type Score = z.infer<typeof scoreSchema>;
export const scoreSchema = z.object({
    score: z.number(),
});

export type Stats = {
    malicious: number;
    suspicious: number;
    undetected: number;
    harmless: number;
    timeout: number;
}

