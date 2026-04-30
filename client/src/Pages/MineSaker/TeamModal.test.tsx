import { render, screen, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import * as nyFlyt from "@/api/lydia-api/nyFlyt";
import { TeamModal } from "@/Pages/MineSaker/TeamModal";
import { dummyIaSak } from "@mocks/virksomhetsMockData";

const mockMuterMineSaker = jest.fn();

jest.mock("@/api/lydia-api/nyFlyt", () => ({
    ...jest.requireActual("@/api/lydia-api/nyFlyt"),
    bliEierNyFlyt: jest.fn(() => Promise.resolve()),
    useHentSpesifikkSakNyFlyt: jest.fn(() => ({
        data: dummyIaSak,
        loading: false,
        mutate: jest.fn(),
    })),
}));

jest.mock("@/api/lydia-api/sak", () => ({
    ...jest.requireActual("@/api/lydia-api/sak"),
    useHentMineSaker: jest.fn(() => ({
        data: [],
        mutate: mockMuterMineSaker,
    })),
}));

jest.mock("@/Pages/Virksomhet/Debugside/Oversikt", () => ({
    ...jest.requireActual("@/Pages/Virksomhet/Debugside/Oversikt"),
    useOversiktMutate: jest.fn(() => jest.fn()),
}));

jest.mock("@/api/lydia-api/bruker", () => ({
    ...jest.requireActual("@/api/lydia-api/bruker"),
    useHentBrukerinformasjon: jest.fn(() => ({
        data: {
            ident: "Z123456",
            navn: "Test Testesen",
            epost: "",
            rolle: "Superbruker",
        },
        loading: false,
    })),
}));

jest.mock("@/api/lydia-api/team", () => ({
    ...jest.requireActual("@/api/lydia-api/team"),
    useHentTeam: jest.fn(() => ({
        data: [],
        loading: false,
        mutate: jest.fn(),
    })),
}));

jest.mock("@/Pages/Virksomhet/VirksomhetContext", () => ({
    ...jest.requireActual("@/Pages/Virksomhet/VirksomhetContext"),
    useErPåAktivSak: jest.fn(() => false),
}));

describe("TeamModal", () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it("viser 'Ta eierskap'-knapp og kaller bliEierNyFlyt", async () => {
        render(
            <TeamModal
                open={true}
                setOpen={jest.fn()}
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
                setOpen={jest.fn()}
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
        const setOpen = jest.fn();
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
        const setOpen = jest.fn();
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
        const setOpen = jest.fn();
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
