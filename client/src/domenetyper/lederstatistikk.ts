import { z } from "zod";
import { IAProsessStatusEnum } from "./domenetyper";

export const lederstatistikkSchema = z.object({
    status: IAProsessStatusEnum,
    antall: z.number(),
});

export type Lederstatistikk = z.infer<typeof lederstatistikkSchema>;

const lederstatistikkListeSchema = z.array(
    lederstatistikkSchema
);

export const lederstatistikkListeResponsSchema = z.object({
    data: lederstatistikkListeSchema,
});

export type LederstatistikkListeRespons = z.infer<
    typeof lederstatistikkListeResponsSchema
>;
