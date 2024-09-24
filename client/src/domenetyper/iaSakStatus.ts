import { z } from "zod";

const KanIkkeFullføresÅrsaksType = [
    "BEHOVSVURDERING_IKKE_FULLFØRT",
    "INGEN_FULLFØRT_BEHOVSVURDERING",
    "SAMARBEIDSPLAN_IKKE_FULLFØRT",
    "INGEN_FULLFØRT_SAMARBEIDSPLAN",
] as const;
export const KanIkkeFullføresÅrsaksTypeEnum = z.enum(
    KanIkkeFullføresÅrsaksType,
);

const kanIkkeFullføresÅrsak = z.object({
    samarbeidsId: z.number(),
    samarbeidsNavn: z.string(),
    type: KanIkkeFullføresÅrsaksTypeEnum,
    id: z.string().nullable(),
});

export const iaSakStatusSchema = z.object({
    kanFullføres: z.boolean(),
    årsaker: z.array(kanIkkeFullføresÅrsak),
});

export type IaSakStatus = z.infer<typeof iaSakStatusSchema>;
