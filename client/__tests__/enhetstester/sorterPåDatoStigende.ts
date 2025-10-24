import { sorterPåDatoStigende } from "../../src/util/sortering";

interface TestObjekt {
    navn: string;
    dato: Date;
}

describe("kan sortere datoer ", () => {
    test("kan sortere objekter med dato når de er ulike", () => {
        const testListe: TestObjekt[] = [
            { navn: "c", dato: new Date(2024, 11, 24) },
            { navn: "a", dato: new Date(2022, 8, 3) },
            { navn: "b", dato: new Date(2023, 11, 5) },
        ];

        const sortertListe = testListe.sort((a, b) =>
            sorterPåDatoStigende(a.dato, b.dato),
        );

        expect(sortertListe.map((it) => it.navn)).toEqual(["a", "b", "c"]);
    });

    test("opprettholder rekkefølge når datoene er like", () => {
        const testListe: TestObjekt[] = [
            { navn: "b", dato: new Date(2024, 11, 24) },
            { navn: "c", dato: new Date(2024, 11, 24) },
            { navn: "a", dato: new Date(2022, 11, 24) },
        ];

        const sortertListe = testListe.sort((a, b) =>
            sorterPåDatoStigende(a.dato, b.dato),
        );

        expect(sortertListe.map((it) => it.navn)).toEqual(["a", "b", "c"]);
    });
});
