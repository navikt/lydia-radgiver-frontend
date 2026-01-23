import {
    erIFortid,
    erSammeDato,
    isoDato,
    lokalDato,
    lokalDatoMedKortTekstmåned,
    lokalDatoMedKlokkeslett,
} from "../../src/util/dato";

describe("dato-utils", () => {
    test("lokale datoformat bruker nb-NO og gir forventet resultat", () => {
        const dato = new Date(2024, 0, 2, 0, 0, 0);

        const forventetKort = new Intl.DateTimeFormat("nb-NO", {
            dateStyle: "short",
        }).format(dato);
        const forventetKortMnd = new Intl.DateTimeFormat("nb-NO", {
            month: "short",
            day: "numeric",
            year: "2-digit",
        }).format(dato);
        const forventetMedKlokke = new Intl.DateTimeFormat("nb-NO", {
            dateStyle: "medium",
            timeStyle: "short",
        }).format(dato);

        expect(lokalDato(dato)).toBe(forventetKort);
        expect(lokalDatoMedKortTekstmåned(dato)).toBe(forventetKortMnd);
        expect(lokalDatoMedKlokkeslett(dato)).toBe(forventetMedKlokke);
    });

    test("isoDato returnerer ISO-dato uten klokkeslett", () => {
        const dato = new Date(2024, 0, 2, 0, 0, 0);

        const resultat = isoDato(dato);

        expect(resultat).toBe("2024-01-02");
    });

    test("erSammeDato sammenligner år, måned og dag", () => {
        const dato1 = new Date(2024, 0, 2);
        const sammeDato = new Date(2024, 0, 2);
        const annenDato = new Date(2024, 0, 3);

        expect(erSammeDato(dato1, sammeDato)).toBe(true);
        expect(erSammeDato(dato1, annenDato)).toBe(false);
    });

    test("erIFortid er true for datoer i fortid og false for framtid", () => {
        const fortid = new Date(2000, 0, 1);
        const framtid = new Date(Date.now() + 24 * 60 * 60 * 1000);

        expect(erIFortid(fortid)).toBe(true);
        expect(erIFortid(framtid)).toBe(false);
    });
});
