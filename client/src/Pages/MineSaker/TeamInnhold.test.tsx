import { render, screen } from "@testing-library/react";
import type { Mock } from "vitest";
import TeamInnhold from "@/Pages/MineSaker/TeamInnhold";
import * as teamApi from "@features/bruker/api/team";
import { dummyIaSak } from "@mocks/virksomhetsMockData";

const BRUKER_IDENT = "Z123456";

vi.mock("@features/bruker/api/bruker", async () => ({
    ...(await vi.importActual("@features/bruker/api/bruker")),
    useHentBrukerinformasjon: vi.fn(() => ({
        data: {
            ident: BRUKER_IDENT,
            navn: "Test Testesen",
            epost: "",
            rolle: "Superbruker",
        },
        loading: false,
    })),
}));

const mockMuterFølgere = vi.fn();

vi.mock("@features/bruker/api/team", async () => ({
    ...(await vi.importActual("@features/bruker/api/team")),
    useHentTeam: vi.fn(() => ({
        data: [],
        loading: false,
        mutate: mockMuterFølgere,
    })),
    leggBrukerTilTeam: vi.fn(() => Promise.resolve()),
    fjernBrukerFraTeam: vi.fn(() => Promise.resolve()),
}));

vi.mock("@/Pages/Virksomhet/VirksomhetContext", async () => ({
    ...(await vi.importActual("@/Pages/Virksomhet/VirksomhetContext")),
    useErPåAktivSak: vi.fn(() => true),
}));
const defaultProps = {
    iaSak: dummyIaSak,
    åpneTaEierskapModal: vi.fn(),
};

describe("TeamInnhold", () => {
    beforeEach(() => {
        vi.clearAllMocks();
        (teamApi.useHentTeam as Mock).mockReturnValue({
            data: [],
            loading: false,
            mutate: mockMuterFølgere,
        });
    });

    describe("Eier-tekster", () => {
        it("viser 'Du eier virksomheten' når bruker er eier", () => {
            render(
                <TeamInnhold
                    {...defaultProps}
                    iaSak={{ ...dummyIaSak, eidAv: BRUKER_IDENT }}
                />,
            );

            expect(
                screen.getByText("Du eier virksomheten"),
            ).toBeInTheDocument();
            expect(
                screen.queryByText(/Ønsker du å ta eierskap til virksomheten/),
            ).not.toBeInTheDocument();
            expect(screen.queryByText("Ta eierskap")).not.toBeInTheDocument();
        });

        it("viser 'Ta eierskap'-tekst når bruker ikke er eier", () => {
            render(
                <TeamInnhold
                    {...defaultProps}
                    iaSak={{ ...dummyIaSak, eidAv: "ANNEN_IDENT" }}
                />,
            );

            expect(screen.getByText("Ta eierskap")).toBeInTheDocument();
            expect(
                screen.getByText(/Ønsker du å ta eierskap til virksomheten/),
            ).toBeInTheDocument();
            expect(
                screen.queryByText("Du eier virksomheten"),
            ).not.toBeInTheDocument();
        });

        it("viser 'Ingen eier' når saken ikke har eier", () => {
            render(
                <TeamInnhold
                    {...defaultProps}
                    iaSak={{ ...dummyIaSak, eidAv: null }}
                />,
            );

            expect(screen.getByText("Ingen eier")).toBeInTheDocument();
            expect(screen.getByText("Ta eierskap")).toBeInTheDocument();
        });
    });

    describe("Følger-tekster", () => {
        it("viser 'Følg virksomheten' og informasjonstekst når bruker ikke følger", () => {
            (teamApi.useHentTeam as Mock).mockReturnValue({
                data: [],
                loading: false,
                mutate: mockMuterFølgere,
            });

            render(<TeamInnhold {...defaultProps} />);

            expect(
                screen.getByRole("button", { name: /Følg virksomheten/i }),
            ).toBeInTheDocument();
            expect(
                screen.getByText(/Følg virksomheten for å se den under/),
            ).toBeInTheDocument();
            expect(
                screen.queryByRole("button", {
                    name: /Slutt å følge virksomheten/i,
                }),
            ).not.toBeInTheDocument();
        });

        it("viser 'Slutt å følge virksomheten' når bruker følger saken", () => {
            (teamApi.useHentTeam as Mock).mockReturnValue({
                data: [BRUKER_IDENT],
                loading: false,
                mutate: mockMuterFølgere,
            });

            render(<TeamInnhold {...defaultProps} />);

            expect(
                screen.getByRole("button", {
                    name: /Slutt å følge virksomheten/i,
                }),
            ).toBeInTheDocument();
            expect(
                screen.queryByText(/Følg virksomheten for å se den under/),
            ).not.toBeInTheDocument();
            expect(
                screen.queryByRole("button", {
                    name: /^Følg virksomheten$/i,
                }),
            ).not.toBeInTheDocument();
        });

        it("viser følgere i listen når det finnes følgere", () => {
            (teamApi.useHentTeam as Mock).mockReturnValue({
                data: [BRUKER_IDENT, "A111111"],
                loading: false,
                mutate: mockMuterFølgere,
            });

            render(<TeamInnhold {...defaultProps} />);

            const følgere = screen.getAllByText(BRUKER_IDENT);
            expect(følgere.length).toBeGreaterThanOrEqual(2);
            expect(screen.getByText("A111111")).toBeInTheDocument();
        });

        it("viser informasjonstekst når andre følger men ikke brukeren selv", () => {
            (teamApi.useHentTeam as Mock).mockReturnValue({
                data: ["A111111"],
                loading: false,
                mutate: mockMuterFølgere,
            });

            render(<TeamInnhold {...defaultProps} />);

            expect(screen.getByText("A111111")).toBeInTheDocument();
            expect(
                screen.getByText(/Følg virksomheten for å se den under/),
            ).toBeInTheDocument();
            expect(
                screen.getByRole("button", { name: /Følg virksomheten/i }),
            ).toBeInTheDocument();
        });
    });
});
