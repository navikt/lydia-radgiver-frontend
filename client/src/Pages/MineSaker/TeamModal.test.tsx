import { render, screen, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import { TeamModal } from "./TeamModal";
import { dummyIaSak } from "../../../__mocks__/virksomhetsMockData";
import * as nyFlyt from "../../api/lydia-api/nyFlyt";

const mockMuterMineSaker = jest.fn();

jest.mock("src/api/lydia-api/nyFlyt", () => ({
    ...jest.requireActual("src/api/lydia-api/nyFlyt"),
    bliEierNyFlyt: jest.fn(() => Promise.resolve()),
    useHentSpesifikkSakNyFlyt: jest.fn(() => ({
        data: dummyIaSak,
        loading: false,
        mutate: jest.fn(),
    })),
}));

jest.mock("src/api/lydia-api/sak", () => ({
    ...jest.requireActual("src/api/lydia-api/sak"),
    useHentMineSaker: jest.fn(() => ({
        data: [],
        mutate: mockMuterMineSaker,
    })),
}));

jest.mock("src/Pages/Virksomhet/Debugside/Oversikt", () => ({
    ...jest.requireActual(
        "src/Pages/Virksomhet/Debugside/Oversikt",
    ),
    useOversiktMutate: jest.fn(() => jest.fn()),
}));

jest.mock("src/api/lydia-api/bruker", () => ({
    ...jest.requireActual("src/api/lydia-api/bruker"),
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

jest.mock("src/api/lydia-api/team", () => ({
    ...jest.requireActual("src/api/lydia-api/team"),
    useHentTeam: jest.fn(() => ({
        data: [],
        loading: false,
        mutate: jest.fn(),
    })),
}));

jest.mock("src/Pages/Virksomhet/VirksomhetContext", () => ({
    ...jest.requireActual("src/Pages/Virksomhet/VirksomhetContext"),
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
            expect(nyFlyt.bliEierNyFlyt).toHaveBeenCalledTimes(1);
        });
        expect(nyFlyt.bliEierNyFlyt).toHaveBeenCalledWith(dummyIaSak.orgnr);
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

    it("lukker modal etter vellykket ta eierskap", async () => {
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
            expect(setOpen).toHaveBeenCalledWith(false);
        });
    });

    it("viser 'Nåværende eier blir automatisk fjernet.' når saken har eier", () => {
        render(
            <TeamModal
                open={true}
                setOpen={jest.fn()}
                iaSak={{ ...dummyIaSak, eidAv: "ANNEN_SAKSBEHANDLER" }}
                erPåMineSaker={true}
            />,
        );

        expect(
            screen.getByText(/Nåværende eier blir automatisk fjernet\./),
        ).toBeInTheDocument();
    });

    it("viser ikke 'Nåværende eier blir automatisk fjernet.' når saken ikke har eier", () => {
        render(
            <TeamModal
                open={true}
                setOpen={jest.fn()}
                iaSak={{ ...dummyIaSak, eidAv: null }}
                erPåMineSaker={true}
            />,
        );

        expect(
            screen.queryByText(/Nåværende eier blir automatisk fjernet\./),
        ).not.toBeInTheDocument();
    });
});
