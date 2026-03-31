import { render, screen, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import { TeamModal } from "../../../../src/Pages/MineSaker/TeamModal";
import { dummyIaSak } from "../../../../__mocks__/virksomhetsMockData";
import * as nyFlyt from "../../../../src/api/lydia-api/nyFlyt";

jest.mock("../../../../src/api/lydia-api/nyFlyt", () => ({
    ...jest.requireActual("../../../../src/api/lydia-api/nyFlyt"),
    bliEierNyFlyt: jest.fn(() => Promise.resolve()),
    useHentSpesifikkSakNyFlyt: jest.fn(() => ({
        data: dummyIaSak,
        loading: false,
        mutate: jest.fn(),
    })),
}));

jest.mock("../../../../src/api/lydia-api/sak", () => ({
    ...jest.requireActual("../../../../src/api/lydia-api/sak"),
    useHentMineSaker: jest.fn(() => ({
        data: [],
        mutate: jest.fn(),
    })),
}));

jest.mock("../../../../src/api/lydia-api/bruker", () => ({
    ...jest.requireActual("../../../../src/api/lydia-api/bruker"),
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

jest.mock("../../../../src/api/lydia-api/team", () => ({
    ...jest.requireActual("../../../../src/api/lydia-api/team"),
    useHentTeam: jest.fn(() => ({
        data: [],
        loading: false,
        mutate: jest.fn(),
    })),
}));

jest.mock("../../../../src/Pages/Virksomhet/VirksomhetContext", () => ({
    ...jest.requireActual("../../../../src/Pages/Virksomhet/VirksomhetContext"),
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
});
