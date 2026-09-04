import { Kvartal } from "../domenetyper/kvartal";

export const sammenlignPå = <T, U>(
    hentFelt: (el: T) => U,
    desc: boolean = false,
) => {
    const faktor = desc ? -1 : 1;

    return (a: T, b: T): number => {
        const left = hentFelt(a);
        const right = hentFelt(b);

        if (left < right) return -1 * faktor;
        if (left === right) return 0;
        return faktor;
    };
};

export const sortertPå = <T, U>(
    liste: T[],
    hentFelt: (el: T) => U,
    desc: boolean = false,
) => liste.toSorted(sammenlignPå(hentFelt, desc));

export const sorterAlfabetisk = (a: string, b: string) =>
    a.toLocaleLowerCase().localeCompare(b.toLocaleLowerCase(), "no");

export const sorterKvartalStigende = (a: Kvartal, b: Kvartal) =>
    a.årstall !== b.årstall ? a.årstall - b.årstall : a.kvartal - b.kvartal;

export const sorterPåDatoStigende = sammenlignPå((dato: Date) =>
    dato.getTime(),
);

export const sorterPåDatoSynkende = sammenlignPå(
    (dato: Date) => dato.getTime(),
    true,
);
