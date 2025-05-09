import { z } from "zod";

export const salesforceInfoSchema = z.object({
    orgnr: z.string(),
    url: z.string(),
    partnerStatus: z.string().nullable(),
});

export type SalesforceInfo = z.infer<typeof salesforceInfoSchema>;

export const salesforceSamarbeidSchema = z.object({
    samarbeidsId: z.number(),
    salesforceLenke: z.string(),
});

export type SalesforceSamarbeid = z.infer<typeof salesforceSamarbeidSchema>;
