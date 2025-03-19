import { z } from "zod";

export const begrunnelserSchema = z.enum([
	"FINNES_SALESFORCE_AKTIVITET",
	"FINNES_BEHOVSVURDERING",
	"FINNES_SAMARBEIDSPLAN",
	"FINNES_EVALUERING",
]);

export type KanIkkeSletteBegrunnelse = z.infer<typeof begrunnelserSchema>;

export const kanSletteSamarbeidDto = z.object({
	kanSlettes: z.boolean(),
	begrunnelser: begrunnelserSchema.array(),
});

export type KanSletteSamarbeid = z.infer<typeof kanSletteSamarbeidDto>;
