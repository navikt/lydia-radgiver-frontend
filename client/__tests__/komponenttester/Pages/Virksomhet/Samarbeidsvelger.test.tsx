import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import { BrowserRouter } from "react-router-dom";
import React from "react";
import { axe } from "jest-axe";

import Samarbeidsvelger from "../../../../src/Pages/Virksomhet/Samarbeidsvelger";
import {
    dummyIaSak,
    dummyVirksomhetsinformasjon,
} from "../../../../__mocks__/virksomhetsMockData";
import {
    brukerMedGyldigToken,
    brukerMedLesetilgang,
} from "../../../../src/Pages/Prioritering/mocks/innloggetAnsattMock";
import { IaSakProsess } from "../../../../src/domenetyper/iaSakProsess";

jest.mock(
    "../../../../src/Pages/Virksomhet/Samarbeid/NyttSamarbeidModal",
    () => ({
        NyttSamarbeidModal: () => <div data-testid="nytt-samarbeid-modal" />,
    }),
);

jest.mock("../../../../src/api/lydia-api/bruker", () => ({
    ...jest.requireActual("../../../../src/api/lydia-api/bruker"),
    useHentBrukerinformasjon: jest.fn(),
}));

jest.mock("../../../../src/api/lydia-api/team", () => ({
    ...jest.requireActual("../../../../src/api/lydia-api/team"),
    useHentTeam: jest.fn(),
}));

import { useHentBrukerinformasjon } from "../../../../src/api/lydia-api/bruker";
import { useHentTeam } from "../../../../src/api/lydia-api/team";

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
    (useHentBrukerinformasjon as jest.Mock).mockReturnValue({ data: bruker });
    (useHentTeam as jest.Mock).mockReturnValue({
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
        jest.clearAllMocks();
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
