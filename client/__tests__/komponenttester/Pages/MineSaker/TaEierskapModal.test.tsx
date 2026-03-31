import { render, screen, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import { TaEierskapModal } from "../../../../src/Pages/MineSaker/TaEierSkapModal";
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
});
