import { render, screen, waitFor } from "@testing-library/react";
import { TaEierskapModal } from "@/Pages/MineSaker/TaEierSkapModal";
import * as oversikt from "@/Pages/Virksomhet/Debugside/Oversikt";
import * as nyFlyt from "@features/sak/api/nyFlyt";
import { dummyIaSak } from "@mocks/virksomhetsMockData";

const mockMuterIaSak = vi.fn();
const mockMuterMineSaker = vi.fn();
const mockMuterOversikt = vi.fn();

vi.mock("@features/sak/api/nyFlyt", async () => ({
    ...(await vi.importActual("@features/sak/api/nyFlyt")),
    bliEierNyFlyt: vi.fn(() => Promise.resolve()),
    useHentSpesifikkSakNyFlyt: vi.fn(() => ({
        data: dummyIaSak,
        loading: false,
        mutate: mockMuterIaSak,
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
    useOversiktMutate: vi.fn(() => mockMuterOversikt),
}));

describe("TaEierskapModal", () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it("viser modaltekst når den er åpen", () => {
        render(
            <TaEierskapModal
                erModalÅpen={true}
                lukkModal={vi.fn()}
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
                lukkModal={vi.fn()}
                iaSak={dummyIaSak}
            />,
        );

        expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    });

    it("vises synlig når erModalÅpen er true", () => {
        render(
            <TaEierskapModal
                erModalÅpen={true}
                lukkModal={vi.fn()}
                iaSak={dummyIaSak}
            />,
        );

        expect(screen.queryByRole("dialog")).toBeInTheDocument();
    });

    it("kaller bliEierNyFlyt med riktig orgnr ved klikk på 'Ta eierskap'", async () => {
        const lukkModal = vi.fn();
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
        const lukkModal = vi.fn();
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
                lukkModal={vi.fn()}
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
                lukkModal={vi.fn()}
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
                lukkModal={vi.fn()}
                iaSak={dummyIaSak}
            />,
        );

        expect(nyFlyt.useHentSpesifikkSakNyFlyt).toHaveBeenCalledWith(
            dummyIaSak.orgnr,
            dummyIaSak.saksnummer,
        );
    });
});
