import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import InnholdOppsett from "./InnholdOppsett";
import { defaultStartDate, defaultEndDate } from "./planconster";
import { PlanInnhold } from "../../../domenetyper/plan";

// Mock analytics
jest.mock("src/util/analytics-klient", () => ({
    loggEndringAvPlan: jest.fn(),
}));

const createMockPlanInnhold = (
    id: number,
    navn: string,
    inkludert: boolean = false,
): PlanInnhold => ({
    id,
    navn,
    målsetning: `Målsetning for ${navn}`,
    inkludert,
    status: inkludert ? "PLANLAGT" : null,
    startDato: inkludert ? defaultStartDate : null,
    sluttDato: inkludert ? defaultEndDate : null,
    harAktiviteterISalesforce: false,
});

describe("InnholdOppsett", () => {
    const mockVelgInnhold = jest.fn();

    beforeEach(() => {
        jest.clearAllMocks();
    });

    test("rendrer checkbox-gruppe med tema-navn som legend", () => {
        const innhold = [createMockPlanInnhold(1, "Undertema 1")];

        render(
            <InnholdOppsett
                valgteInnhold={innhold}
                velgInnhold={mockVelgInnhold}
                temaNavn="Sykefraværsarbeid"
            />,
        );

        expect(
            screen.getByRole("group", { name: "Sykefraværsarbeid" }),
        ).toBeInTheDocument();
    });

    test("viser checkboxer for hvert innhold", () => {
        const innhold = [
            createMockPlanInnhold(1, "Undertema 1"),
            createMockPlanInnhold(2, "Undertema 2"),
            createMockPlanInnhold(3, "Undertema 3"),
        ];

        render(
            <InnholdOppsett
                valgteInnhold={innhold}
                velgInnhold={mockVelgInnhold}
                temaNavn="Test tema"
            />,
        );

        expect(
            screen.getByRole("checkbox", { name: "Undertema 1" }),
        ).toBeInTheDocument();
        expect(
            screen.getByRole("checkbox", { name: "Undertema 2" }),
        ).toBeInTheDocument();
        expect(
            screen.getByRole("checkbox", { name: "Undertema 3" }),
        ).toBeInTheDocument();
    });

    test("viser checkbox som valgt når innhold er inkludert", () => {
        const innhold = [
            createMockPlanInnhold(1, "Valgt undertema", true),
            createMockPlanInnhold(2, "Ikke valgt undertema", false),
        ];

        render(
            <InnholdOppsett
                valgteInnhold={innhold}
                velgInnhold={mockVelgInnhold}
                temaNavn="Test tema"
            />,
        );

        expect(
            screen.getByRole("checkbox", { name: "Valgt undertema" }),
        ).toBeChecked();
        expect(
            screen.getByRole("checkbox", { name: "Ikke valgt undertema" }),
        ).not.toBeChecked();
    });

    test("kaller velgInnhold med oppdatert innhold når checkbox klikkes", () => {
        const innhold = [createMockPlanInnhold(1, "Undertema 1", false)];

        render(
            <InnholdOppsett
                valgteInnhold={innhold}
                velgInnhold={mockVelgInnhold}
                temaNavn="Test tema"
            />,
        );

        const checkbox = screen.getByRole("checkbox", { name: "Undertema 1" });
        fireEvent.click(checkbox);

        expect(mockVelgInnhold).toHaveBeenCalledTimes(1);
        expect(mockVelgInnhold).toHaveBeenCalledWith(
            expect.arrayContaining([
                expect.objectContaining({
                    id: 1,
                    inkludert: true,
                    status: "PLANLAGT",
                }),
            ]),
        );
    });

    test("fjerner innhold fra plan når valgt checkbox klikkes", () => {
        const innhold = [createMockPlanInnhold(1, "Valgt undertema", true)];

        render(
            <InnholdOppsett
                valgteInnhold={innhold}
                velgInnhold={mockVelgInnhold}
                temaNavn="Test tema"
            />,
        );

        const checkbox = screen.getByRole("checkbox", {
            name: "Valgt undertema",
        });
        fireEvent.click(checkbox);

        expect(mockVelgInnhold).toHaveBeenCalledWith(
            expect.arrayContaining([
                expect.objectContaining({
                    id: 1,
                    inkludert: false,
                    startDato: null,
                    sluttDato: null,
                    status: null,
                }),
            ]),
        );
    });

    test("viser datepickers for inkludert innhold", () => {
        const innhold = [createMockPlanInnhold(1, "Med datoer", true)];

        render(
            <InnholdOppsett
                valgteInnhold={innhold}
                velgInnhold={mockVelgInnhold}
                temaNavn="Test tema"
            />,
        );

        expect(
            screen.getByRole("textbox", { name: /startdato for med datoer/i }),
        ).toBeInTheDocument();
        expect(
            screen.getByRole("textbox", { name: /sluttdato for med datoer/i }),
        ).toBeInTheDocument();
    });

    test("viser ikke datepickers for ikke-inkludert innhold", () => {
        const innhold = [createMockPlanInnhold(1, "Uten datoer", false)];

        render(
            <InnholdOppsett
                valgteInnhold={innhold}
                velgInnhold={mockVelgInnhold}
                temaNavn="Test tema"
            />,
        );

        expect(
            screen.queryByRole("textbox", { name: /startdato/i }),
        ).not.toBeInTheDocument();
        expect(
            screen.queryByRole("textbox", { name: /sluttdato/i }),
        ).not.toBeInTheDocument();
    });

    test("sorterer innhold etter id", () => {
        const innhold = [
            createMockPlanInnhold(3, "Undertema C"),
            createMockPlanInnhold(1, "Undertema A"),
            createMockPlanInnhold(2, "Undertema B"),
        ];

        render(
            <InnholdOppsett
                valgteInnhold={innhold}
                velgInnhold={mockVelgInnhold}
                temaNavn="Test tema"
            />,
        );

        const checkboxes = screen.getAllByRole("checkbox");
        expect(checkboxes[0]).toHaveAccessibleName("Undertema A");
        expect(checkboxes[1]).toHaveAccessibleName("Undertema B");
        expect(checkboxes[2]).toHaveAccessibleName("Undertema C");
    });
});
