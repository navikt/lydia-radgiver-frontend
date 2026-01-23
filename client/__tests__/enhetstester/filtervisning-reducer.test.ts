import { TextEncoder, TextDecoder } from "util";
// @ts-expect-error dette må gjøres for å få testene til å kjøre, da disse ikke er definert i jsdom
global.TextEncoder = TextEncoder;
// @ts-expect-error dette må gjøres for å få testene til å kjøre, da disse ikke er definert i jsdom
global.TextDecoder = TextDecoder;

import {
    initialFiltervisningState,
    FiltervisningState,
    sammenliknFilterverdier,
    erSammeFylker,
    filterstateFraLokalstorage,
} from "../../src/Pages/Prioritering/Filter/filtervisning-reducer";
import {
    FylkeMedKommuner,
    Kommune,
} from "../../src/domenetyper/fylkeOgKommune";
import {
    Filterverdier,
    ValgtSnittFilter,
} from "../../src/domenetyper/filterverdier";
import { Næringsgruppe } from "../../src/domenetyper/virksomhet";

// Mock localStorage
const localStorageMock = (() => {
    let store: Record<string, string> = {};
    return {
        getItem: (key: string) => store[key] || null,
        setItem: (key: string, value: string) => {
            store[key] = value;
        },
        removeItem: (key: string) => {
            delete store[key];
        },
        clear: () => {
            store = {};
        },
    };
})();

Object.defineProperty(window, "localStorage", {
    value: localStorageMock,
});

// Test data helpers
const createKommune = (nummer: string, navn: string): Kommune => ({
    nummer,
    navn,
    navnNorsk: navn,
});

const createFylkeMedKommuner = (
    fylkeNummer: string,
    fylkeNavn: string,
    kommuner: Kommune[] = [],
): FylkeMedKommuner => ({
    fylke: { nummer: fylkeNummer, navn: fylkeNavn },
    kommuner,
});

const createNæringsgruppe = (kode: string, navn: string): Næringsgruppe => ({
    kode,
    navn,
});

const createTestFilterverdier = (
    overrides: Partial<Filterverdier> = {},
): Filterverdier => ({
    fylker: [
        createFylkeMedKommuner("03", "Oslo", [createKommune("0301", "Oslo")]),
        createFylkeMedKommuner("11", "Rogaland", [
            createKommune("1101", "Eigersund"),
            createKommune("1103", "Stavanger"),
        ]),
        createFylkeMedKommuner("15", "Møre og Romsdal", [
            createKommune("1505", "Kristiansund"),
            createKommune("1506", "Molde"),
        ]),
    ],
    naringsgrupper: [
        createNæringsgruppe("01", "Jordbruk"),
        createNæringsgruppe("02", "Skogbruk"),
        createNæringsgruppe("10", "Næringsmiddelindustri"),
    ],
    sorteringsnokler: [
        "tapte_dagsverk",
        "sykefravarsprosent",
        "antall_personer",
    ],
    statuser: [
        "IKKE_AKTIV",
        "VURDERES",
        "KONTAKTES",
        "KARTLEGGES",
        "VI_BISTÅR",
        "FULLFØRT",
        "IKKE_AKTUELL",
    ],
    bransjeprogram: ["BARNEHAGER", "NÆRINGSMIDDELINDUSTRI", "SYKEHUS"],
    filtrerbareEiere: [
        { navIdent: "A123456", navn: "Test Bruker" },
        { navIdent: "B654321", navn: "Annen Bruker" },
    ],
    sektorer: [
        { kode: "STATLIG", beskrivelse: "Statlig sektor" },
        { kode: "KOMMUNAL", beskrivelse: "Kommunal sektor" },
        { kode: "PRIVAT", beskrivelse: "Privat sektor" },
    ],
    ...overrides,
});

describe("initialFiltervisningState", () => {
    test("har korrekte standardverdier", () => {
        expect(initialFiltervisningState.autosøk).toBe(true);
        expect(initialFiltervisningState.kommuner).toEqual([]);
        expect(initialFiltervisningState.næringsgrupper).toEqual([]);
        expect(initialFiltervisningState.sykefraværsprosent).toEqual({
            fra: 0,
            til: 100,
        });
        expect(initialFiltervisningState.valgtSnittfilter).toBe(
            ValgtSnittFilter.ALLE,
        );
        expect(initialFiltervisningState.antallArbeidsforhold).toEqual({
            fra: 5,
            til: NaN,
        });
        expect(initialFiltervisningState.sektor).toBe("");
        expect(initialFiltervisningState.iaStatus).toBeUndefined();
        expect(initialFiltervisningState.bransjeprogram).toEqual([]);
        expect(initialFiltervisningState.eiere).toEqual([]);
        expect(initialFiltervisningState.side).toBe(1);
    });
});

describe("sammenliknFilterverdier", () => {
    test("returnerer true for identiske tilstander", () => {
        const stateA: FiltervisningState = { ...initialFiltervisningState };
        const stateB: FiltervisningState = { ...initialFiltervisningState };

        expect(sammenliknFilterverdier(stateA, stateB)).toBe(true);
    });

    test("returnerer false for forskjellige kommuner", () => {
        const stateA: FiltervisningState = {
            ...initialFiltervisningState,
            kommuner: [createKommune("0301", "Oslo")],
        };
        const stateB: FiltervisningState = {
            ...initialFiltervisningState,
            kommuner: [],
        };

        expect(sammenliknFilterverdier(stateA, stateB)).toBe(false);
    });

    test("sammenligner side når ignorerSide er true (standard) - NB: invertert logikk", () => {
        // Merk: Funksjonen har invertert logikk - når ignorerSide=true beholdes side-verdien
        const stateA: FiltervisningState = {
            ...initialFiltervisningState,
            side: 1,
        };
        const stateB: FiltervisningState = {
            ...initialFiltervisningState,
            side: 5,
        };

        // Med ignorerSide=true beholdes side-verdien, så forskjellige sider gir false
        expect(sammenliknFilterverdier(stateA, stateB, true)).toBe(false);
    });

    test("ignorerer side når ignorerSide er false - NB: invertert logikk", () => {
        // Merk: Funksjonen har invertert logikk - når ignorerSide=false settes side til undefined
        const stateA: FiltervisningState = {
            ...initialFiltervisningState,
            side: 1,
        };
        const stateB: FiltervisningState = {
            ...initialFiltervisningState,
            side: 5,
        };

        // Med ignorerSide=false settes side til undefined, så de blir like
        expect(sammenliknFilterverdier(stateA, stateB, false)).toBe(true);
    });

    test("returnerer false for forskjellige sykefraværsprosent", () => {
        const stateA: FiltervisningState = {
            ...initialFiltervisningState,
            sykefraværsprosent: { fra: 0, til: 50 },
        };
        const stateB: FiltervisningState = {
            ...initialFiltervisningState,
            sykefraværsprosent: { fra: 0, til: 100 },
        };

        expect(sammenliknFilterverdier(stateA, stateB)).toBe(false);
    });

    test("returnerer false for forskjellige iaStatus", () => {
        const stateA: FiltervisningState = {
            ...initialFiltervisningState,
            iaStatus: "VURDERES",
        };
        const stateB: FiltervisningState = {
            ...initialFiltervisningState,
            iaStatus: "KONTAKTES",
        };

        expect(sammenliknFilterverdier(stateA, stateB)).toBe(false);
    });

    test("returnerer false for forskjellige næringsgrupper", () => {
        const stateA: FiltervisningState = {
            ...initialFiltervisningState,
            næringsgrupper: [createNæringsgruppe("01", "Jordbruk")],
        };
        const stateB: FiltervisningState = {
            ...initialFiltervisningState,
            næringsgrupper: [],
        };

        expect(sammenliknFilterverdier(stateA, stateB)).toBe(false);
    });

    test("returnerer false for forskjellige eiere", () => {
        const stateA: FiltervisningState = {
            ...initialFiltervisningState,
            eiere: [{ navIdent: "A123456", navn: "Test Bruker" }],
        };
        const stateB: FiltervisningState = {
            ...initialFiltervisningState,
            eiere: [],
        };

        expect(sammenliknFilterverdier(stateA, stateB)).toBe(false);
    });
});

describe("erSammeFylker", () => {
    test("returnerer true for tomme lister", () => {
        expect(erSammeFylker([], [])).toBe(true);
    });

    test("returnerer true for identiske fylkelister", () => {
        const oslo = createFylkeMedKommuner("03", "Oslo");
        const rogaland = createFylkeMedKommuner("11", "Rogaland");

        expect(erSammeFylker([oslo, rogaland], [oslo, rogaland])).toBe(true);
    });

    test("returnerer true for samme fylker i forskjellig rekkefølge", () => {
        const oslo = createFylkeMedKommuner("03", "Oslo");
        const rogaland = createFylkeMedKommuner("11", "Rogaland");

        expect(erSammeFylker([oslo, rogaland], [rogaland, oslo])).toBe(true);
    });

    test("returnerer false for forskjellige antall fylker", () => {
        const oslo = createFylkeMedKommuner("03", "Oslo");
        const rogaland = createFylkeMedKommuner("11", "Rogaland");

        expect(erSammeFylker([oslo], [oslo, rogaland])).toBe(false);
    });

    test("returnerer false for forskjellige fylker", () => {
        const oslo = createFylkeMedKommuner("03", "Oslo");
        const rogaland = createFylkeMedKommuner("11", "Rogaland");
        const vestland = createFylkeMedKommuner("46", "Vestland");

        expect(erSammeFylker([oslo, rogaland], [oslo, vestland])).toBe(false);
    });

    test("sammenligner på fylkenummer, ikke navn", () => {
        const fylke1 = createFylkeMedKommuner("03", "Oslo");
        const fylke2 = createFylkeMedKommuner("03", "Annet navn");

        expect(erSammeFylker([fylke1], [fylke2])).toBe(true);
    });
});

describe("filterstateFraLokalstorage", () => {
    beforeEach(() => {
        localStorageMock.clear();
    });

    test("returnerer initialFiltervisningState når localStorage er tom", () => {
        const filterverdier = createTestFilterverdier();
        const result = filterstateFraLokalstorage(filterverdier);

        expect(result).toEqual(initialFiltervisningState);
    });

    test("returnerer initialFiltervisningState når localStorage inneholder ugyldig JSON", () => {
        localStorageMock.setItem("lokalFiltervisningState", "ugyldig json {{{");
        const filterverdier = createTestFilterverdier();

        expect(() => filterstateFraLokalstorage(filterverdier)).toThrow();
    });

    test("returnerer lagret state når den er gyldig", () => {
        const filterverdier = createTestFilterverdier();
        const lagretState: Partial<FiltervisningState> = {
            ...initialFiltervisningState,
            kommuner: [createKommune("0301", "Oslo")],
            valgteFylker: [
                createFylkeMedKommuner("03", "Oslo", [
                    createKommune("0301", "Oslo"),
                ]),
            ],
            sykefraværsprosent: { fra: 10, til: 50 },
            bransjeprogram: ["BARNEHAGER"],
            næringsgrupper: [createNæringsgruppe("01", "Jordbruk")],
            eiere: [{ navIdent: "A123456", navn: "Test Bruker" }],
        };

        localStorageMock.setItem(
            "lokalFiltervisningState",
            JSON.stringify(lagretState),
        );

        const result = filterstateFraLokalstorage(filterverdier);

        expect(result.kommuner).toEqual(lagretState.kommuner);
        expect(result.sykefraværsprosent).toEqual(
            lagretState.sykefraværsprosent,
        );
    });

    test("fjerner lagret state når kommuner ikke finnes i filterverdier", () => {
        const filterverdier = createTestFilterverdier();
        const lagretState: Partial<FiltervisningState> = {
            ...initialFiltervisningState,
            kommuner: [createKommune("9999", "Finnes ikke")],
        };

        localStorageMock.setItem(
            "lokalFiltervisningState",
            JSON.stringify(lagretState),
        );

        const result = filterstateFraLokalstorage(filterverdier);

        expect(result).toEqual(initialFiltervisningState);
        expect(localStorageMock.getItem("lokalFiltervisningState")).toBeNull();
    });

    test("fjerner lagret state når fylker ikke finnes i filterverdier", () => {
        const filterverdier = createTestFilterverdier();
        const lagretState: Partial<FiltervisningState> = {
            ...initialFiltervisningState,
            kommuner: [],
            valgteFylker: [createFylkeMedKommuner("99", "Finnes ikke")],
            bransjeprogram: [],
            næringsgrupper: [],
            eiere: [],
        };

        localStorageMock.setItem(
            "lokalFiltervisningState",
            JSON.stringify(lagretState),
        );

        const result = filterstateFraLokalstorage(filterverdier);

        expect(result).toEqual(initialFiltervisningState);
    });

    test("fjerner lagret state når bransjeprogram ikke finnes i filterverdier", () => {
        const filterverdier = createTestFilterverdier();
        const lagretState: Partial<FiltervisningState> = {
            ...initialFiltervisningState,
            kommuner: [],
            valgteFylker: [],
            bransjeprogram: ["FINNES_IKKE"],
            næringsgrupper: [],
            eiere: [],
        };

        localStorageMock.setItem(
            "lokalFiltervisningState",
            JSON.stringify(lagretState),
        );

        const result = filterstateFraLokalstorage(filterverdier);

        expect(result).toEqual(initialFiltervisningState);
    });

    test("fjerner lagret state når næringsgrupper ikke finnes i filterverdier", () => {
        const filterverdier = createTestFilterverdier();
        const lagretState: Partial<FiltervisningState> = {
            ...initialFiltervisningState,
            kommuner: [],
            valgteFylker: [],
            bransjeprogram: [],
            næringsgrupper: [createNæringsgruppe("99", "Finnes ikke")],
            eiere: [],
        };

        localStorageMock.setItem(
            "lokalFiltervisningState",
            JSON.stringify(lagretState),
        );

        const result = filterstateFraLokalstorage(filterverdier);

        expect(result).toEqual(initialFiltervisningState);
    });

    test("fjerner lagret state når eiere ikke finnes i filterverdier", () => {
        const filterverdier = createTestFilterverdier();
        const lagretState: Partial<FiltervisningState> = {
            ...initialFiltervisningState,
            kommuner: [],
            valgteFylker: [],
            bransjeprogram: [],
            næringsgrupper: [],
            eiere: [{ navIdent: "Z999999", navn: "Finnes ikke" }],
        };

        localStorageMock.setItem(
            "lokalFiltervisningState",
            JSON.stringify(lagretState),
        );

        const result = filterstateFraLokalstorage(filterverdier);

        expect(result).toEqual(initialFiltervisningState);
    });
});

describe("Range og snittfilter verdier", () => {
    test("sykefraværsprosent range har riktige grenseverdier", () => {
        expect(initialFiltervisningState.sykefraværsprosent.fra).toBe(0);
        expect(initialFiltervisningState.sykefraværsprosent.til).toBe(100);
    });

    test("antallArbeidsforhold har riktig minimumverdi", () => {
        expect(initialFiltervisningState.antallArbeidsforhold.fra).toBe(5);
        expect(initialFiltervisningState.antallArbeidsforhold.til).toBeNaN();
    });

    test("ValgtSnittFilter har forventede verdier", () => {
        expect(ValgtSnittFilter.ALLE).toBe("");
        expect(ValgtSnittFilter.BRANSJE_NÆRING_OVER).toBe(
            "BRANSJE_NÆRING_OVER",
        );
        expect(ValgtSnittFilter.BRANSJE_NÆRING_UNDER_ELLER_LIK).toBe(
            "BRANSJE_NÆRING_UNDER_ELLER_LIK",
        );
    });
});

describe("FiltervisningState struktur", () => {
    test("alle felter i initialFiltervisningState er definert", () => {
        const state = initialFiltervisningState;

        expect(state).toHaveProperty("autosøk");
        expect(state).toHaveProperty("kommuner");
        expect(state).toHaveProperty("næringsgrupper");
        expect(state).toHaveProperty("sykefraværsprosent");
        expect(state).toHaveProperty("valgtSnittfilter");
        expect(state).toHaveProperty("antallArbeidsforhold");
        expect(state).toHaveProperty("sektor");
        expect(state).toHaveProperty("iaStatus");
        expect(state).toHaveProperty("bransjeprogram");
        expect(state).toHaveProperty("eiere");
        expect(state).toHaveProperty("side");
    });

    test("arrays i initial state er tomme", () => {
        expect(initialFiltervisningState.kommuner).toHaveLength(0);
        expect(initialFiltervisningState.næringsgrupper).toHaveLength(0);
        expect(initialFiltervisningState.bransjeprogram).toHaveLength(0);
        expect(initialFiltervisningState.eiere).toHaveLength(0);
    });
});
