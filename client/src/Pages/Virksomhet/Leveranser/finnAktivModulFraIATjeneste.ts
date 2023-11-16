import { Modul } from "../../../domenetyper/leveranse";

export const finnAktivModulFraIATjeneste = (iaTjeneste: string, moduler: Modul[]): Modul | undefined => {
    return moduler.filter((modul) => !modul.deaktivert)
        .sort((a: Modul, b: Modul) => a.id - b.id)
        .find((modul) => modul.iaTjeneste === Number(iaTjeneste));
}
