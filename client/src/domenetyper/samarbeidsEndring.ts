import { z } from "zod/v4";

export const sletteBegrunnelserSchema = z.enum([
    "FINNES_SALESFORCE_AKTIVITET",
    "FINNES_BEHOVSVURDERING",
    "FINNES_SAMARBEIDSPLAN",
    "FINNES_EVALUERING",
]);

export const fullføreBegrunnelserSchema = z.enum([
    "INGEN_EVALUERING",
    "INGEN_PLAN",
    "AKTIV_EVALUERING",
    "AKTIV_BEHOVSVURDERING",
    "SAK_I_FEIL_STATUS",
]);

export const muligeHandlinger = z.enum(["slettes", "fullfores", "avbrytes"]);

export const kanIkkeGjennomføreBegrunnelse = z.enum([
    ...sletteBegrunnelserSchema.options,
    ...fullføreBegrunnelserSchema.options,
]);

export const kanGjennomføreStatusendringDto = z.object({
    advarsler: kanIkkeGjennomføreBegrunnelse.array(),
    blokkerende: kanIkkeGjennomføreBegrunnelse.array(),
    kanGjennomføres: z.boolean(),
});

export type MuligSamarbeidsgandling = z.infer<typeof muligeHandlinger>;
export type KanIkkeGjennomføreBegrunnelse = z.infer<
    typeof kanIkkeGjennomføreBegrunnelse
>;
export type KanGjennomføreStatusendring = z.infer<
    typeof kanGjennomføreStatusendringDto
>;
