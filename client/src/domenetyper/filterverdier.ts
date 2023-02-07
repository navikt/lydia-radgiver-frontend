import { z } from "zod";
import { fylkeMedKommunerSchema } from "./fylkeOgKommune";
import { næringsgrupperSchema, sektorSchema } from "./virksomhet";
import { eierSchema, IAProsessStatusEnum } from "./domenetyper";

export const filterverdierSchema = z.object({
    fylker: z.array(fylkeMedKommunerSchema),
    neringsgrupper: z.array(næringsgrupperSchema),
    sorteringsnokler: z.string().array(),
    statuser: IAProsessStatusEnum.array(),
    bransjeprogram: z.string().array(),
    filtrerbareEiere: z.array(eierSchema),
    sektorer: z.array(sektorSchema)
});

export type Filterverdier = z.infer<typeof filterverdierSchema>;

const sorteringsverdier = {
    tapte_dagsverk: "Tapte dagsverk",
    mulige_dagsverk: "Mulige dagsverk",
    antall_personer: "Antall arbeidsforhold",
    sykefraversprosent: "Sykefraværsprosent",
    navn: "Alfabetisk på navn",
} as const;

export type Sorteringsverdi = keyof typeof sorteringsverdier;