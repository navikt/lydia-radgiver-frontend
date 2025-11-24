import {
    SpørreundersøkelseProvider,
    SpørreundersøkelseProviderProps,
} from "../../../../src/components/Spørreundersøkelse/SpørreundersøkelseContext";
import { IASak } from "../../../../src/domenetyper/domenetyper";
import { IaSakProsess } from "../../../../src/domenetyper/iaSakProsess";
import { render, screen } from "@testing-library/react";
import Spørreundersøkelseliste from "../../../../src/components/Spørreundersøkelse/Spørreundersøkelseliste";
import React from "react";
import VirksomhetContext from "../../../../src/Pages/Virksomhet/VirksomhetContext";
import { SamarbeidProvider } from "../../../../src/Pages/Virksomhet/Samarbeid/SamarbeidContext";
import { Virksomhet } from "../../../../src/domenetyper/virksomhet";
import { Spørreundersøkelse } from "../../../../src/domenetyper/spørreundersøkelse";

const dummyVirksomhet: Virksomhet = {
    orgnr: "123459876",
    navn: "SPENSTIG KATTEDYR",
    adresse: ["adresse"],
    postnummer: "1234",
    poststed: "POSTSTED",
    næring: {
        navn: "Jordbruk, tilhør. tjenester, jakt",
        kode: "01",
    },
    næringsundergruppe1: {
        navn: "Dyrking av ris",
        kode: "01.120",
    },
    næringsundergruppe2: {
        navn: "Utøvende kunstnere og underholdningsvirksomhet innen scenekunst",
        kode: "90.012",
    },
    næringsundergruppe3: {
        navn: "Bedriftsrådgivning og annen administrativ rådgivning",
        kode: "70.220",
    },
    bransje: null,
    sektor: "Statlig forvaltning",
    status: "AKTIV",
    aktivtSaksnummer: "01K5BFZM3JMXRM1N5682YG1WGF",
};
const dummyIaSak: IASak = {
    saksnummer: "01K5BFZM3JMXRM1N5682YG1WGF",
    orgnr: "123459876",
    opprettetTidspunkt: new Date("2025-09-17T09:27:09.682Z"),
    opprettetAv: "S54321",
    endretTidspunkt: new Date("2025-09-17T09:27:09.776Z"),
    endretAv: "X12345",
    endretAvHendelseId: "01K5BFZM6GSQYJ0904B75G0K3R",
    eidAv: "X12345",
    status: "VI_BISTÅR",
    gyldigeNesteHendelser: [
        {
            saksHendelsestype: "TA_EIERSKAP_I_SAK",
            gyldigeÅrsaker: [],
        },
    ],
    lukket: false,
};
const dummySamarbeid: IaSakProsess = {
    id: 3,
    saksnummer: "01K5BFZM3JMXRM1N5682YG1WGF",
    navn: "Avdeling Pusekatt",
    status: "AKTIV",
    sistEndret: new Date("2025-09-17T09:27:09.758Z"),
    opprettet: new Date("2025-09-17T09:27:09.758Z"),
};
const dummySpørreundersøkelseliste: Spørreundersøkelse[] = [
    {
        id: "0be2f07b-6df3-46db-b187-79760599dd19",
        samarbeidId: 3,
        status: "AVSLUTTET",
        publiseringStatus: "IKKE_PUBLISERT",
        opprettetAv: "X12345",
        type: "BEHOVSVURDERING",
        opprettetTidspunkt: new Date("2025-09-17T09:27:12.408Z"),
        endretTidspunkt: new Date("2025-09-17T09:27:12.875Z"),
        påbegyntTidspunkt: new Date("2025-09-17T09:27:12.424Z"),
        publisertTidspunkt: null,
        fullførtTidspunkt: new Date("2025-09-17T09:27:12.875Z"),
        gyldigTilTidspunkt: new Date("2025-09-18T09:27:12.408Z"),
        harMinstEttResultat: true,
    },
    {
        id: "cfe2aff5-929f-4a1e-b2e7-0fd44038fea1",
        samarbeidId: 3,
        status: "AVSLUTTET",
        publiseringStatus: "OPPRETTET",
        opprettetAv: "X12345",
        type: "BEHOVSVURDERING",
        opprettetTidspunkt: new Date("2025-09-17T09:27:10.782Z"),
        endretTidspunkt: new Date("2025-09-17T09:27:12.389Z"),
        påbegyntTidspunkt: new Date("2025-09-17T09:27:10.798Z"),
        publisertTidspunkt: null,
        fullførtTidspunkt: new Date("2025-09-17T09:27:12.389Z"),
        gyldigTilTidspunkt: new Date("2025-09-18T09:27:10.782Z"),
        harMinstEttResultat: true,
    },
    {
        id: "2f75a5ea-7ad9-46b5-b4e9-37cd167e7958",
        samarbeidId: 3,
        status: "AVSLUTTET",
        publiseringStatus: "IKKE_PUBLISERT",
        opprettetAv: "X12345",
        type: "BEHOVSVURDERING",
        opprettetTidspunkt: new Date("2025-09-17T09:27:10.165Z"),
        endretTidspunkt: new Date("2025-09-17T09:27:10.767Z"),
        påbegyntTidspunkt: new Date("2025-09-17T09:27:10.184Z"),
        publisertTidspunkt: null,
        fullførtTidspunkt: new Date("2025-09-17T09:27:10.767Z"),
        gyldigTilTidspunkt: new Date("2025-09-18T09:27:10.165Z"),
        harMinstEttResultat: true,
    },
    {
        id: "dd583280-6e81-4f3b-a110-f28d095e32e0",
        samarbeidId: 3,
        status: "AVSLUTTET",
        publiseringStatus: "IKKE_PUBLISERT",
        opprettetAv: "X12345",
        type: "BEHOVSVURDERING",
        opprettetTidspunkt: new Date("2025-09-17T09:27:09.912Z"),
        endretTidspunkt: new Date("2025-09-17T09:27:10.143Z"),
        påbegyntTidspunkt: new Date("2025-09-17T09:27:09.935Z"),
        publisertTidspunkt: null,
        fullførtTidspunkt: new Date("2025-09-17T09:27:10.143Z"),
        gyldigTilTidspunkt: new Date("2025-09-18T09:27:09.912Z"),
        harMinstEttResultat: false,
    },
    {
        id: "33ad219d-d864-44e5-ad53-6d7c7e58d834",
        samarbeidId: 3,
        status: "PÅBEGYNT",
        publiseringStatus: "IKKE_PUBLISERT",
        opprettetAv: "X12345",
        type: "BEHOVSVURDERING",
        opprettetTidspunkt: new Date("2025-09-17T09:27:09.862Z"),
        endretTidspunkt: new Date("2025-09-17T09:27:09.886Z"),
        påbegyntTidspunkt: new Date("2025-09-17T09:27:09.886Z"),
        publisertTidspunkt: null,
        fullførtTidspunkt: null,
        gyldigTilTidspunkt: new Date("2025-09-18T09:27:09.862Z"),
        harMinstEttResultat: false,
    },
    {
        id: "0ae3094f-ce08-40cd-9185-e55de51fbcd0",
        samarbeidId: 3,
        status: "AVSLUTTET",
        publiseringStatus: "IKKE_PUBLISERT",
        opprettetAv: "X12345",
        type: "BEHOVSVURDERING",
        opprettetTidspunkt: new Date("2025-09-17T09:27:09.815Z"),
        endretTidspunkt: null,
        påbegyntTidspunkt: null,
        publisertTidspunkt: null,
        fullførtTidspunkt: null,
        gyldigTilTidspunkt: new Date("2025-09-18T09:27:09.815Z"),
        harMinstEttResultat: false,
    },
];

function DummySpørreundersøkelseProvider({
    children,
    spørreundersøkelseliste = dummySpørreundersøkelseliste,
    iaSak = dummyIaSak,
    samarbeid = dummySamarbeid,
    brukerRolle = "Superbruker",
    kanEndreSpørreundersøkelser = true,
    sisteOpprettedeSpørreundersøkelseId,
    setSisteOpprettedeSpørreundersøkelseId,
    spørreundersøkelseType = "BEHOVSVURDERING",
}: { children: React.ReactNode } & Partial<SpørreundersøkelseProviderProps>) {
    const [sisteOpprettedeId, setSisteOpprettedeId] = React.useState("");
    return (
        <SamarbeidProvider samarbeid={dummySamarbeid}>
            <VirksomhetContext.Provider
                value={{
                    virksomhet: dummyVirksomhet,
                    iaSak: iaSak,
                    lasterIaSak: false,
                    fane: "behovsvurdering",
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

    it("Vi er i riktig univers", () => {
        expect(2 + 2).toBe(4);
    });

    it("Rendrer korrekt", () => {
        render(
            <DummySpørreundersøkelseProvider>
                <Spørreundersøkelseliste />
            </DummySpørreundersøkelseProvider>,
        );

        expect(
            screen.getAllByRole("heading", { name: "Behovsvurdering" }),
        ).toHaveLength(6);
    });
});
