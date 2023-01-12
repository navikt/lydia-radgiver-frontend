import { Kvartal, SykefraversstatistikkVirksomhet } from "../domenetyper";

export const sorterAlfabetisk = (a: string, b: string) =>
    a.toLocaleLowerCase().localeCompare(b.toLocaleLowerCase(), "no");

export const sorterStatistikkPåSisteÅrstallOgKvartal = (a: SykefraversstatistikkVirksomhet, b: SykefraversstatistikkVirksomhet) =>
    a.arstall !== b.arstall ? b.arstall - a.arstall : b.kvartal - a.kvartal

export const sorterKvartalStigende = (a: Kvartal, b: Kvartal) =>
    a.årstall !== b.årstall ? a.årstall - b.årstall : a.kvartal - b.kvartal
