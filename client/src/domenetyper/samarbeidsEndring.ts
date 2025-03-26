import { z } from "zod";

export const sletteBegrunnelserSchema = z.enum([
	"FINNES_SALESFORCE_AKTIVITET",
	"FINNES_BEHOVSVURDERING",
	"FINNES_SAMARBEIDSPLAN",
	"FINNES_EVALUERING",
]);

export type KanIkkeSletteBegrunnelse = z.infer<typeof sletteBegrunnelserSchema>;

export const kanSletteSamarbeidDto = z.object({
	kanSlettes: z.boolean(),
	begrunnelser: sletteBegrunnelserSchema.array(),
});

export type KanSletteSamarbeid = z.infer<typeof kanSletteSamarbeidDto>;

export const fullføreBegrunnelserSchema = z.enum([
	"INGEN_EVALUERING",
	"INGEN_PLAN",
	"AKTIV_EVALUERING",
	"AKTIV_BEHOVSVURDERING",
	"SAK_I_FEIL_STATUS",
]);

export type KanIkkeFullføreBegrunnelse = z.infer<typeof fullføreBegrunnelserSchema>;

export const kanFullføreSamarbeidDto = z.object({
	kanFullføres: z.boolean(),
	begrunnelser: fullføreBegrunnelserSchema.array(),
});

export type KanFullføreSamarbeid = z.infer<typeof kanFullføreSamarbeidDto>;
