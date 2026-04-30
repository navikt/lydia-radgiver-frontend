import { render, screen, fireEvent } from "@testing-library/react";
import React from "react";
import { BrowserRouter } from "react-router-dom";
import type { Mock } from "vitest";
import { axe } from "vitest-axe";
import {
    brukerMedGyldigToken,
    brukerMedLesetilgang,
} from "@/Pages/Prioritering/mocks/innloggetAnsattMock";
import Samarbeidsvelger from "@/Pages/Virksomhet/Samarbeidsvelger";
import { useHentBrukerinformasjon } from "@features/bruker/api/bruker";
import { useHentTeam } from "@features/bruker/api/team";
import { IaSakProsess } from "@features/sak/types/iaSakProsess";
import {
    dummyIaSak,
    dummyVirksomhetsinformasjon,
} from "@mocks/virksomhetsMockData";

vi.mock("@/Pages/Virksomhet/Samarbeid/NyttSamarbeidModal", () => ({
    NyttSamarbeidModal: () => <div data-testid="nytt-samarbeid-modal" />,
}));

vi.mock("@features/bruker/api/bruker", async () => ({
    ...(await vi.importActual("@features/bruker/api/bruker")),
    useHentBrukerinformasjon: vi.fn(),
}));

vi.mock("@features/bruker/api/team", async () => ({
    ...(await vi.importActual("@features/bruker/api/team")),
    useHentTeam: vi.fn(),
}));

const aktivtSamarbeid = (id: number, navn: string): IaSakProsess => ({
    id,
    saksnummer: dummyIaSak.saksnummer,
    navn,
    status: "AKTIV",
    sistEndret: new Date("2025-01-01"),
    opprettet: new Date("2025-01-01"),
});

const iaSakAktiv = {
    ...dummyIaSak,
    status: "AKTIV" as const,
    eidAv: brukerMedGyldigToken.ident,
};

function renderSamarbeidsvelger(
    samarbeidsliste: IaSakProsess[],
    bruker = brukerMedGyldigToken,
) {
    (useHentBrukerinformasjon as Mock).mockReturnValue({ data: bruker });
    (useHentTeam as Mock).mockReturnValue({
        data: [brukerMedGyldigToken.ident],
    });

    return render(
        <BrowserRouter>
            <Samarbeidsvelger
                iaSak={iaSakAktiv}
                samarbeidsliste={samarbeidsliste}
                virksomhet={dummyVirksomhetsinformasjon}
            />
        </BrowserRouter>,
    );
}

describe("Samarbeidsvelger", () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    describe("Universell utforming", () => {
        it("har ingen UU-feil med 0 samarbeid", async () => {
            const { container } = renderSamarbeidsvelger([]);
            expect(await axe(container)).toHaveNoViolations();
        });

        it("har ingen UU-feil med flere aktive samarbeid", async () => {
            const { container } = renderSamarbeidsvelger([
                aktivtSamarbeid(1, "Første samarbeid"),
                aktivtSamarbeid(2, "Andre samarbeid"),
            ]);
            expect(await axe(container)).toHaveNoViolations();
        });
    });

    describe("0 eksisterende samarbeid", () => {
        it("viser 'Ingen samarbeid'", () => {
            renderSamarbeidsvelger([]);
            expect(screen.getByText("Ingen samarbeid")).toBeInTheDocument();
        });

        it("viser legg-til-knapp for bruker med rettigheter", () => {
            renderSamarbeidsvelger([]);
            expect(
                screen.getByRole("button", { name: "Opprett samarbeid" }),
            ).toBeInTheDocument();
        });

        it("viser deaktivert legg-til-knapp for bruker med lesetilgang", () => {
            renderSamarbeidsvelger([], brukerMedLesetilgang);
            expect(
                screen.getByRole("button", { name: "Opprett samarbeid" }),
            ).toBeDisabled();
        });
    });

    describe("Flere eksisterende aktive samarbeid", () => {
        const samarbeidsliste = [
            aktivtSamarbeid(1, "Første samarbeid"),
            aktivtSamarbeid(2, "Andre samarbeid"),
            aktivtSamarbeid(3, "Tredje samarbeid"),
        ];

        it("viser antall aktive samarbeid i overskriften", () => {
            renderSamarbeidsvelger(samarbeidsliste);
            expect(screen.getByText("Samarbeid (3)")).toBeInTheDocument();
        });

        it("viser alle aktive samarbeid", () => {
            renderSamarbeidsvelger(samarbeidsliste);
            expect(screen.getByText("Første samarbeid")).toBeInTheDocument();
            expect(screen.getByText("Andre samarbeid")).toBeInTheDocument();
            expect(screen.getByText("Tredje samarbeid")).toBeInTheDocument();
        });

        it("viser legg-til-knapp for bruker med rettigheter", () => {
            renderSamarbeidsvelger(samarbeidsliste);
            expect(
                screen.getByTitle("Legg til nytt samarbeid"),
            ).toBeInTheDocument();
        });

        it("viser deaktivert legg-til-knapp for bruker med lesetilgang", () => {
            renderSamarbeidsvelger(samarbeidsliste, brukerMedLesetilgang);
            expect(screen.getByTitle("Legg til nytt samarbeid")).toBeDisabled();
        });

        it("åpner NyttSamarbeidModal ved klikk på legg-til-knapp", () => {
            renderSamarbeidsvelger(samarbeidsliste);
            fireEvent.click(screen.getByTitle("Legg til nytt samarbeid"));
            expect(
                screen.getByTestId("nytt-samarbeid-modal"),
            ).toBeInTheDocument();
        });
    });
});
