import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import { BrowserRouter } from "react-router-dom";
import Sakshistorikkmodal from "@/Pages/Virksomhet/Sakshistorikk/SakshistorikkInnhold/Sakshistorikkmodal";
import * as nyFlyt from "@features/sak/api/nyFlyt";
import { dummySakshistorikk } from "@mocks/virksomhetsMockData";

jest.mock("@features/sak/api/nyFlyt", () => ({
    ...jest.requireActual("@features/sak/api/nyFlyt"),
    useHentHistorikkNyFlyt: jest.fn(),
}));

const orgnr = "840623927";
const virksomhetsnavn = "Test AS";

function renderModal() {
    return render(
        <BrowserRouter>
            <Sakshistorikkmodal
                orgnr={orgnr}
                virksomhetsnavn={virksomhetsnavn}
            />
        </BrowserRouter>,
    );
}

describe("Sakshistorikkmodal", () => {
    beforeEach(() => {
        jest.clearAllMocks();

        (nyFlyt.useHentHistorikkNyFlyt as jest.Mock).mockReturnValue({
            data: dummySakshistorikk,
            loading: false,
        });
    });

    test("viser Historikk-knapp", () => {
        renderModal();
        expect(
            screen.getByRole("button", { name: "Historikk" }),
        ).toBeInTheDocument();
    });

    test("modalen er ikke synlig ved oppstart", () => {
        renderModal();
        expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    });

    test("åpner modal ved klikk på Historikk-knappen", () => {
        renderModal();
        fireEvent.click(screen.getByRole("button", { name: "Historikk" }));
        expect(screen.getByRole("dialog")).toBeInTheDocument();
        expect(
            screen.getByText(`Historikk for ${virksomhetsnavn}`),
        ).toBeInTheDocument();
    });

    test("bruker useHentHistorikkNyFlyt med riktig orgnummer", () => {
        renderModal();
        fireEvent.click(screen.getByRole("button", { name: "Historikk" }));

        expect(nyFlyt.useHentHistorikkNyFlyt).toHaveBeenCalledWith(orgnr);
    });

    test("viser feilmelding når historikk ikke kan hentes", () => {
        (nyFlyt.useHentHistorikkNyFlyt as jest.Mock).mockReturnValue({
            data: undefined,
            loading: false,
        });
        renderModal();
        fireEvent.click(screen.getByRole("button", { name: "Historikk" }));

        expect(
            screen.getByText("Kunne ikke hente sakshistorikk"),
        ).toBeInTheDocument();
    });
});
