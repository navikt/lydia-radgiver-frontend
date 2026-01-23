import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import { Paginering } from "../../../src/Pages/Prioritering/Paginering";
import { ANTALL_RESULTATER_PER_SIDE } from "../../../src/Pages/Prioritering/Prioriteringsside";
import { loggSøkMedFilterIAnalytics } from "../../../src/Pages/Prioritering/loggSøkMedFilterIAnalytics";
import {
    FilterverdiKategorier,
    Søkekomponenter,
} from "../../../src/util/analytics-klient";
import {
    FiltervisningState,
    initialFiltervisningState,
} from "../../../src/Pages/Prioritering/Filter/filtervisning-reducer";

// Mock analytics
jest.mock("../../../src/util/analytics-klient", () => ({
    loggFilterverdiKategorier: jest.fn(),
    FilterverdiKategorier: {
        SEKTOR: "SEKTOR",
        STATUS: "STATUS",
        FYLKE: "FYLKE",
        KOMMUNE: "KOMMUNE",
        BRANSJE: "BRANSJE",
        NÆRINGSGRUPPE: "NÆRINGSGRUPPE",
        EIER: "EIER",
        SYKEFRAVÆR_FRA: "SYKEFRAVÆR_FRA",
        SYKEFRAVÆR_TIL: "SYKEFRAVÆR_TIL",
        ANSATTE_FRA: "ANSATTE_FRA",
        ANSATTE_TIL: "ANSATTE_TIL",
        SNITT: "SNITT",
        FRITEKST: "FRITEKST",
    },
    Søkekomponenter: {
        PRIORITERING: "PRIORITERING",
        STATUSOVERSIKT: "STATUSOVERSIKT",
    },
}));

describe("ANTALL_RESULTATER_PER_SIDE", () => {
    test("er satt til 100", () => {
        expect(ANTALL_RESULTATER_PER_SIDE).toBe(100);
    });
});

describe("Paginering", () => {
    const mockEndreSide = jest.fn();

    beforeEach(() => {
        jest.clearAllMocks();
    });

    test("rendrer sidetall", () => {
        render(
            <Paginering
                side={1}
                antallTreffPåSide={100}
                endreSide={mockEndreSide}
            />,
        );
        expect(screen.getByText("1")).toBeInTheDocument();
    });

    test("Forrige-knappen er deaktivert på side 1", () => {
        render(
            <Paginering
                side={1}
                antallTreffPåSide={100}
                endreSide={mockEndreSide}
            />,
        );
        const forrigeKnapp = screen.getByRole("button", { name: /Forrige/i });
        expect(forrigeKnapp).toBeDisabled();
    });

    test("Forrige-knappen er aktivert på side 2+", () => {
        render(
            <Paginering
                side={2}
                antallTreffPåSide={100}
                endreSide={mockEndreSide}
            />,
        );
        const forrigeKnapp = screen.getByRole("button", { name: /Forrige/i });
        expect(forrigeKnapp).toBeEnabled();
    });

    test("kaller endreSide med forrige side når Forrige klikkes", () => {
        render(
            <Paginering
                side={3}
                antallTreffPåSide={100}
                endreSide={mockEndreSide}
            />,
        );
        fireEvent.click(screen.getByRole("button", { name: /Forrige/i }));
        expect(mockEndreSide).toHaveBeenCalledWith(2);
    });

    test("kaller endreSide med neste side når Neste klikkes", () => {
        render(
            <Paginering
                side={1}
                antallTreffPåSide={100}
                endreSide={mockEndreSide}
            />,
        );
        fireEvent.click(screen.getByRole("button", { name: /Neste/i }));
        expect(mockEndreSide).toHaveBeenCalledWith(2);
    });

    test("Neste-knappen er deaktivert når antallTreff < ANTALL_RESULTATER_PER_SIDE", () => {
        render(
            <Paginering
                side={1}
                antallTreffPåSide={50}
                endreSide={mockEndreSide}
            />,
        );
        const nesteKnapp = screen.getByRole("button", { name: /Neste/i });
        expect(nesteKnapp).toBeDisabled();
    });

    test("Neste-knappen er aktivert når antallTreff === ANTALL_RESULTATER_PER_SIDE", () => {
        render(
            <Paginering
                side={1}
                antallTreffPåSide={ANTALL_RESULTATER_PER_SIDE}
                endreSide={mockEndreSide}
            />,
        );
        const nesteKnapp = screen.getByRole("button", { name: /Neste/i });
        expect(nesteKnapp).toBeEnabled();
    });

    test("viser korrekt sidetall", () => {
        render(
            <Paginering
                side={5}
                antallTreffPåSide={100}
                endreSide={mockEndreSide}
            />,
        );
        expect(screen.getByText("5")).toBeInTheDocument();
    });
});

describe("loggSøkMedFilterIAnalytics", () => {
    const mockLoggFilterverdiKategorier = jest.fn();

    beforeEach(() => {
        jest.clearAllMocks();
        // eslint-disable-next-line @typescript-eslint/no-require-imports
        const analytics = require("../../../src/util/analytics-klient");
        analytics.loggFilterverdiKategorier = mockLoggFilterverdiKategorier;
    });

    const createBaseFilterState = (): FiltervisningState => ({
        ...initialFiltervisningState,
    });

    test("logger SEKTOR når sektor er satt", () => {
        const state = { ...createBaseFilterState(), sektor: "PRIVAT" };
        loggSøkMedFilterIAnalytics(state, Søkekomponenter.PRIORITERING);
        expect(mockLoggFilterverdiKategorier).toHaveBeenCalledWith(
            expect.arrayContaining([FilterverdiKategorier.SEKTOR]),
            Søkekomponenter.PRIORITERING,
        );
    });

    test("logger STATUS når iaStatus er satt", () => {
        const state: FiltervisningState = {
            ...createBaseFilterState(),
            iaStatus: "VI_BISTÅR",
        };
        loggSøkMedFilterIAnalytics(state, Søkekomponenter.PRIORITERING);
        expect(mockLoggFilterverdiKategorier).toHaveBeenCalledWith(
            expect.arrayContaining([FilterverdiKategorier.STATUS]),
            Søkekomponenter.PRIORITERING,
        );
    });

    test("logger FYLKE når fylker er valgt", () => {
        const state: FiltervisningState = {
            ...createBaseFilterState(),
            valgteFylker: [
                { fylke: { nummer: "03", navn: "Oslo" }, kommuner: [] },
            ],
        };
        loggSøkMedFilterIAnalytics(state, Søkekomponenter.PRIORITERING);
        expect(mockLoggFilterverdiKategorier).toHaveBeenCalledWith(
            expect.arrayContaining([FilterverdiKategorier.FYLKE]),
            Søkekomponenter.PRIORITERING,
        );
    });

    test("logger KOMMUNE når kommuner er valgt", () => {
        const state: FiltervisningState = {
            ...createBaseFilterState(),
            kommuner: [{ nummer: "0301", navn: "Oslo", navnNorsk: "Oslo" }],
        };
        loggSøkMedFilterIAnalytics(state, Søkekomponenter.PRIORITERING);
        expect(mockLoggFilterverdiKategorier).toHaveBeenCalledWith(
            expect.arrayContaining([FilterverdiKategorier.KOMMUNE]),
            Søkekomponenter.PRIORITERING,
        );
    });

    test("logger BRANSJE når bransjeprogram er valgt", () => {
        const state: FiltervisningState = {
            ...createBaseFilterState(),
            bransjeprogram: ["BARNEHAGER"],
        };
        loggSøkMedFilterIAnalytics(state, Søkekomponenter.PRIORITERING);
        expect(mockLoggFilterverdiKategorier).toHaveBeenCalledWith(
            expect.arrayContaining([FilterverdiKategorier.BRANSJE]),
            Søkekomponenter.PRIORITERING,
        );
    });

    test("logger NÆRINGSGRUPPE når næringsgrupper er valgt", () => {
        const state: FiltervisningState = {
            ...createBaseFilterState(),
            næringsgrupper: [{ kode: "01", navn: "Test" }],
        };
        loggSøkMedFilterIAnalytics(state, Søkekomponenter.PRIORITERING);
        expect(mockLoggFilterverdiKategorier).toHaveBeenCalledWith(
            expect.arrayContaining([FilterverdiKategorier.NÆRINGSGRUPPE]),
            Søkekomponenter.PRIORITERING,
        );
    });

    test("logger SYKEFRAVÆR_FRA når sykefraværsprosent.fra > 0", () => {
        const state: FiltervisningState = {
            ...createBaseFilterState(),
            sykefraværsprosent: { fra: 5, til: 100 },
        };
        loggSøkMedFilterIAnalytics(state, Søkekomponenter.PRIORITERING);
        expect(mockLoggFilterverdiKategorier).toHaveBeenCalledWith(
            expect.arrayContaining([FilterverdiKategorier.SYKEFRAVÆR_FRA]),
            Søkekomponenter.PRIORITERING,
        );
    });

    test("logger tom array når ingen filtre er aktive", () => {
        const state = createBaseFilterState();
        loggSøkMedFilterIAnalytics(state, Søkekomponenter.PRIORITERING);
        expect(mockLoggFilterverdiKategorier).toHaveBeenCalledWith(
            [],
            Søkekomponenter.PRIORITERING,
        );
    });

    test("fungerer med STATUSOVERSIKT søkekomponent", () => {
        const state = { ...createBaseFilterState(), sektor: "PRIVAT" };
        loggSøkMedFilterIAnalytics(state, Søkekomponenter.STATUSOVERSIKT);
        expect(mockLoggFilterverdiKategorier).toHaveBeenCalledWith(
            expect.arrayContaining([FilterverdiKategorier.SEKTOR]),
            Søkekomponenter.STATUSOVERSIKT,
        );
    });
});
