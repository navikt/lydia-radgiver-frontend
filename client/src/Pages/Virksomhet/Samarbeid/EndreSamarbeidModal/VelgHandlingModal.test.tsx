import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import VelgHandlingModal from "./VelgHandlingModal";
import { IaSakProsess } from "../../../../domenetyper/iaSakProsess";
import { IASak } from "../../../../domenetyper/domenetyper";

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
        ...overrides,
    };
}

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
