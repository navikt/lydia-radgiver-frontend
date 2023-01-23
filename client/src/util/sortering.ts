import {Kvartal, Virksomhetsdetaljer} from "../domenetyper";

export const sorterAlfabetisk = (a: string, b: string) =>
    a.toLocaleLowerCase().localeCompare(b.toLocaleLowerCase(), "no");

export const sorterStatistikkPåSisteÅrstallOgKvartal = (a: Virksomhetsdetaljer, b: Virksomhetsdetaljer) =>
    a.arstall !== b.arstall ? b.arstall - a.arstall : b.kvartal - a.kvartal

export const sorterKvartalStigende = (a: Kvartal, b: Kvartal) =>
    a.årstall !== b.årstall ? a.årstall - b.årstall : a.kvartal - b.kvartal
