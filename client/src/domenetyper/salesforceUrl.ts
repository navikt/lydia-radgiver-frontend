import { z } from "zod";

export const salesforceUrlSchema = z.object({
    orgnr: z.string(),
    url: z.string(),
})

export type SalesforceUrl = z.infer<typeof salesforceUrlSchema>;
