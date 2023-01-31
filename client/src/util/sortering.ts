import { Kvartal } from "../domenetyper/domenetyper";

export const sorterAlfabetisk = (a: string, b: string) =>
    a.toLocaleLowerCase().localeCompare(b.toLocaleLowerCase(), "no");

export const sorterKvartalStigende = (a: Kvartal, b: Kvartal) =>
    a.årstall !== b.årstall ? a.årstall - b.årstall : a.kvartal - b.kvartal
