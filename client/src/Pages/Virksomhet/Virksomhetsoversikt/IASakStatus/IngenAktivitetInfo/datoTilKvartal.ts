import { Kvartal } from "../../../../../domenetyper/kvartal";

/**
 * Tek inn ein dato, returnerer nummeret på kvartalet datoen er i
 * */
export const finnKvartalsNummer = (dato: Date): number => {
    return Math.floor((dato.getMonth() + 3) / 3);
}

/**
 * Tek inn ein dato, returnerer eit objekt med årstall og kvartal
 * */
export const datoTilKvartal = (dato: Date): Kvartal => {
    return {
        årstall: dato.getFullYear(),
        kvartal: finnKvartalsNummer(dato),
    }
}

/**
 * Tek inn to datoar og finn differansen mellom dei.
 * Returnerer positivt tal om b er i eit nyare kvartal enn a og negativt om kvartalet til b er i fortida frå a.
 * */
export const kvartalDifferanse = (a: Kvartal, b: Kvartal): number => {
    let antallKvartal = 0;

    antallKvartal += (b.årstall - a.årstall) * 4; // Legg til kvartal frå differanse i årstal
    antallKvartal += b.kvartal - a.kvartal; // Legg til kvartal frå differanse i kvartalsnummer

    return antallKvartal;
}

/**
 *  Tek inn to datoar og finn ut om det har gått eit heilt kvartal mellom dei.
 *  */
export const aktivitetIForrigeKvartalEllerNyere = (nå: Date, sistEndret: Date): boolean => {
    return kvartalDifferanse(datoTilKvartal(nå), datoTilKvartal(sistEndret)) >= -1;
}
