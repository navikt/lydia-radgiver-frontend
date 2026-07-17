import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import TemaInnholdVelger from "./TemaInnholdVelger";
import { defaultStartDate, defaultEndDate } from "./planconster";
import { RedigertInnholdMal } from "../../../domenetyper/plan";

// Mock analytics
jest.mock("src/util/analytics-klient", () => ({
    loggEndringAvPlan: jest.fn(),
}));

const createMockRedigertInnholdMal = (
    rekkefølge: number,
    navn: string,
    inkludert: boolean = false,
): RedigertInnholdMal => ({
    rekkefølge,
    navn,
    inkludert,
    startDato: inkludert ? defaultStartDate : null,
    sluttDato: inkludert ? defaultEndDate : null,
});

describe("TemaInnholdVelger", () => {
    const mockVelgUndertemaer = jest.fn();
    const mockSetVisInnholdFeil = jest.fn();

    beforeEach(() => {
        jest.clearAllMocks();
    });

    test("rendrer checkbox-gruppe med tema-navn som legend", () => {
        const undertemaer = [createMockRedigertInnholdMal(1, "Undertema 1")];

        render(
            <TemaInnholdVelger
                valgteUndertemaer={undertemaer}
                velgUndertemaer={mockVelgUndertemaer}
                setVisInnholdFeil={mockSetVisInnholdFeil}
                visInnholdFeil={false}
                temaNavn="Arbeidsmiljø"
            />,
        );

        expect(
            screen.getByRole("group", { name: "Arbeidsmiljø" }),
        ).toBeInTheDocument();
    });

    test("viser checkboxer for hvert undertema", () => {
        const undertemaer = [
            createMockRedigertInnholdMal(1, "Første undertema"),
            createMockRedigertInnholdMal(2, "Andre undertema"),
        ];

        render(
            <TemaInnholdVelger
                valgteUndertemaer={undertemaer}
                velgUndertemaer={mockVelgUndertemaer}
                setVisInnholdFeil={mockSetVisInnholdFeil}
                visInnholdFeil={false}
                temaNavn="Test"
            />,
        );

        expect(
            screen.getByRole("checkbox", { name: "Første undertema" }),
        ).toBeInTheDocument();
        expect(
            screen.getByRole("checkbox", { name: "Andre undertema" }),
        ).toBeInTheDocument();
    });

    test("kaller velgUndertemaer når checkbox velges", () => {
        const undertemaer = [
            createMockRedigertInnholdMal(1, "Undertema", false),
        ];

        render(
            <TemaInnholdVelger
                valgteUndertemaer={undertemaer}
                velgUndertemaer={mockVelgUndertemaer}
                setVisInnholdFeil={mockSetVisInnholdFeil}
                visInnholdFeil={false}
                temaNavn="Test"
            />,
        );

        fireEvent.click(screen.getByRole("checkbox", { name: "Undertema" }));

        expect(mockVelgUndertemaer).toHaveBeenCalledWith(
            expect.arrayContaining([
                expect.objectContaining({
                    rekkefølge: 1,
                    inkludert: true,
                }),
            ]),
        );
    });

    test("viser feilmelding når visInnholdFeil er true", () => {
        const undertemaer = [createMockRedigertInnholdMal(1, "Undertema")];

        render(
            <TemaInnholdVelger
                valgteUndertemaer={undertemaer}
                velgUndertemaer={mockVelgUndertemaer}
                setVisInnholdFeil={mockSetVisInnholdFeil}
                visInnholdFeil={true}
                temaNavn="Test"
            />,
        );

        expect(
            screen.getByText(
                /Du må velge noe innhold for å opprette en samarbeidsplan/i,
            ),
        ).toBeInTheDocument();
    });

    test("viser datepickers for inkluderte undertemaer", () => {
        const undertemaer = [
            createMockRedigertInnholdMal(1, "Med datoer", true),
        ];

        render(
            <TemaInnholdVelger
                valgteUndertemaer={undertemaer}
                velgUndertemaer={mockVelgUndertemaer}
                setVisInnholdFeil={mockSetVisInnholdFeil}
                visInnholdFeil={false}
                temaNavn="Test"
            />,
        );

        expect(
            screen.getByRole("textbox", { name: /startdato for med datoer/i }),
        ).toBeInTheDocument();
        expect(
            screen.getByRole("textbox", { name: /sluttdato for med datoer/i }),
        ).toBeInTheDocument();
    });

    test("fjerner datoer når undertema fjernes fra planen", () => {
        const undertemaer = [
            createMockRedigertInnholdMal(1, "Undertema", true),
        ];

        render(
            <TemaInnholdVelger
                valgteUndertemaer={undertemaer}
                velgUndertemaer={mockVelgUndertemaer}
                setVisInnholdFeil={mockSetVisInnholdFeil}
                visInnholdFeil={false}
                temaNavn="Test"
            />,
        );

        fireEvent.click(screen.getByRole("checkbox", { name: "Undertema" }));

        expect(mockVelgUndertemaer).toHaveBeenCalledWith(
            expect.arrayContaining([
                expect.objectContaining({
                    inkludert: false,
                    startDato: null,
                    sluttDato: null,
                }),
            ]),
        );
    });
});
