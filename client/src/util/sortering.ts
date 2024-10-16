import { Kvartal } from "../domenetyper/kvartal";

export const sorterAlfabetisk = (a: string, b: string) =>
    a.toLocaleLowerCase().localeCompare(b.toLocaleLowerCase(), "no");

export const sorterKvartalStigende = (a: Kvartal, b: Kvartal) =>
    a.årstall !== b.årstall ? a.årstall - b.årstall : a.kvartal - b.kvartal;

export const sorterPåDatoStigende = (a: Date, b: Date) => {
    return a.getTime() - b.getTime();
};

export const sorterPåDatoSynkende = (a: Date, b: Date) => {
    return b.getTime() - a.getTime();
};
