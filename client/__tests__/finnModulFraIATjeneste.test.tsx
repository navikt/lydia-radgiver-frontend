import {
    iaTjenester,
    moduler as modulerMock,
} from "../src/Pages/Virksomhet/mocks/leveranseMock";
import { finnAktivModulFraIATjeneste } from "../src/Pages/Virksomhet/Leveranser/finnAktivModulFraIATjeneste";

describe("Finn rett 'standardmodul' frå IATjeneste", () => {
    test("Finn en modul når vi har 1 modul per IA-tjeneste", () => {
        const iaTjeneste = iaTjenester[0];
        const moduler = modulerMock;

        expect(
            finnAktivModulFraIATjeneste(iaTjeneste.id.toString(), moduler),
        ).toStrictEqual({
            id: 15,
            iaTjeneste: 1,
            navn: "Redusere sykefravær",
            deaktivert: false,
        });
    });

    test("Finn modul med lavest ID når vi har flere moduler per IA-tjeneste", () => {
        const iaTjeneste = iaTjenester[0];
        const mangeModuler = [
            {
                id: 999,
                iaTjeneste: iaTjeneste.id,
                navn: "Dette er ein anna aktiv modul i same tjeneste",
                deaktivert: false,
            },
            ...modulerMock,
        ];

        expect(
            finnAktivModulFraIATjeneste(iaTjeneste.id.toString(), mangeModuler),
        ).toStrictEqual({
            id: 15,
            iaTjeneste: 1,
            navn: "Redusere sykefravær",
            deaktivert: false,
        });
    });
});
