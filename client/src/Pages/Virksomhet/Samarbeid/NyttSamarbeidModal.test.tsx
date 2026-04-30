import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import type { Mock } from "vitest";
import { NyttSamarbeidModal } from "@/Pages/Virksomhet/Samarbeid/NyttSamarbeidModal";
import * as spørreundersøkelse from "@features/kartlegging/api/spørreundersøkelse";
import * as nyFlyt from "@features/sak/api/nyFlyt";
import {
    dummyIaSak,
    dummyVirksomhetsinformasjon,
} from "@mocks/virksomhetsMockData";

vi.mock("@features/sak/api/nyFlyt", async () => ({
    ...(await vi.importActual("@features/sak/api/nyFlyt")),
    opprettSamarbeidNyFlyt: vi.fn(),
    useHentHistorikkNyFlyt: vi.fn(),
    useHentSpesifikkSakNyFlyt: vi.fn(),
}));

vi.mock("@features/kartlegging/api/spørreundersøkelse", async () => ({
    ...(await vi.importActual("@features/kartlegging/api/spørreundersøkelse")),
    useHentSamarbeid: vi.fn(),
}));

const iaSak = { ...dummyIaSak, status: "VI_BISTÅR" as const };

function renderModal(åpen = true) {
    return render(
        <BrowserRouter>
            <NyttSamarbeidModal
                iaSak={iaSak}
                åpen={åpen}
                setÅpen={vi.fn()}
                virksomhet={dummyVirksomhetsinformasjon}
            />
        </BrowserRouter>,
    );
}

describe("NyttSamarbeidModal", () => {
    beforeEach(() => {
        vi.clearAllMocks();

        (nyFlyt.useHentHistorikkNyFlyt as Mock).mockReturnValue({
            data: [],
            loading: false,
            mutate: vi.fn(),
        });

        (nyFlyt.useHentSpesifikkSakNyFlyt as Mock).mockReturnValue({
            data: iaSak,
            loading: false,
            mutate: vi.fn(),
        });

        (spørreundersøkelse.useHentSamarbeid as Mock).mockReturnValue({
            data: [],
            loading: false,
            mutate: vi.fn(),
        });

        (nyFlyt.opprettSamarbeidNyFlyt as Mock).mockResolvedValue({});
    });

    test("viser modalen når den er åpen", () => {
        renderModal();
        expect(
            screen.getByRole("dialog", { name: "Opprett nytt samarbeid" }),
        ).toBeInTheDocument();
    });

    test("bruker useHentHistorikkNyFlyt for å invalidere cache etter opprettelse", async () => {
        const mutateMock = vi.fn();
        (nyFlyt.useHentHistorikkNyFlyt as Mock).mockReturnValue({
            data: [],
            loading: false,
            mutate: mutateMock,
        });
        (spørreundersøkelse.useHentSamarbeid as Mock).mockReturnValue({
            data: [],
            loading: false,
            mutate: vi.fn().mockResolvedValue([]),
        });

        renderModal();
        fireEvent.change(screen.getByRole("textbox"), {
            target: { value: "Test samarbeid" },
        });
        fireEvent.click(screen.getByRole("button", { name: "Opprett" }));

        await waitFor(() => {
            expect(mutateMock).toHaveBeenCalled();
        });
    });

    test("kaller opprettSamarbeidNyFlyt med riktig orgnummer", async () => {
        (spørreundersøkelse.useHentSamarbeid as Mock).mockReturnValue({
            data: [],
            loading: false,
            mutate: vi.fn().mockResolvedValue([]),
        });

        renderModal();
        fireEvent.change(screen.getByRole("textbox"), {
            target: { value: "Nytt samarbeid" },
        });
        fireEvent.click(screen.getByRole("button", { name: "Opprett" }));

        await waitFor(() => {
            expect(nyFlyt.opprettSamarbeidNyFlyt).toHaveBeenCalledWith(
                dummyVirksomhetsinformasjon.orgnr,
                expect.objectContaining({ navn: "Nytt samarbeid" }),
            );
        });
    });
});
