import { TextEncoder, TextDecoder } from "util";
// @ts-expect-error dette må gjøres for å få testene til å kjøre, da disse ikke er definert i jsdom
global.TextEncoder = TextEncoder;
// @ts-expect-error dette må gjøres for å få testene til å kjøre, da disse ikke er definert i jsdom
global.TextDecoder = TextDecoder;

import {
    FiltervisningState,
    filterstateFraLokalstorage,
    initialFiltervisningState,
} from "../../src/Pages/Prioritering/Filter/filtervisning-reducer";
import { filterverdierMock } from "../../src/Pages/Prioritering/mocks/filterverdierMock";
import { ValgtSnittFilter } from "../../src/domenetyper/filterverdier";

const dummyLocalStorage: FiltervisningState = {
    autosøk: true,
    kommuner: [
        {
            navn: "Nord-Aurdal",
            navnNorsk: "Nord-Aurdal",
            nummer: "3451",
        },
        {
            navn: "Vestre Slidre",
            navnNorsk: "Vestre Slidre",
            nummer: "3452",
        },
    ],
    valgteFylker: [
        {
            fylke: {
                nummer: "34",
                navn: "Innlandet",
            },
            kommuner: [
                {
                    navn: "Nord-Aurdal",
                    navnNorsk: "Nord-Aurdal",
                    nummer: "3451",
                },
                {
                    navn: "Vestre Slidre",
                    navnNorsk: "Vestre Slidre",
                    nummer: "3452",
                },
                {
                    navn: "Øystre Slidre",
                    navnNorsk: "Øystre Slidre",
                    nummer: "3453",
                },
            ],
        },
    ],
    antallArbeidsforhold: {
        fra: 5,
        til: 25,
    },
    sykefraværsprosent: {
        fra: 15,
        til: 50,
    },
    valgtSnittfilter: ValgtSnittFilter.BRANSJE_NÆRING_OVER,
    eiere: [
        {
            navn: "Mikke Mus",
            navIdent: "G12345",
        },
        {
            navn: "Albus Parsifal Ulfrik Brian Humlesnurr",
            navIdent: "H12345",
        },
    ],
    sektor: "1",
    iaStatus: "NY",
    bransjeprogram: ["NÆRINGSMIDDELINDUSTRI"],
    næringsgrupper: [
        {
            kode: "02",
            navn: "Skogbruk og tjenester tilknyttet skogbruk",
        },
        {
            kode: "99",
            navn: "Internasjonale organisasjoner og organer",
        },
    ],
    side: 4,
};

describe("Lasting av søkeparametre fra localstorage", () => {
    test("godtar ikke ugyldig filterstate", () => {
        window.localStorage.setItem(
            "lokalFiltervisningState",
            JSON.stringify({
                ...dummyLocalStorage,
                kommuner: [
                    ...dummyLocalStorage.kommuner,
                    { navn: "feil", navnNorsk: "feilerson", nummer: "9999" },
                ],
            }),
        );
        const statefraLS = filterstateFraLokalstorage(filterverdierMock);
        expect(statefraLS).toEqual(initialFiltervisningState);
    });

    test("godtar gyldig filterstate", () => {
        window.localStorage.setItem(
            "lokalFiltervisningState",
            JSON.stringify(dummyLocalStorage),
        );
        const statefraLS = filterstateFraLokalstorage(filterverdierMock);
        expect(statefraLS).toEqual(dummyLocalStorage);
    });

    test("Sletter localstorage om den finner ugyldig data", () => {
        window.localStorage.setItem(
            "lokalFiltervisningState",
            JSON.stringify({
                ...dummyLocalStorage,
                kommuner: [
                    ...dummyLocalStorage.kommuner,
                    { navn: "feil", navnNorsk: "feilerson", nummer: "9999" },
                ],
            }),
        );
        filterstateFraLokalstorage(filterverdierMock);
        const fraLS = window.localStorage.getItem("lokalFiltervisningState");
        expect(fraLS).toEqual(null);
    });

    test("Sletter localstorage om den finner ugyldig data på fylker", () => {
        window.localStorage.setItem(
            "lokalFiltervisningState",
            JSON.stringify({
                ...dummyLocalStorage,
                valgteFylker: [
                    {
                        fylke: {
                            nummer: "99",
                            navn: "Feil",
                        },
                        kommuner: [
                            {
                                navn: "feil",
                                navnNorsk: "feilerson",
                                nummer: "9999",
                            },
                        ],
                    },
                ],
            }),
        );
        filterstateFraLokalstorage(filterverdierMock);
        const fraLS = window.localStorage.getItem("lokalFiltervisningState");
        expect(fraLS).toEqual(null);
    });

    test("Sletter ikke localstorage om den finner gyldig data", () => {
        window.localStorage.setItem(
            "lokalFiltervisningState",
            JSON.stringify(dummyLocalStorage),
        );
        filterstateFraLokalstorage(filterverdierMock);
        const fraLS = JSON.parse(
            window.localStorage.getItem("lokalFiltervisningState") ?? "",
        );
        expect(fraLS).toEqual(dummyLocalStorage);
    });
});
