import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import {
    dummyIaSak,
    dummySamarbeid,
    dummyPlan,
    dummyVirksomhetsinformasjon,
} from "../../../../../__mocks__/virksomhetsMockData";
import { dummySpørreundersøkelseliste } from "../../../../../__mocks__/spørreundersøkelseDummyData";
import { brukerMedGyldigToken } from "../../../../../src/Pages/Prioritering/mocks/innloggetAnsattMock";
import { Kartleggingsliste } from "../../../../../src/Pages/Virksomhet/Kartlegging/Kartleggingsliste";
import { SamarbeidProvider } from "../../../../../src/Pages/Virksomhet/Samarbeid/SamarbeidContext";
import VirksomhetContext, {
    VirksomhetContextType,
} from "../../../../../src/Pages/Virksomhet/VirksomhetContext";
import { IAProsessStatusType } from "../../../../../src/domenetyper/domenetyper";
import { opprettKartleggingNyFlyt } from "../../../../../src/api/lydia-api/nyFlyt";

jest.mock("../../../../../src/api/lydia-api/spørreundersøkelse", () => ({
    ...jest.requireActual(
        "../../../../../src/api/lydia-api/spørreundersøkelse",
    ),
    useSpørreundersøkelsesliste: jest.fn(() => ({
        data: dummySpørreundersøkelseliste,
        loading: false,
        validating: false,
        mutate: jest.fn(),
    })),
}));

jest.mock("../../../../../src/api/lydia-api/sak", () => ({
    ...jest.requireActual("../../../../../src/api/lydia-api/sak"),
    useHentIASaksStatus: jest.fn(() => ({
        data: undefined,
        loading: false,
        mutate: jest.fn(),
    })),
}));

jest.mock("../../../../../src/api/lydia-api/team", () => ({
    ...jest.requireActual("../../../../../src/api/lydia-api/team"),
    useHentTeam: jest.fn(() => ({
        data: [brukerMedGyldigToken.ident],
        loading: false,
    })),
}));

jest.mock("../../../../../src/api/lydia-api/bruker", () => ({
    ...jest.requireActual("../../../../../src/api/lydia-api/bruker"),
    useHentBrukerinformasjon: jest.fn(() => ({
        data: brukerMedGyldigToken,
        loading: false,
    })),
}));

jest.mock("../../../../../src/api/lydia-api/plan", () => ({
    ...jest.requireActual("../../../../../src/api/lydia-api/plan"),
    useHentPlan: jest.fn(() => ({
        data: dummyPlan,
        loading: false,
        validating: false,
    })),
}));

jest.mock("../../../../../src/api/lydia-api/nyFlyt", () => ({
    ...jest.requireActual("../../../../../src/api/lydia-api/nyFlyt"),
    opprettKartleggingNyFlyt: jest.fn(),
}));

const gjeldendeSamarbeid = dummySamarbeid[1];

function renderKartleggingsliste(status: IAProsessStatusType) {
    const iaSak = {
        ...dummyIaSak,
        status,
        eidAv: brukerMedGyldigToken.ident,
    };
    const virksomhetContextValue: VirksomhetContextType = {
        virksomhet: dummyVirksomhetsinformasjon,
        iaSak,
        lasterIaSak: false,
        fane: "kartlegging",
        setFane: jest.fn(),
        spørreundersøkelseId: null,
    };
    return render(
        <VirksomhetContext.Provider value={virksomhetContextValue}>
            <SamarbeidProvider samarbeid={gjeldendeSamarbeid}>
                <Kartleggingsliste
                    iaSak={iaSak}
                    gjeldendeSamarbeid={gjeldendeSamarbeid}
                />
            </SamarbeidProvider>
        </VirksomhetContext.Provider>,
    );
}

describe("Behovsvurdering", () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it("Ny behovsvurdering-knapp er aktivert når sak er AKTIV", () => {
        renderKartleggingsliste("AKTIV");

        expect(
            screen.getByRole("button", { name: "Ny behovsvurdering" }),
        ).toBeEnabled();
    });

    it("Ny behovsvurdering-knapp er deaktivert når sak er VURDERES", () => {
        renderKartleggingsliste("VURDERES");

        expect(
            screen.getByRole("button", { name: "Ny behovsvurdering" }),
        ).toBeDisabled();
    });

    it("Ny behovsvurdering-knapp er deaktivert når sak er KONTAKTES", () => {
        renderKartleggingsliste("KONTAKTES");

        expect(
            screen.getByRole("button", { name: "Ny behovsvurdering" }),
        ).toBeDisabled();
    });

    it("Ny behovsvurdering-knapp er deaktivert når sak er FULLFØRT", () => {
        renderKartleggingsliste("FULLFØRT");

        expect(
            screen.getByRole("button", { name: "Ny behovsvurdering" }),
        ).toBeDisabled();
    });

    it("Kaller opprettKartleggingNyFlyt ved klikk på ny behovsvurdering", async () => {
        jest.mocked(opprettKartleggingNyFlyt).mockResolvedValue({
            id: "ny-id",
            samarbeidId: gjeldendeSamarbeid.id,
            status: "OPPRETTET",
            publiseringStatus: "IKKE_PUBLISERT",
            opprettetAv: brukerMedGyldigToken.ident,
            type: "BEHOVSVURDERING",
            opprettetTidspunkt: new Date(),
            endretTidspunkt: new Date(),
            påbegyntTidspunkt: null,
            publisertTidspunkt: null,
            fullførtTidspunkt: null,
            gyldigTilTidspunkt: new Date(),
            harMinstEttResultat: false,
        });

        renderKartleggingsliste("AKTIV");

        fireEvent.click(
            screen.getByRole("button", { name: "Ny behovsvurdering" }),
        );

        await waitFor(() => {
            expect(opprettKartleggingNyFlyt).toHaveBeenCalledWith(
                dummyIaSak.orgnr,
                gjeldendeSamarbeid.id,
                "BEHOVSVURDERING",
            );
        });
    });
});
