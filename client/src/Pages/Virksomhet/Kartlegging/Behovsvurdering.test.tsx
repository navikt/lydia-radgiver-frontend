import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { IAProsessStatusType } from "@/domenetyper/domenetyper";
import { brukerMedGyldigToken } from "@/Pages/Prioritering/mocks/innloggetAnsattMock";
import { Kartleggingsliste } from "@/Pages/Virksomhet/Kartlegging/Kartleggingsliste";
import { SamarbeidProvider } from "@/Pages/Virksomhet/Samarbeid/SamarbeidContext";
import VirksomhetContext, {
    VirksomhetContextType,
} from "@/Pages/Virksomhet/VirksomhetContext";
import { opprettKartleggingNyFlyt } from "@features/sak/api/nyFlyt";
import { dummySpørreundersøkelseliste } from "@mocks/spørreundersøkelseDummyData";
import {
    dummyIaSak,
    dummySamarbeid,
    dummyPlan,
    dummyVirksomhetsinformasjon,
} from "@mocks/virksomhetsMockData";

vi.mock("@features/kartlegging/api/spørreundersøkelse", async () => ({
    ...(await vi.importActual("@features/kartlegging/api/spørreundersøkelse")),
    useSpørreundersøkelsesliste: vi.fn(() => ({
        data: dummySpørreundersøkelseliste,
        loading: false,
        validating: false,
        mutate: vi.fn(),
    })),
}));

vi.mock("@features/sak/api/sak", async () => ({
    ...(await vi.importActual("@features/sak/api/sak")),
    useHentIASaksStatus: vi.fn(() => ({
        data: undefined,
        loading: false,
        mutate: vi.fn(),
    })),
}));

vi.mock("@features/bruker/api/team", async () => ({
    ...(await vi.importActual("@features/bruker/api/team")),
    useHentTeam: vi.fn(() => ({
        data: [brukerMedGyldigToken.ident],
        loading: false,
    })),
}));

vi.mock("@features/bruker/api/bruker", async () => ({
    ...(await vi.importActual("@features/bruker/api/bruker")),
    useHentBrukerinformasjon: vi.fn(() => ({
        data: brukerMedGyldigToken,
        loading: false,
    })),
}));

vi.mock("@features/plan/api/plan", async () => ({
    ...(await vi.importActual("@features/plan/api/plan")),
    useHentPlan: vi.fn(() => ({
        data: dummyPlan,
        loading: false,
        validating: false,
    })),
}));

vi.mock("@features/sak/api/nyFlyt", async () => ({
    ...(await vi.importActual("@features/sak/api/nyFlyt")),
    opprettKartleggingNyFlyt: vi.fn(),
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
        setFane: vi.fn(),
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
        vi.clearAllMocks();
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
        vi.mocked(opprettKartleggingNyFlyt).mockResolvedValue({
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
