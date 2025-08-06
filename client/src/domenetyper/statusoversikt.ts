import { z } from "zod/v4";
import { IAProsessStatusEnum } from "./domenetyper";

export const statusoversiktSchema = z.object({
    status: IAProsessStatusEnum,
    antall: z.number(),
});

export type Statusoversikt = z.infer<typeof statusoversiktSchema>;

const statusoversiktListeSchema = z.array(statusoversiktSchema);

export const statusoversiktListeResponsSchema = z.object({
    data: statusoversiktListeSchema,
});

export type StatusoversiktListeRespons = z.infer<
    typeof statusoversiktListeResponsSchema
>;
export type StatusOversiktListe = z.infer<typeof statusoversiktListeSchema>;
