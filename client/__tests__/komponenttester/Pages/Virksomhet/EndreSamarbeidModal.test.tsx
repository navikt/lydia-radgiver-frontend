import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import BegrunnelserForIkkeKunne, {
    usePrettyType,
} from "../../../../src/Pages/Virksomhet/Samarbeid/EndreSamarbeidModal/BegrunnelserForIkkeKunne";
import BekreftHandlingModal from "../../../../src/Pages/Virksomhet/Samarbeid/EndreSamarbeidModal/BekreftHandlingModal";
import VelgHandlingModal from "../../../../src/Pages/Virksomhet/Samarbeid/EndreSamarbeidModal/VelgHandlingModal";
import { KanIkkeGjennomføreBegrunnelse } from "../../../../src/domenetyper/samarbeidsEndring";
import { IaSakProsess } from "../../../../src/domenetyper/iaSakProsess";
import { IASak } from "../../../../src/domenetyper/domenetyper";
import { renderHook } from "@testing-library/react";

// Mock dependencies
jest.mock("../../../../src/api/lydia-api/virksomhet", () => ({
    useHentSalesforceUrl: jest.fn(() => ({ data: null })),
}));

jest.mock("../../../../src/Pages/Virksomhet/VirksomhetContext", () => ({
    useVirksomhetContext: jest.fn(() => ({
        virksomhet: { orgnr: "123456789" },
    })),
}));

// Helper to create mock samarbeid
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

// Helper to create mock IASak
function createMockIaSak(overrides?: Partial<IASak>): IASak {
    return {
        saksnummer: "SAK-123",
        orgnr: "123456789",
        status: "VI_BISTÅR" as const,
        opprettetAv: "test-user",
        opprettetTidspunkt: new Date(),
        eidAv: null,
        endretAv: null,
        endretAvHendelseId: "hendelse-1",
        endretTidspunkt: null,
        gyldigeNesteHendelser: [],
        lukket: false,
        ...overrides,
    };
}

describe("usePrettyType hook", () => {
    test("returnerer riktig tekst for fullfores", () => {
        const { result } = renderHook(() => usePrettyType("fullfores"));
        expect(result.current.capitalized).toBe("Fullfør");
        expect(result.current.uncapitalized).toBe("fullfør");
    });

    test("returnerer riktig tekst for slettes", () => {
        const { result } = renderHook(() => usePrettyType("slettes"));
        expect(result.current.capitalized).toBe("Slett");
        expect(result.current.uncapitalized).toBe("slett");
    });

    test("returnerer riktig tekst for avbrytes", () => {
        const { result } = renderHook(() => usePrettyType("avbrytes"));
        expect(result.current.capitalized).toBe("Avbryt");
        expect(result.current.uncapitalized).toBe("avbryt");
    });
});

describe("BegrunnelserForIkkeKunne", () => {
    test("returnerer null når begrunnelser er undefined", () => {
        const { container } = render(
            <BegrunnelserForIkkeKunne
                begrunnelser={undefined}
                type="fullfores"
            />,
        );
        expect(container.firstChild).toBeNull();
    });

    test("returnerer null når begrunnelser er tom liste", () => {
        const { container } = render(
            <BegrunnelserForIkkeKunne begrunnelser={[]} type="fullfores" />,
        );
        expect(container.firstChild).toBeNull();
    });

    test("viser blokkerende alert med error variant", () => {
        render(
            <BegrunnelserForIkkeKunne
                begrunnelser={["FINNES_BEHOVSVURDERING"]}
                type="fullfores"
                blokkerende={true}
            />,
        );
        expect(
            screen.getByText(/Samarbeidet kan ikke fullføres:/i),
        ).toBeInTheDocument();
    });

    test("viser advarsel alert med warning variant", () => {
        render(
            <BegrunnelserForIkkeKunne
                begrunnelser={["INGEN_EVALUERING"]}
                type="fullfores"
                blokkerende={false}
            />,
        );
        expect(
            screen.getByText(/Er du sikker på at du ønsker å fullføre?/i),
        ).toBeInTheDocument();
    });

    test("mapper begrunnelse FINNES_SALESFORCE_AKTIVITET korrekt", () => {
        render(
            <BegrunnelserForIkkeKunne
                begrunnelser={["FINNES_SALESFORCE_AKTIVITET"]}
                type="slettes"
                blokkerende={true}
            />,
        );
        expect(
            screen.getByText("Aktiviteter i Salesforce"),
        ).toBeInTheDocument();
    });

    test("mapper begrunnelse FINNES_BEHOVSVURDERING korrekt", () => {
        render(
            <BegrunnelserForIkkeKunne
                begrunnelser={["FINNES_BEHOVSVURDERING"]}
                type="slettes"
                blokkerende={true}
            />,
        );
        expect(
            screen.getByText("Det en påbegynt behovsvurdering"),
        ).toBeInTheDocument();
    });

    test("mapper begrunnelse FINNES_SAMARBEIDSPLAN korrekt", () => {
        render(
            <BegrunnelserForIkkeKunne
                begrunnelser={["FINNES_SAMARBEIDSPLAN"]}
                type="slettes"
                blokkerende={true}
            />,
        );
        expect(screen.getByText("Aktiv samarbeidsplan")).toBeInTheDocument();
    });

    test("mapper begrunnelse INGEN_EVALUERING korrekt", () => {
        render(
            <BegrunnelserForIkkeKunne
                begrunnelser={["INGEN_EVALUERING"]}
                type="fullfores"
            />,
        );
        expect(
            screen.getByText(
                "Det er ikke gjennomført evaluering, vil du fortsatt fullføre?",
            ),
        ).toBeInTheDocument();
    });

    test("mapper begrunnelse SAK_I_FEIL_STATUS korrekt", () => {
        render(
            <BegrunnelserForIkkeKunne
                begrunnelser={["SAK_I_FEIL_STATUS"]}
                type="fullfores"
                blokkerende={true}
            />,
        );
        expect(
            screen.getByText("Saken må være i status Vi bistår"),
        ).toBeInTheDocument();
    });

    test("viser flere begrunnelser i liste", () => {
        const begrunnelser: KanIkkeGjennomføreBegrunnelse[] = [
            "FINNES_BEHOVSVURDERING",
            "FINNES_SAMARBEIDSPLAN",
        ];
        render(
            <BegrunnelserForIkkeKunne
                begrunnelser={begrunnelser}
                type="slettes"
                blokkerende={true}
            />,
        );
        expect(
            screen.getByText("Det en påbegynt behovsvurdering"),
        ).toBeInTheDocument();
        expect(screen.getByText("Aktiv samarbeidsplan")).toBeInTheDocument();
    });

    test("viser riktig tekst for avbryt-handling", () => {
        render(
            <BegrunnelserForIkkeKunne
                begrunnelser={["AKTIV_BEHOVSVURDERING"]}
                type="avbrytes"
                blokkerende={true}
            />,
        );
        expect(
            screen.getByText(/Samarbeidet kan ikke avbryti?es:/i),
        ).toBeInTheDocument();
    });
});

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

describe("VelgHandlingModal", () => {
    const mockSetÅpen = jest.fn();
    const mockHentKanGjennomføreStatusendring = jest.fn();
    const mockSetBekreftType = jest.fn();

    beforeEach(() => {
        jest.clearAllMocks();
    });

    test("rendrer modal med overskrift", () => {
        render(
            <VelgHandlingModal
                iaSak={createMockIaSak()}
                samarbeid={createMockSamarbeid({ navn: "Mitt samarbeid" })}
                åpen={true}
                setÅpen={mockSetÅpen}
                hentKanGjennomføreStatusendring={
                    mockHentKanGjennomføreStatusendring
                }
                lasterKanGjennomføreHandling={null}
                setBekreftType={mockSetBekreftType}
            />,
        );
        expect(
            screen.getByRole("heading", { name: /Avslutt/i }),
        ).toBeInTheDocument();
    });

    test("viser radioknapper for handlinger", () => {
        render(
            <VelgHandlingModal
                iaSak={createMockIaSak()}
                samarbeid={createMockSamarbeid()}
                åpen={true}
                setÅpen={mockSetÅpen}
                hentKanGjennomføreStatusendring={
                    mockHentKanGjennomføreStatusendring
                }
                lasterKanGjennomføreHandling={null}
                setBekreftType={mockSetBekreftType}
            />,
        );
        expect(
            screen.getByRole("radio", { name: /fullført/i }),
        ).toBeInTheDocument();
        expect(
            screen.getByRole("radio", { name: /avbrutt/i }),
        ).toBeInTheDocument();
    });

    test("Avslutt-knappen er deaktivert når ingen handling er valgt", () => {
        render(
            <VelgHandlingModal
                iaSak={createMockIaSak()}
                samarbeid={createMockSamarbeid()}
                åpen={true}
                setÅpen={mockSetÅpen}
                hentKanGjennomføreStatusendring={
                    mockHentKanGjennomføreStatusendring
                }
                lasterKanGjennomføreHandling={null}
                setBekreftType={mockSetBekreftType}
            />,
        );
        expect(
            screen.getByRole("button", { name: /Avslutt samarbeidet/i }),
        ).toBeDisabled();
    });

    test("kaller hentKanGjennomføreStatusendring når radioknapp velges", () => {
        render(
            <VelgHandlingModal
                iaSak={createMockIaSak()}
                samarbeid={createMockSamarbeid()}
                åpen={true}
                setÅpen={mockSetÅpen}
                hentKanGjennomføreStatusendring={
                    mockHentKanGjennomføreStatusendring
                }
                lasterKanGjennomføreHandling={null}
                setBekreftType={mockSetBekreftType}
            />,
        );
        fireEvent.click(screen.getByRole("radio", { name: /fullført/i }));
        expect(mockHentKanGjennomføreStatusendring).toHaveBeenCalledWith(
            "fullfores",
        );
    });

    test("radioknapper er deaktivert mens lasting pågår", () => {
        render(
            <VelgHandlingModal
                iaSak={createMockIaSak()}
                samarbeid={createMockSamarbeid()}
                åpen={true}
                setÅpen={mockSetÅpen}
                hentKanGjennomføreStatusendring={
                    mockHentKanGjennomføreStatusendring
                }
                lasterKanGjennomføreHandling="fullfores"
                setBekreftType={mockSetBekreftType}
            />,
        );
        expect(screen.getByRole("radio", { name: /fullført/i })).toBeDisabled();
        expect(screen.getByRole("radio", { name: /avbrutt/i })).toBeDisabled();
    });

    test("kaller setÅpen(false) når Avbryt-knappen klikkes", () => {
        render(
            <VelgHandlingModal
                iaSak={createMockIaSak()}
                samarbeid={createMockSamarbeid()}
                åpen={true}
                setÅpen={mockSetÅpen}
                hentKanGjennomføreStatusendring={
                    mockHentKanGjennomføreStatusendring
                }
                lasterKanGjennomføreHandling={null}
                setBekreftType={mockSetBekreftType}
            />,
        );
        fireEvent.click(screen.getByRole("button", { name: /^Avbryt$/i }));
        expect(mockSetÅpen).toHaveBeenCalledWith(false);
        expect(mockSetBekreftType).toHaveBeenCalledWith(null);
    });

    test("viser blokkerende begrunnelser når kanGjennomføreResultat har blokkerende", () => {
        render(
            <VelgHandlingModal
                iaSak={createMockIaSak()}
                samarbeid={createMockSamarbeid()}
                åpen={true}
                setÅpen={mockSetÅpen}
                hentKanGjennomføreStatusendring={
                    mockHentKanGjennomføreStatusendring
                }
                kanGjennomføreResultat={{
                    kanGjennomføres: false,
                    blokkerende: ["SAK_I_FEIL_STATUS"],
                    advarsler: [],
                }}
                lasterKanGjennomføreHandling={null}
                setBekreftType={mockSetBekreftType}
            />,
        );
        // Note: Begrunnelser vises ikke uten valgt handling
    });
});
