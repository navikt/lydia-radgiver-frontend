import { render, screen, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import { TaEierskapModal } from "../../../../src/Pages/MineSaker/TaEierSkapModal";
import { dummyIaSak } from "../../../../__mocks__/virksomhetsMockData";
import * as nyFlyt from "../../../../src/api/lydia-api/nyFlyt";
import * as sak from "../../../../src/api/lydia-api/sak";
import * as oversikt from "../../../../src/Pages/Virksomhet/Debugside/Oversikt";

const mockMuterIaSak = jest.fn();
const mockMuterMineSaker = jest.fn();
const mockMuterOversikt = jest.fn();

jest.mock("../../../../src/api/lydia-api/nyFlyt", () => ({
    ...jest.requireActual("../../../../src/api/lydia-api/nyFlyt"),
    bliEierNyFlyt: jest.fn(() => Promise.resolve()),
    useHentSpesifikkSakNyFlyt: jest.fn(() => ({
        data: dummyIaSak,
        loading: false,
        mutate: mockMuterIaSak,
    })),
}));

jest.mock("../../../../src/api/lydia-api/sak", () => ({
    ...jest.requireActual("../../../../src/api/lydia-api/sak"),
    useHentMineSaker: jest.fn(() => ({
        data: [],
        mutate: mockMuterMineSaker,
    })),
}));

jest.mock("../../../../src/Pages/Virksomhet/Debugside/Oversikt", () => ({
    ...jest.requireActual(
        "../../../../src/Pages/Virksomhet/Debugside/Oversikt",
    ),
    useOversiktMutate: jest.fn(() => mockMuterOversikt),
}));

describe("TaEierskapModal", () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it("viser modaltekst når den er åpen", () => {
        render(
            <TaEierskapModal
                erModalÅpen={true}
                lukkModal={jest.fn()}
                iaSak={dummyIaSak}
            />,
        );

        expect(
            screen.getByText("Er du sikker på at du vil ta eierskap?"),
        ).toBeInTheDocument();
        expect(
            screen.getByText(
                "Nåværende eier vil fjernes og du blir automatisk eier av saken.",
            ),
        ).toBeInTheDocument();
        expect(screen.getByText("Ta eierskap")).toBeInTheDocument();
        expect(screen.getByText("Avbryt")).toBeInTheDocument();
    });

    it("vises ikke synlig når erModalÅpen er false", () => {
        render(
            <TaEierskapModal
                erModalÅpen={false}
                lukkModal={jest.fn()}
                iaSak={dummyIaSak}
            />,
        );

        expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    });

    it("vises synlig når erModalÅpen er true", () => {
        render(
            <TaEierskapModal
                erModalÅpen={true}
                lukkModal={jest.fn()}
                iaSak={dummyIaSak}
            />,
        );

        expect(screen.queryByRole("dialog")).toBeInTheDocument();
    });

    it("kaller bliEierNyFlyt med riktig orgnr ved klikk på 'Ta eierskap'", async () => {
        const lukkModal = jest.fn();
        render(
            <TaEierskapModal
                erModalÅpen={true}
                lukkModal={lukkModal}
                iaSak={dummyIaSak}
            />,
        );

        screen.getByText("Ta eierskap").click();

        await waitFor(() => {
            expect(nyFlyt.bliEierNyFlyt).toHaveBeenCalledTimes(1);
        });
        expect(nyFlyt.bliEierNyFlyt).toHaveBeenCalledWith(dummyIaSak.orgnr);
        expect(lukkModal).toHaveBeenCalledTimes(1);
    });

    it("kaller lukkModal ved klikk på 'Avbryt'", () => {
        const lukkModal = jest.fn();
        render(
            <TaEierskapModal
                erModalÅpen={true}
                lukkModal={lukkModal}
                iaSak={dummyIaSak}
            />,
        );

        screen.getByText("Avbryt").click();
        expect(lukkModal).toHaveBeenCalledTimes(1);
        expect(nyFlyt.bliEierNyFlyt).not.toHaveBeenCalled();
    });

    it("muterer iaSak, mineSaker og oversikt etter vellykket eierskap", async () => {
        render(
            <TaEierskapModal
                erModalÅpen={true}
                lukkModal={jest.fn()}
                iaSak={dummyIaSak}
            />,
        );

        screen.getByText("Ta eierskap").click();

        await waitFor(() => {
            expect(mockMuterIaSak).toHaveBeenCalledTimes(1);
        });
        expect(mockMuterMineSaker).toHaveBeenCalledTimes(1);
        expect(mockMuterOversikt).toHaveBeenCalledTimes(1);
    });

    it("kaller useOversiktMutate med riktig orgnr", () => {
        render(
            <TaEierskapModal
                erModalÅpen={true}
                lukkModal={jest.fn()}
                iaSak={dummyIaSak}
            />,
        );

        expect(oversikt.useOversiktMutate).toHaveBeenCalledWith(
            dummyIaSak.orgnr,
        );
    });

    it("kaller useHentSpesifikkSakNyFlyt med riktig orgnr og saksnummer", () => {
        render(
            <TaEierskapModal
                erModalÅpen={true}
                lukkModal={jest.fn()}
                iaSak={dummyIaSak}
            />,
        );

        expect(nyFlyt.useHentSpesifikkSakNyFlyt).toHaveBeenCalledWith(
            dummyIaSak.orgnr,
            dummyIaSak.saksnummer,
        );
    });
});
