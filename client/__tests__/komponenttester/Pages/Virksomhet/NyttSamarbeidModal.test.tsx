import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import { BrowserRouter } from "react-router-dom";
import { NyttSamarbeidModal } from "../../../../src/Pages/Virksomhet/Samarbeid/NyttSamarbeidModal";
import {
    dummyIaSak,
    dummyVirksomhetsinformasjon,
} from "../../../../__mocks__/virksomhetsMockData";
import * as nyFlyt from "../../../../src/api/lydia-api/nyFlyt";
import * as spørreundersøkelse from "../../../../src/api/lydia-api/spørreundersøkelse";

jest.mock("../../../../src/api/lydia-api/nyFlyt", () => ({
    ...jest.requireActual("../../../../src/api/lydia-api/nyFlyt"),
    opprettSamarbeidNyFlyt: jest.fn(),
    useHentHistorikkNyFlyt: jest.fn(),
    useHentSpesifikkSakNyFlyt: jest.fn(),
}));

jest.mock("../../../../src/api/lydia-api/spørreundersøkelse", () => ({
    ...jest.requireActual("../../../../src/api/lydia-api/spørreundersøkelse"),
    useHentSamarbeid: jest.fn(),
}));

const iaSak = { ...dummyIaSak, status: "VI_BISTÅR" as const };

function renderModal(åpen = true) {
    return render(
        <BrowserRouter>
            <NyttSamarbeidModal
                iaSak={iaSak}
                åpen={åpen}
                setÅpen={jest.fn()}
                virksomhet={dummyVirksomhetsinformasjon}
            />
        </BrowserRouter>,
    );
}

describe("NyttSamarbeidModal", () => {
    beforeEach(() => {
        jest.clearAllMocks();

        (nyFlyt.useHentHistorikkNyFlyt as jest.Mock).mockReturnValue({
            data: [],
            loading: false,
            mutate: jest.fn(),
        });

        (nyFlyt.useHentSpesifikkSakNyFlyt as jest.Mock).mockReturnValue({
            data: iaSak,
            loading: false,
            mutate: jest.fn(),
        });

        (spørreundersøkelse.useHentSamarbeid as jest.Mock).mockReturnValue({
            data: [],
            loading: false,
            mutate: jest.fn(),
        });

        (nyFlyt.opprettSamarbeidNyFlyt as jest.Mock).mockResolvedValue({});
    });

    test("viser modalen når den er åpen", () => {
        renderModal();
        expect(
            screen.getByRole("dialog", { name: "Opprett nytt samarbeid" }),
        ).toBeInTheDocument();
    });

    test("bruker useHentHistorikkNyFlyt for å invalidere cache etter opprettelse", async () => {
        const mutateMock = jest.fn();
        (nyFlyt.useHentHistorikkNyFlyt as jest.Mock).mockReturnValue({
            data: [],
            loading: false,
            mutate: mutateMock,
        });
        (spørreundersøkelse.useHentSamarbeid as jest.Mock).mockReturnValue({
            data: [],
            loading: false,
            mutate: jest.fn().mockResolvedValue([]),
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
        (spørreundersøkelse.useHentSamarbeid as jest.Mock).mockReturnValue({
            data: [],
            loading: false,
            mutate: jest.fn().mockResolvedValue([]),
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
