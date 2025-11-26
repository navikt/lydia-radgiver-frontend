import {
    SpørreundersøkelseProvider,
    SpørreundersøkelseProviderProps,
} from "../../../../src/components/Spørreundersøkelse/SpørreundersøkelseContext";
import { act, render, screen } from "@testing-library/react";
import Spørreundersøkelseliste from "../../../../src/components/Spørreundersøkelse/Spørreundersøkelseliste";
import React from "react";
import VirksomhetContext from "../../../../src/Pages/Virksomhet/VirksomhetContext";
import { SamarbeidProvider } from "../../../../src/Pages/Virksomhet/Samarbeid/SamarbeidContext";
import { dummySpørreundersøkelseliste, dummyIaSak, dummySamarbeid, dummyVirksomhet, dummySpørreundersøkelseResultat } from "../../../../__mocks__/spørreundersøkelseDummyData";
import { Virksomhet } from "../../../../src/domenetyper/virksomhet";
import '@testing-library/jest-dom';


jest.mock("../../../../src/api/lydia-api/spørreundersøkelse", () => {
    return {
        __esModule: true,
        ...jest.requireActual(
            "../../../../src/api/lydia-api/spørreundersøkelse",
        ),
        useHentResultat: jest.fn(() => ({
            data: dummySpørreundersøkelseResultat,
            loading: false,
        })),
    };
});

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
}: { children: React.ReactNode, fane?: string, virksomhet?: Virksomhet, brukerrolle?: string } & Partial<SpørreundersøkelseProviderProps>) {
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

    it("Viser melding når det ikke finnes noen spørreundersøkelser", () => {
        render(
            <DummySpørreundersøkelseProvider
                spørreundersøkelseliste={[]}
            >
                <Spørreundersøkelseliste />
            </DummySpørreundersøkelseProvider>,
        );

        expect(screen.getByText("Det finnes ingen spørreundersøkelser på dette samarbeidet.")).toBeInTheDocument();
    });

    it("Sorterer spørreundersøkelser riktig etter opprettet dato", () => {
        render(
            <DummySpørreundersøkelseProvider spørreundersøkelseliste={[
                {
                    ...dummySpørreundersøkelseliste[5],
                    endretTidspunkt: new Date("01.06.25"),
                    type: "EVALUERING",
                    status: "PÅBEGYNT",
                },
                {
                    ...dummySpørreundersøkelseliste[1],
                    endretTidspunkt: new Date("01.02.25"),
                    type: "BEHOVSVURDERING",
                    status: "OPPRETTET",
                },
                {
                    ...dummySpørreundersøkelseliste[2],
                    endretTidspunkt: new Date("01.03.25"),
                    type: "BEHOVSVURDERING",
                    status: "PÅBEGYNT",
                },
                {
                    ...dummySpørreundersøkelseliste[4],
                    endretTidspunkt: new Date("01.05.25"),
                    type: "EVALUERING",
                    status: "OPPRETTET",
                },
                {
                    ...dummySpørreundersøkelseliste[3],
                    endretTidspunkt: new Date("01.04.25"),
                    type: "EVALUERING",
                    status: "AVSLUTTET",
                },
                {
                    ...dummySpørreundersøkelseliste[0],
                    endretTidspunkt: new Date("01.01.25"),
                    type: "BEHOVSVURDERING",
                    status: "AVSLUTTET",
                },
            ]}>
                <Spørreundersøkelseliste />
            </DummySpørreundersøkelseProvider>,
        );

        const alleHeadings = screen.getAllByRole("heading", { level: 3 });
        const forventetRekkefølge = [
            "Behovsvurdering", // 01.01.25
            "Behovsvurdering", // 01.02.25
            "Behovsvurdering", // 01.03.25
            "Evaluering", // 01.04.25
            "Evaluering", // 01.05.25
            "Evaluering", // 01.06.25
        ];

        forventetRekkefølge.forEach((tekst, index) => {
            expect(alleHeadings[index]).toHaveTextContent(tekst);
        });
    });

    it.todo("Hamburgermeny har riktig innhold");

    it.todo("Gir ikke 'ny'-knapper for lesebruker");
    it.todo("Gir alltid knapp for ny behobsvurdering");
    it.todo("Gir ikke knapp for ny evaluering hvis det ikke finnes noen plan");
    it.todo("Gir knapp for ny evaluering hvis det finnes en plan");

    it.todo("Behovsvurdering har knapp for å flytte");

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
        it("Gir ikke knapp for lesebruker", () => {
            render(
                <DummySpørreundersøkelseProvider brukerRolle="Lesetilgang">
                    <Spørreundersøkelseliste />
                </DummySpørreundersøkelseProvider>,
            );

            expect(antallOpprettet).toBeGreaterThan(0);
            expect(screen.queryByRole("button", { name: "Start" })).not.toBeInTheDocument();
            expect(screen.queryByRole("button", { name: "Forhåndsvis" })).not.toBeInTheDocument();
        });
    });
    describe("status: PÅBEGYNT", () => {
        const antallPåbegynt = dummySpørreundersøkelseliste.filter(({ status }) => status === "PÅBEGYNT").length;
        it("Viser riktig status", () => {
            render(
                <DummySpørreundersøkelseProvider>
                    <Spørreundersøkelseliste />
                </DummySpørreundersøkelseProvider>,
            );

            expect(antallPåbegynt).toBeGreaterThan(0);
            expect(screen.getAllByText("Påbegynt")).toHaveLength(antallPåbegynt);
        });
        it("Gir riktige knapper", () => {
            const dummyBehovsvurderingerMedPåbegynt = dummySpørreundersøkelseliste.filter(({ status, type }) => status === "PÅBEGYNT" && type === "BEHOVSVURDERING").map((undersøkelse) => ({
                ...undersøkelse,
                gyldigTilTidspunkt: new Date(new Date().getTime() + 1000000),
            }));
            const antallPåbegyntInnenFrist = dummyBehovsvurderingerMedPåbegynt.length;

            render(
                <DummySpørreundersøkelseProvider spørreundersøkelseliste={dummyBehovsvurderingerMedPåbegynt}>
                    <Spørreundersøkelseliste />
                </DummySpørreundersøkelseProvider>,
            );

            expect(antallPåbegyntInnenFrist).toBeGreaterThan(0);
            expect(screen.getAllByRole("button", { name: "Fortsett" })).toHaveLength(antallPåbegyntInnenFrist);
            expect(screen.getAllByRole("button", { name: "Fullfør" })).toHaveLength(antallPåbegyntInnenFrist);
            expect(screen.getAllByRole("button", { name: "Slett behovsvurdering" })).toHaveLength(antallPåbegyntInnenFrist);
        });

        it("Gir ikke knapp for utgått spørreundersøkelse", () => {
            const dummyBehovsvurderingerMedPåbegynt = dummySpørreundersøkelseliste.filter(({ status, type }) => status === "PÅBEGYNT" && type === "BEHOVSVURDERING").map((undersøkelse) => ({
                ...undersøkelse,
                gyldigTilTidspunkt: new Date(new Date().getTime() - 1000000),
            }));
            const antallPåbegyntInnenFrist = dummyBehovsvurderingerMedPåbegynt.length;

            render(
                <DummySpørreundersøkelseProvider spørreundersøkelseliste={dummyBehovsvurderingerMedPåbegynt}>
                    <Spørreundersøkelseliste />
                </DummySpørreundersøkelseProvider>,
            );

            expect(antallPåbegyntInnenFrist).toBeGreaterThan(0);
            expect(screen.queryByRole("button", { name: "Fortsett" })).not.toBeInTheDocument();
            expect(screen.queryByRole("button", { name: "Fullfør" })).not.toBeInTheDocument();
            expect(screen.queryByRole("button", { name: "Slett behovsvurdering" })).not.toBeInTheDocument();
        });
        it("Gir ikke knapp for lesebruker", () => {
            const dummyBehovsvurderingerMedPåbegynt = dummySpørreundersøkelseliste.filter(({ status, type }) => status === "PÅBEGYNT" && type === "BEHOVSVURDERING").map((undersøkelse) => ({
                ...undersøkelse,
                gyldigTilTidspunkt: new Date(new Date().getTime() + 1000000),
            }));
            const antallPåbegyntInnenFrist = dummyBehovsvurderingerMedPåbegynt.length;

            render(
                <DummySpørreundersøkelseProvider spørreundersøkelseliste={dummyBehovsvurderingerMedPåbegynt} brukerRolle="Lesetilgang">
                    <Spørreundersøkelseliste />
                </DummySpørreundersøkelseProvider>,
            );

            expect(antallPåbegyntInnenFrist).toBeGreaterThan(0);
            expect(screen.queryByRole("button", { name: "Fortsett" })).not.toBeInTheDocument();
            expect(screen.queryByRole("button", { name: "Fullfør" })).not.toBeInTheDocument();
            expect(screen.queryByRole("button", { name: "Slett behovsvurdering" })).not.toBeInTheDocument();
        });
    });
    describe("status: AVSLUTTET", () => {
        const antallAvsluttet = dummySpørreundersøkelseliste.filter(({ status }) => status === "AVSLUTTET").length;
        const dummySpørreundersøkelselisteMedFåSvar = dummySpørreundersøkelseliste.filter(({ status }) => status === "AVSLUTTET").map((undersøkelse, index) => {
            if (index === 0) {
                return {
                    ...undersøkelse,
                    harMinstEttResultat: false,
                };
            }
            return {
                ...undersøkelse,
                harMinstEttResultat: true,
            };
        });

        it("Viser riktig status", () => {
            render(
                <DummySpørreundersøkelseProvider>
                    <Spørreundersøkelseliste />
                </DummySpørreundersøkelseProvider>,
            );

            expect(antallAvsluttet).toBeGreaterThan(0);
            expect(screen.getAllByText("Fullført")).toHaveLength(antallAvsluttet);
        });
        it("Gir sletteknapp hvis undersøkelse har for få svar", () => {
            render(
                <DummySpørreundersøkelseProvider spørreundersøkelseliste={dummySpørreundersøkelselisteMedFåSvar}>
                    <Spørreundersøkelseliste />
                </DummySpørreundersøkelseProvider>,
            );

            expect(antallAvsluttet).toBeGreaterThan(0);
            expect(screen.getAllByRole("button", { name: "Slett" })).toHaveLength(1);
        });

        it("Gir ikke sletteknapp for lesebruker", () => {
            render(
                <DummySpørreundersøkelseProvider brukerRolle="Lesetilgang" spørreundersøkelseliste={dummySpørreundersøkelselisteMedFåSvar}>
                    <Spørreundersøkelseliste />
                </DummySpørreundersøkelseProvider>,
            );

            expect(antallAvsluttet).toBeGreaterThan(0);
            expect(screen.queryByRole("button", { name: "Slett" })).not.toBeInTheDocument();
        });

        it("Gir ikke sletteknapp hvis undersøkelse har nok svar", () => {
            const dummySpørreundersøkelselisteMedNokSvar = dummySpørreundersøkelseliste.filter(({ status }) => status === "AVSLUTTET").map((undersøkelse) => ({
                ...undersøkelse,
                harMinstEttResultat: true,
            }));
            render(
                <DummySpørreundersøkelseProvider spørreundersøkelseliste={dummySpørreundersøkelselisteMedNokSvar}>
                    <Spørreundersøkelseliste />
                </DummySpørreundersøkelseProvider>,
            );

            expect(dummySpørreundersøkelselisteMedNokSvar.length).toBeGreaterThan(0);
            expect(screen.queryByRole("button", { name: "Slett" })).not.toBeInTheDocument();
        });

        it("Viser resultat", () => {
            const antallAvsluttetMedResultat = dummySpørreundersøkelseliste.filter(
                ({ status, harMinstEttResultat }) => status === "AVSLUTTET" && harMinstEttResultat,
            ).length;
            render(
                <DummySpørreundersøkelseProvider>
                    <Spørreundersøkelseliste />
                </DummySpørreundersøkelseProvider>,
            );

            expect(antallAvsluttet).toBeGreaterThan(0);
            const visMerKnapper = screen.getAllByRole("button", { name: "Vis mer" });
            expect(visMerKnapper).toHaveLength(antallAvsluttetMedResultat);

            act(() => {
                visMerKnapper[0].click();
            });

            expect(
                screen.getByRole("heading", { name: "Partssamarbeid" }),
            ).toBeInTheDocument();
        });
    });
    describe("status: SLETTET", () => {
        const dummySpørreundersøkelselisteMedSlettet = [...dummySpørreundersøkelseliste];
        dummySpørreundersøkelselisteMedSlettet[0] = {
            ...dummySpørreundersøkelselisteMedSlettet[0],
            status: "SLETTET",
        };

        const antallSlettet = dummySpørreundersøkelselisteMedSlettet.filter(({ status }) => status === "SLETTET").length;

        it("Viser ikke rad", () => {
            render(
                <DummySpørreundersøkelseProvider spørreundersøkelseliste={dummySpørreundersøkelselisteMedSlettet}>
                    <Spørreundersøkelseliste />
                </DummySpørreundersøkelseProvider>,
            );

            expect(antallSlettet).toBeGreaterThan(0);
            expect(screen.queryByText("Slettet")).not.toBeInTheDocument();
        });
    });
});
