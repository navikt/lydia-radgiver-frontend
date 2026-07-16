import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import BekreftHandlingModal from "./BekreftHandlingModal";
import { IaSakProsess } from "../../../../domenetyper/iaSakProsess";

jest.mock("src/api/lydia-api/virksomhet", () => ({
    useHentSalesforceUrl: jest.fn(() => ({ data: null })),
}));

jest.mock("src/Pages/Virksomhet/VirksomhetContext", () => ({
    useVirksomhetContext: jest.fn(() => ({
        virksomhet: { orgnr: "123456789" },
    })),
}));

function createMockSamarbeid(overrides?: Partial<IaSakProsess>): IaSakProsess {
    return {
        id: 1,
        saksnummer: "SAK-123",
        navn: "Test Samarbeid",
        status: "AKTIV" as const,
        sistEndret: new Date(),
        opprettet: new Date(),
        ...overrides,
    };
}

describe("BekreftHandlingModal", () => {
    const mockOnCancel = jest.fn();
    const mockOnConfirm = jest.fn();

    beforeEach(() => {
        jest.clearAllMocks();
    });

    test("returnerer null når type er null", () => {
        const { container } = render(
            <BekreftHandlingModal
                open={true}
                onCancel={mockOnCancel}
                onConfirm={mockOnConfirm}
                samarbeid={createMockSamarbeid()}
                type={null}
            />,
        );
        expect(container.firstChild).toBeNull();
    });

    test("viser modal med samarbeidsnavn for fullfør", () => {
        render(
            <BekreftHandlingModal
                open={true}
                onCancel={mockOnCancel}
                onConfirm={mockOnConfirm}
                samarbeid={createMockSamarbeid({ navn: "Mitt samarbeid" })}
                type="fullfores"
                erTillatt={true}
            />,
        );
        expect(
            screen.getByRole("heading", { name: /Fullfør.*Mitt samarbeid/i }),
        ).toBeInTheDocument();
    });

    test("viser riktig brødtekst for fullfør", () => {
        render(
            <BekreftHandlingModal
                open={true}
                onCancel={mockOnCancel}
                onConfirm={mockOnConfirm}
                samarbeid={createMockSamarbeid()}
                type="fullfores"
                erTillatt={true}
            />,
        );
        expect(
            screen.getByText(
                /Når du fullfører vil alle dokumenter bli arkivert/,
            ),
        ).toBeInTheDocument();
    });

    test("viser riktig brødtekst for avbryt", () => {
        render(
            <BekreftHandlingModal
                open={true}
                onCancel={mockOnCancel}
                onConfirm={mockOnConfirm}
                samarbeid={createMockSamarbeid()}
                type="avbrytes"
                erTillatt={true}
            />,
        );
        expect(
            screen.getByText(
                /Når du avbryter vil alle dokumenter bli arkivert/,
            ),
        ).toBeInTheDocument();
    });

    test("viser riktig brødtekst for slett", () => {
        render(
            <BekreftHandlingModal
                open={true}
                onCancel={mockOnCancel}
                onConfirm={mockOnConfirm}
                samarbeid={createMockSamarbeid()}
                type="slettes"
                erTillatt={true}
            />,
        );
        expect(
            screen.getByText(
                /Samarbeid med fullførte behovsvurderinger, evalueringer og aktive planer kan ikke slettes/,
            ),
        ).toBeInTheDocument();
    });

    test("bekreftelseknapp er deaktivert når erTillatt er false", () => {
        render(
            <BekreftHandlingModal
                open={true}
                onCancel={mockOnCancel}
                onConfirm={mockOnConfirm}
                samarbeid={createMockSamarbeid()}
                type="fullfores"
                erTillatt={false}
            />,
        );
        expect(
            screen.getByRole("button", { name: /Fullfør samarbeid/i }),
        ).toBeDisabled();
    });

    test("bekreftelseknapp er aktivert når erTillatt er true", () => {
        render(
            <BekreftHandlingModal
                open={true}
                onCancel={mockOnCancel}
                onConfirm={mockOnConfirm}
                samarbeid={createMockSamarbeid()}
                type="fullfores"
                erTillatt={true}
            />,
        );
        expect(
            screen.getByRole("button", { name: /Fullfør samarbeid/i }),
        ).toBeEnabled();
    });

    test("kaller onCancel når Avbryt-knappen klikkes", () => {
        render(
            <BekreftHandlingModal
                open={true}
                onCancel={mockOnCancel}
                onConfirm={mockOnConfirm}
                samarbeid={createMockSamarbeid()}
                type="fullfores"
                erTillatt={true}
            />,
        );
        fireEvent.click(screen.getByRole("button", { name: /^Avbryt$/i }));
        expect(mockOnCancel).toHaveBeenCalled();
    });

    test("kaller onConfirm når bekreft-knappen klikkes", () => {
        render(
            <BekreftHandlingModal
                open={true}
                onCancel={mockOnCancel}
                onConfirm={mockOnConfirm}
                samarbeid={createMockSamarbeid()}
                type="fullfores"
                erTillatt={true}
            />,
        );
        fireEvent.click(
            screen.getByRole("button", { name: /Fullfør samarbeid/i }),
        );
        expect(mockOnConfirm).toHaveBeenCalled();
    });

    test("viser blokkerende begrunnelser", () => {
        render(
            <BekreftHandlingModal
                open={true}
                onCancel={mockOnCancel}
                onConfirm={mockOnConfirm}
                samarbeid={createMockSamarbeid()}
                type="slettes"
                blokkerende={["FINNES_SALESFORCE_AKTIVITET"]}
                erTillatt={false}
            />,
        );
        expect(
            screen.getByText("Aktiviteter i Salesforce"),
        ).toBeInTheDocument();
    });

    test("viser advarsler", () => {
        render(
            <BekreftHandlingModal
                open={true}
                onCancel={mockOnCancel}
                onConfirm={mockOnConfirm}
                samarbeid={createMockSamarbeid()}
                type="fullfores"
                advarsler={["INGEN_EVALUERING"]}
                erTillatt={true}
            />,
        );
        expect(
            screen.getByText(
                "Det er ikke gjennomført evaluering, vil du fortsatt fullføre?",
            ),
        ).toBeInTheDocument();
    });
});
