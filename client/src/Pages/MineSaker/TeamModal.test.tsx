import { render, screen, waitFor } from "@testing-library/react";
import { TeamModal } from "@/Pages/MineSaker/TeamModal";
import * as nyFlyt from "@features/sak/api/nyFlyt";
import { dummyIaSak } from "@mocks/virksomhetsMockData";

const mockMuterMineSaker = vi.fn();

vi.mock("@features/sak/api/nyFlyt", async () => ({
    ...(await vi.importActual("@features/sak/api/nyFlyt")),
    bliEierNyFlyt: vi.fn(() => Promise.resolve()),
    useHentSpesifikkSakNyFlyt: vi.fn(() => ({
        data: dummyIaSak,
        loading: false,
        mutate: vi.fn(),
    })),
}));

vi.mock("@features/sak/api/sak", async () => ({
    ...(await vi.importActual("@features/sak/api/sak")),
    useHentMineSaker: vi.fn(() => ({
        data: [],
        mutate: mockMuterMineSaker,
    })),
}));

vi.mock("@/Pages/Virksomhet/Debugside/Oversikt", async () => ({
    ...(await vi.importActual("@/Pages/Virksomhet/Debugside/Oversikt")),
    useOversiktMutate: vi.fn(() => vi.fn()),
}));

vi.mock("@features/bruker/api/bruker", async () => ({
    ...(await vi.importActual("@features/bruker/api/bruker")),
    useHentBrukerinformasjon: vi.fn(() => ({
        data: {
            ident: "Z123456",
            navn: "Test Testesen",
            epost: "",
            rolle: "Superbruker",
        },
        loading: false,
    })),
}));

vi.mock("@features/bruker/api/team", async () => ({
    ...(await vi.importActual("@features/bruker/api/team")),
    useHentTeam: vi.fn(() => ({
        data: [],
        loading: false,
        mutate: vi.fn(),
    })),
}));

vi.mock("@/Pages/Virksomhet/VirksomhetContext", async () => ({
    ...(await vi.importActual("@/Pages/Virksomhet/VirksomhetContext")),
    useErPåAktivSak: vi.fn(() => false),
}));

describe("TeamModal", () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it("viser 'Ta eierskap'-knapp og kaller bliEierNyFlyt", async () => {
        render(
            <TeamModal
                open={true}
                setOpen={vi.fn()}
                iaSak={{ ...dummyIaSak, eidAv: "ANNEN_SAKSBEHANDLER" }}
                erPåMineSaker={true}
            />,
        );

        expect(screen.getByText("Administrer gruppe")).toBeInTheDocument();

        const taEierskapKnapp = screen.getByRole("button", {
            name: /Ta eierskap/i,
        });
        expect(taEierskapKnapp).toBeInTheDocument();
        taEierskapKnapp.click();

        await waitFor(() => {
            expect(
                screen.getByText("Er du sikker på at du vil ta eierskap?"),
            ).toBeInTheDocument();
        });

        const bekreftKnapper = screen.getAllByRole("button", {
            name: "Ta eierskap",
        });
        bekreftKnapper[bekreftKnapper.length - 1].click();

        await waitFor(() => {
            expect(nyFlyt.bliEierNyFlyt).toHaveBeenCalledTimes(1);
        });
        expect(nyFlyt.bliEierNyFlyt).toHaveBeenCalledWith(dummyIaSak.orgnr);
    });

    it("avbryter ta eierskap-modal uten å kalle bliEierNyFlyt", async () => {
        render(
            <TeamModal
                open={true}
                setOpen={vi.fn()}
                iaSak={{ ...dummyIaSak, eidAv: "ANNEN_SAKSBEHANDLER" }}
                erPåMineSaker={true}
            />,
        );

        screen.getByRole("button", { name: /Ta eierskap/i }).click();

        await waitFor(() => {
            expect(
                screen.getByText("Er du sikker på at du vil ta eierskap?"),
            ).toBeInTheDocument();
        });

        const avbrytKnapper = screen.getAllByText("Avbryt");
        avbrytKnapper[avbrytKnapper.length - 1].click();

        expect(nyFlyt.bliEierNyFlyt).not.toHaveBeenCalled();
    });

    it("kaller setOpen(false) ved klikk på 'Ferdig'", () => {
        const setOpen = vi.fn();
        render(
            <TeamModal
                open={true}
                setOpen={setOpen}
                iaSak={dummyIaSak}
                erPåMineSaker={true}
            />,
        );

        screen.getByRole("button", { name: "Ferdig" }).click();
        expect(setOpen).toHaveBeenCalledWith(false);
    });

    it("muterer mineSaker ved lukking av modal via lukkeknapp", () => {
        const setOpen = vi.fn();
        render(
            <TeamModal
                open={true}
                setOpen={setOpen}
                iaSak={dummyIaSak}
                erPåMineSaker={true}
            />,
        );

        const lukkKnapp = screen.getByRole("button", { name: /lukk/i });
        lukkKnapp.click();
        expect(mockMuterMineSaker).toHaveBeenCalledTimes(1);
        expect(setOpen).toHaveBeenCalledWith(false);
    });

    it("lukker begge modaler etter vellykket ta eierskap", async () => {
        const setOpen = vi.fn();
        render(
            <TeamModal
                open={true}
                setOpen={setOpen}
                iaSak={{ ...dummyIaSak, eidAv: "ANNEN_SAKSBEHANDLER" }}
                erPåMineSaker={true}
            />,
        );

        screen.getByRole("button", { name: /Ta eierskap/i }).click();

        await waitFor(() => {
            expect(
                screen.getByText("Er du sikker på at du vil ta eierskap?"),
            ).toBeInTheDocument();
        });

        const bekreftKnapper = screen.getAllByRole("button", {
            name: "Ta eierskap",
        });
        bekreftKnapper[bekreftKnapper.length - 1].click();

        await waitFor(() => {
            expect(setOpen).toHaveBeenCalledWith(false);
        });
    });
});
