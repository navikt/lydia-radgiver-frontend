import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import React from "react";
import { IASak } from "@/domenetyper/domenetyper";
import BekreftSisteSamarbeidModal, {
    erSisteSamarbeid,
} from "@/Pages/Virksomhet/AdministrerSamarbeid/BekreftSisteSamarbeidModal";
import { IaSakProsess } from "@features/sak/types/iaSakProsess";

const mockMutate = vi.fn();
const mockSlettSamarbeid = vi.fn().mockResolvedValue(undefined);
const mockAvsluttSamarbeid = vi.fn().mockResolvedValue(undefined);

vi.mock("@features/sak/api/nyFlyt", () => ({
    useHentSisteSakNyFlyt: () => ({ mutate: mockMutate }),
    useHentSpesifikkSakNyFlyt: () => ({ mutate: mockMutate }),
    useHentTilstandForVirksomhetNyFlyt: () => ({ mutate: mockMutate }),
    slettSamarbeidNyFlyt: (...args: unknown[]) => mockSlettSamarbeid(...args),
    avsluttSamarbeidNyFlyt: (...args: unknown[]) =>
        mockAvsluttSamarbeid(...args),
}));

vi.mock("@features/kartlegging/api/spørreundersøkelse", () => ({
    useHentSamarbeid: () => ({ mutate: mockMutate }),
}));

vi.mock("@/components/Badge/SamarbeidStatusBadge", () => ({
    SamarbeidStatusBadge: ({ status }: { status: string; as?: string }) => (
        <span data-testid="status-badge">{status}</span>
    ),
}));

const lagSamarbeid = (overrides: Partial<IaSakProsess> = {}): IaSakProsess => ({
    id: 1,
    saksnummer: "123",
    navn: "Avdeling A",
    status: "AKTIV",
    ...overrides,
});

const lagIaSak = (overrides: Partial<IASak> = {}): IASak =>
    ({
        saksnummer: "123",
        orgnr: "999999999",
        opprettetTidspunkt: new Date().toISOString(),
        opprettetAv: "Z123456",
        endretTidspunkt: null,
        endretAv: null,
        endretAvHendelseId: "abc",
        eidAv: null,
        status: "VI_BISTÅR",
        gyldigeNesteHendelser: [],
        lukket: false,
        ...overrides,
    }) as IASak;

function renderModal(props: {
    nyStatus: "AVBRUTT" | "FULLFØRT" | "SLETTET";
    valgtSamarbeid?: IaSakProsess | null;
    iaSak?: IASak;
    alleSamarbeid?: IaSakProsess[];
    open?: boolean;
}) {
    const ref = React.createRef<HTMLDialogElement>();
    const result = render(
        <BekreftSisteSamarbeidModal
            ref={ref}
            nyStatus={props.nyStatus}
            valgtSamarbeid={
                "valgtSamarbeid" in props
                    ? props.valgtSamarbeid
                    : lagSamarbeid()
            }
            iaSak={"iaSak" in props ? props.iaSak : lagIaSak()}
            alleSamarbeid={props.alleSamarbeid ?? [lagSamarbeid()]}
        />,
    );
    if (props.open) {
        ref.current?.setAttribute("open", "");
    }
    return { ...result, ref };
}

describe("BekreftSisteSamarbeidModal", () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it("viser riktig tittel for AVBRUTT", () => {
        renderModal({ nyStatus: "AVBRUTT" });
        expect(
            screen.getByRole("heading", { level: 1, hidden: true }),
        ).toHaveTextContent(/Avbryt samarbeidet/);
    });

    it("viser riktig tittel for FULLFØRT", () => {
        renderModal({ nyStatus: "FULLFØRT" });
        expect(
            screen.getByRole("heading", { level: 1, hidden: true }),
        ).toHaveTextContent(/Fullfør samarbeidet/);
    });

    it("viser riktig tittel for SLETTET", () => {
        renderModal({ nyStatus: "SLETTET" });
        expect(
            screen.getByRole("heading", { level: 1, hidden: true }),
        ).toHaveTextContent(/Slett samarbeidet/);
    });

    it("viser riktig heading", () => {
        renderModal({
            nyStatus: "AVBRUTT",
            valgtSamarbeid: lagSamarbeid({ navn: "Min avdeling" }),
        });
        expect(
            screen.getByRole("heading", { level: 1, hidden: true }),
        ).toHaveTextContent("Avbryt samarbeidet");
    });

    it("viser advarsel om at samarbeidsperioden avsluttes", () => {
        renderModal({ nyStatus: "AVBRUTT" });
        expect(
            screen.getByText("Samarbeidsperioden vil bli avsluttet"),
        ).toBeInTheDocument();
    });

    it("viser riktig presens-verb for AVBRUTT", () => {
        renderModal({ nyStatus: "AVBRUTT" });
        expect(screen.getByText(/avbryter/)).toBeInTheDocument();
    });

    it("viser riktig presens-verb for FULLFØRT", () => {
        renderModal({ nyStatus: "FULLFØRT" });
        expect(screen.getByText(/fullfører/)).toBeInTheDocument();
    });

    it("viser riktig presens-verb for SLETTET", () => {
        renderModal({ nyStatus: "SLETTET" });
        expect(screen.getByText(/sletter/)).toBeInTheDocument();
    });

    it("viser Lukk-knapp", () => {
        renderModal({ nyStatus: "AVBRUTT" });
        const lukkKnapper = screen.getAllByRole("button", {
            name: "Lukk",
            hidden: true,
        });
        expect(lukkKnapper.length).toBeGreaterThanOrEqual(1);
    });

    it("viser bekreftelsesknapp med riktig tekst", () => {
        renderModal({ nyStatus: "FULLFØRT" });
        const knapper = screen.getAllByRole("button", {
            name: "Fullfør samarbeidet",
            hidden: true,
        });
        expect(knapper.length).toBeGreaterThanOrEqual(1);
    });

    it("lister opp alle samarbeid med status-badge", () => {
        const alleSamarbeid = [
            lagSamarbeid({ id: 1, navn: "Avd 1", status: "AKTIV" }),
            lagSamarbeid({ id: 2, navn: "Avd 2", status: "FULLFØRT" }),
        ];
        renderModal({ nyStatus: "AVBRUTT", alleSamarbeid });

        expect(screen.getByText("Avd 1")).toBeInTheDocument();
        expect(screen.getByText("Avd 2")).toBeInTheDocument();
        expect(screen.getAllByTestId("status-badge")).toHaveLength(2);
    });

    it("kaller slettSamarbeidNyFlyt når nyStatus er SLETTET", async () => {
        renderModal({ nyStatus: "SLETTET", open: true });

        const knapper = screen.getAllByRole("button", {
            name: "Slett samarbeidet",
            hidden: true,
        });
        fireEvent.click(knapper[knapper.length - 1]);

        await waitFor(() => {
            expect(mockSlettSamarbeid).toHaveBeenCalledWith(
                "999999999",
                1,
                expect.stringMatching(/^\d{4}-\d{2}-\d{2}$/),
            );
        });
    });

    it("kaller avsluttSamarbeidNyFlyt når nyStatus er FULLFØRT", async () => {
        renderModal({ nyStatus: "FULLFØRT", open: true });

        const knapper = screen.getAllByRole("button", {
            name: "Fullfør samarbeidet",
            hidden: true,
        });
        fireEvent.click(knapper[knapper.length - 1]);

        await waitFor(() => {
            expect(mockAvsluttSamarbeid).toHaveBeenCalledWith(
                "999999999",
                1,
                expect.objectContaining({ status: "FULLFØRT" }),
                expect.stringMatching(/^\d{4}-\d{2}-\d{2}$/),
            );
        });
    });

    it("kaller mutate-funksjoner etter vellykket handling", async () => {
        renderModal({ nyStatus: "SLETTET", open: true });

        const knapper = screen.getAllByRole("button", {
            name: "Slett samarbeidet",
            hidden: true,
        });
        fireEvent.click(knapper[knapper.length - 1]);

        await waitFor(() => {
            expect(mockMutate).toHaveBeenCalled();
        });
    });

    it("gjør ingenting når valgtSamarbeid og iaSak mangler", async () => {
        renderModal({
            nyStatus: "SLETTET",
            iaSak: undefined,
            open: true,
        });

        const knapper = screen.getAllByRole("button", {
            name: "Slett samarbeidet",
            hidden: true,
        });
        fireEvent.click(knapper[knapper.length - 1]);

        await waitFor(() => {
            expect(mockSlettSamarbeid).not.toHaveBeenCalled();
            expect(mockAvsluttSamarbeid).not.toHaveBeenCalled();
        });
    });
});

describe("erSisteSamarbeid", () => {
    it("returnerer true hvis det ikke finnes andre aktive samarbeid", () => {
        const samarbeid = lagSamarbeid({ id: 1, status: "AKTIV" });
        const alle = [samarbeid, lagSamarbeid({ id: 2, status: "FULLFØRT" })];
        expect(erSisteSamarbeid(samarbeid, alle)).toBe(true);
    });

    it("returnerer false hvis det finnes andre aktive samarbeid", () => {
        const samarbeid = lagSamarbeid({ id: 1, status: "AKTIV" });
        const alle = [samarbeid, lagSamarbeid({ id: 2, status: "AKTIV" })];
        expect(erSisteSamarbeid(samarbeid, alle)).toBe(false);
    });

    it("returnerer true når alleSamarbeid er undefined", () => {
        expect(erSisteSamarbeid(lagSamarbeid(), undefined)).toBe(true);
    });

    it("returnerer true når samarbeid er null", () => {
        const alle = [lagSamarbeid({ id: 1, status: "FULLFØRT" })];
        expect(erSisteSamarbeid(null, alle)).toBe(true);
    });

    it("returnerer true når alle samarbeid har avsluttet status", () => {
        const samarbeid = lagSamarbeid({ id: 1, status: "AKTIV" });
        const alle = [
            samarbeid,
            lagSamarbeid({ id: 2, status: "AVBRUTT" }),
            lagSamarbeid({ id: 3, status: "SLETTET" }),
        ];
        expect(erSisteSamarbeid(samarbeid, alle)).toBe(true);
    });
});
