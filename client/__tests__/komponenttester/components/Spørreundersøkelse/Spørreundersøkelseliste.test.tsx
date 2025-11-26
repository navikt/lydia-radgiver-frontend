import {
    SpørreundersøkelseProvider,
    SpørreundersøkelseProviderProps,
} from "../../../../src/components/Spørreundersøkelse/SpørreundersøkelseContext";
import { render, screen } from "@testing-library/react";
import Spørreundersøkelseliste from "../../../../src/components/Spørreundersøkelse/Spørreundersøkelseliste";
import React from "react";
import VirksomhetContext from "../../../../src/Pages/Virksomhet/VirksomhetContext";
import { SamarbeidProvider } from "../../../../src/Pages/Virksomhet/Samarbeid/SamarbeidContext";
import { dummySpørreundersøkelseliste, dummyIaSak, dummySamarbeid, dummyVirksomhet } from "../../../../__mocks__/spørreundersøkelseDummyData";
import { Virksomhet } from "../../../../src/domenetyper/virksomhet";

function DummySpørreundersøkelseProvider({
    children,
    spørreundersøkelseliste = dummySpørreundersøkelseliste,
    iaSak = dummyIaSak,
    samarbeid = dummySamarbeid,
    brukerRolle = "Superbruker",
    kanEndreSpørreundersøkelser = true,
    sisteOpprettedeSpørreundersøkelseId,
    fane = "kartlegging",
    virksomhet = dummyVirksomhet,
    setSisteOpprettedeSpørreundersøkelseId,
    spørreundersøkelseType = "BEHOVSVURDERING",
}: { children: React.ReactNode, fane?: string, virksomhet?: Virksomhet } & Partial<SpørreundersøkelseProviderProps>) {
    const [sisteOpprettedeId, setSisteOpprettedeId] = React.useState("");
    return (
        <SamarbeidProvider samarbeid={dummySamarbeid}>
            <VirksomhetContext.Provider
                value={{
                    virksomhet,
                    iaSak,
                    lasterIaSak: false,
                    fane,
                    spørreundersøkelseId: null,
                    setFane: (fane: string) => {
                        console.log("setter fane til", fane);
                    },
                }}
            >
                <SpørreundersøkelseProvider
                    spørreundersøkelseliste={spørreundersøkelseliste}
                    iaSak={iaSak}
                    samarbeid={samarbeid}
                    brukerRolle={brukerRolle}
                    kanEndreSpørreundersøkelser={kanEndreSpørreundersøkelser}
                    sisteOpprettedeSpørreundersøkelseId={
                        sisteOpprettedeSpørreundersøkelseId ?? sisteOpprettedeId
                    }
                    setSisteOpprettedeSpørreundersøkelseId={
                        setSisteOpprettedeSpørreundersøkelseId ??
                        setSisteOpprettedeId
                    }
                    spørreundersøkelseType={spørreundersøkelseType}
                >
                    {children}
                </SpørreundersøkelseProvider>
            </VirksomhetContext.Provider>
        </SamarbeidProvider>
    );
}

describe("Spørreundersøkelseliste", () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it("Rendrer både behovsvurderinger og evalueringer", () => {
        render(
            <DummySpørreundersøkelseProvider fane="kartlegging">
                <Spørreundersøkelseliste />
            </DummySpørreundersøkelseProvider>,
        );

        expect(
            screen.getAllByRole("heading", { name: "Behovsvurdering" }),
        ).toHaveLength(7);
        expect(
            screen.getAllByRole("heading", { name: "Evaluering" }),
        ).toHaveLength(3);
    });

    it.todo("Viser melding når det ikke finnes noen spørreundersøkelser");
    it.todo("Sorterer spørreundersøkelser riktig etter opprettet dato");
    it.todo("Hamburgermeny har riktig innhold");

    it.todo("Gir ikke 'ny'-knapper for lesebruker");
    it.todo("Gir alltid knapp for ny behobsvurdering");
    it.todo("Gir ikke knapp for ny evaluering hvis det ikke finnes noen plan");
    it.todo("Gir knapp for ny evaluering hvis det finnes en plan");

    describe("status: OPPRETTET", () => {
        const antallOpprettet = dummySpørreundersøkelseliste.filter(({ status }) => status === "OPPRETTET").length;

        it("Viser riktig status", () => {
            render(
                <DummySpørreundersøkelseProvider>
                    <Spørreundersøkelseliste />
                </DummySpørreundersøkelseProvider>,
            );

            expect(antallOpprettet).toBeGreaterThan(0);
            expect(screen.getAllByText("Opprettet")).toHaveLength(antallOpprettet);
        });

        it("Viser riktig knapper", () => {
            render(
                <DummySpørreundersøkelseProvider>
                    <Spørreundersøkelseliste />
                </DummySpørreundersøkelseProvider>,
            );

            expect(antallOpprettet).toBeGreaterThan(0);
            expect(screen.getAllByRole("button", { name: "Start" })).toHaveLength(antallOpprettet);
            expect(screen.getAllByRole("button", { name: "Forhåndsvis" })).toHaveLength(antallOpprettet);
        });
        it.todo("Gir ikke knapp for lesebruker");
    });
    /* describe("status: PÅBEGYNT", () => {
        const antallPåbegynt = dummySpørreundersøkelseliste.filter(({ status }) => status === "PÅBEGYNT").length;
        it.todo("Viser riktig status");
        it.todo("Gir riktige knapper");
        it.todo("Gir ikke knapp for utgått spørreundersøkelse");
        it.todo("Gir ikke knapp for lesebruker");
    });
    describe("status: AVSLUTTET", () => {
        const antallAvsluttet = dummySpørreundersøkelseliste.filter(({ status }) => status === "AVSLUTTET").length;
        it.todo("Viser riktig status");
        it.todo("Gir sletteknapp hvis undersøkelse har for få svar");
        it.todo("Gir ikke sletteknapp for lesebruker");
        it.todo("Gir ikke sletteknapp hvis undersøkelse har nok svar");
        it.todo("Viser resultat");
    });
    describe("status: SLETTET", () => {
        const antallSlettet = dummySpørreundersøkelseliste.filter(({ status }) => status === "SLETTET").length;
        it.todo("Viser ikke rad");
    }); */
});
