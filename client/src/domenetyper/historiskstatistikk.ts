import {z} from "zod";

const SYKEFRAVÆRSSTATISTIKK_KATEGORI = [
    "VIRKSOMHET",
] as const;

const statistikkDataSchema = z.object({
    kvartal: z.number(),
    årstall: z.number(),
    sykefraværsprosent: z.number(),
    maskert: z.boolean()
})

const kategoristatistikkSchema = z.object({
    kategori: z.enum(SYKEFRAVÆRSSTATISTIKK_KATEGORI),
    kode: z.string(),
    statistikk: z.array(
        statistikkDataSchema
    )
})

export const historiskStatistikkSchema = z.object({
    virksomhetsstatistikk: kategoristatistikkSchema,
    næringsstatistikk: kategoristatistikkSchema,
    bransjestatistikk: kategoristatistikkSchema,
    sektorstatistikk: kategoristatistikkSchema,
    landsstatistikk: kategoristatistikkSchema
})
export type HistoriskStatistikk = z.infer<typeof historiskStatistikkSchema>

