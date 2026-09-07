import { z } from "zod/v4";
import { datoSchema, eierSchema } from "./domenetyper";

const SAMARBEIDSHISTORIKK_TYPER = [
    "SAMARBEID_OPPRETTET",
    "BEHOVSVURDERING_FULLFØRT",
    "EVALUERING_FULLFØRT",
    "SAMARBEIDSPLAN_OPPRETTET",
    "SAMARBEIDSPLAN_SLETTET",
    "SAMARBEID_FULLFØRT",
    "SAMARBEID_AVBRUTT",
] as const;

export const SamarbeidshistorikkTypeEnum = z.enum(SAMARBEIDSHISTORIKK_TYPER);

export type SamarbeidshistorikkType = z.infer<
    typeof SamarbeidshistorikkTypeEnum
>;

export const samarbeidshistorikkRadSchema = z.object({
    hendelsestype: SamarbeidshistorikkTypeEnum,
    tidspunkt: datoSchema.nullable().optional(),
    aktor: eierSchema.nullable().optional(),
});

export type SamarbeidshistorikkRad = z.infer<
    typeof samarbeidshistorikkRadSchema
>;

export const samarbeidshistorikkBeskrivelse: Record<
    SamarbeidshistorikkType,
    string
> = {
    SAMARBEID_OPPRETTET: "Samarbeid opprettet",
    BEHOVSVURDERING_FULLFØRT: "Behovsvurdering gjennomført",
    EVALUERING_FULLFØRT: "Evaluering gjennomført",
    SAMARBEIDSPLAN_OPPRETTET: "Samarbeidsplan opprettet",
    SAMARBEIDSPLAN_SLETTET: "Samarbeidsplan slettet",
    SAMARBEID_FULLFØRT: "Samarbeid fullført",
    SAMARBEID_AVBRUTT: "Samarbeid avbrutt",
};
