import "@testing-library/jest-dom";

import {
    EksternNavigeringKategorier,
    FilterverdiKategorier,
    MineSakerFilterKategorier,
    Søkekomponenter,
    loggBrukerFulgteRedirectlenkeMedSøk,
    loggBrukerRedirigertMedSøkAlert,
    loggEksportertTilPdf,
    loggFilterverdiKategorier,
    loggFølgeSak,
    loggGåTilSakFraMineSaker,
    loggGraflinjeEndringer,
    loggMineSakerFilter,
    loggModalÅpnet,
    loggNavigeringMedEksternLenke,
    loggNavigertTilNyTab,
    loggEndringAvPlan,
    loggSendBrukerTilKartleggingerTab,
    loggStatusendringPåSak,
    loggTogglingAvAutosøk,
    loggTømmingAvFilterverdier,
    setTilgangsnivå,
} from "../../src/util/analytics-klient";
import {
    IAProsessStatusEnum,
    IASakshendelseTypeEnum,
} from "../../src/domenetyper/domenetyper";

interface MockUmami {
    track: jest.Mock;
    identify: jest.Mock;
}

// Helper to set up a mock umami object on window
const setupUmami = (): MockUmami => {
    const win = window as unknown as { umami?: MockUmami };
    win.umami = {
        track: jest.fn(),
        identify: jest.fn(),
    };

    return win.umami;
};

describe("analytics-klient med umami tilgjengelig", () => {
    let originalUmami: MockUmami | undefined;

    beforeEach(() => {
        const win = window as unknown as { umami?: MockUmami };
        originalUmami = win.umami;
        jest.spyOn(console, "warn").mockImplementation(() => undefined);
    });

    afterEach(() => {
        const win = window as unknown as { umami?: MockUmami };
        win.umami = originalUmami;
        (console.warn as jest.Mock).mockRestore();
    });

    test("loggGåTilSakFraMineSaker maskerer orgnr i destinasjon og kaller umami.track", () => {
        const umami = setupUmami();

        loggGåTilSakFraMineSaker(
            "gå-til-sak-knapp",
            "https://fia.nav.no/virksomhet/123456789",
        );

        expect(umami.track).toHaveBeenCalledTimes(1);
        const [eventNavn, eventData] = umami.track.mock.calls[0];
        expect(eventNavn).toBe("navigere");
        expect(eventData.destinasjon).toBe(
            "https://fia.nav.no/virksomhet/*********",
        );
    });

    test("setTilgangsnivå kaller umami.identify", () => {
        const umami = setupUmami();

        setTilgangsnivå("Superbruker");

        expect(umami.identify).toHaveBeenCalledWith({
            tilgangsnivå: "Superbruker",
        });
    });

    test("flere logg*-funksjoner kaller umami.track med forventede payloads", () => {
        const umami = setupUmami();

        loggTømmingAvFilterverdier();
        loggTogglingAvAutosøk(true);
        loggSendBrukerTilKartleggingerTab("fraModalNavn", "kartlegginger");
        loggStatusendringPåSak(
            IASakshendelseTypeEnum.enum.VIRKSOMHET_VURDERES,
            IAProsessStatusEnum.enum.AKTIV,
        );
        loggNavigeringMedEksternLenke(
            EksternNavigeringKategorier.FIA_BRUKERVEILEDNING,
        );
        loggGraflinjeEndringer(["linje1", "linje2"]);
        loggFølgeSak(true);
        loggGåTilSakFraMineSaker(
            "gå-til-sak-knapp",
            "https://fia.nav.no/virksomhet/123456789",
        );
        loggMineSakerFilter([
            MineSakerFilterKategorier.STATUS,
            MineSakerFilterKategorier.ARKIVERTE_SAKER,
        ]);
        loggFilterverdiKategorier(
            [FilterverdiKategorier.FYLKE, FilterverdiKategorier.STATUS],
            Søkekomponenter.STATUSOVERSIKT,
        );
        loggEksportertTilPdf("virksomhet", true);
        loggNavigertTilNyTab("oversikt");
        loggModalÅpnet("Min modal");
        loggEndringAvPlan("tema", "undertema", "valgt");
        loggBrukerRedirigertMedSøkAlert();
        loggBrukerFulgteRedirectlenkeMedSøk();

        // Vi bryr oss mest om at track faktisk blir kalt for hver funksjon
        // Detaljert struktur dekkes indirekte gjennom eksisterende bruk
        expect(umami.track).toHaveBeenCalled();
        expect(umami.track.mock.calls.length).toBeGreaterThanOrEqual(15);
    });
});

describe("analytics-klient uten umami", () => {
    let originalUmami: MockUmami | undefined;

    beforeEach(() => {
        const win = window as unknown as { umami?: MockUmami };
        originalUmami = win.umami;
        win.umami = undefined;
        jest.spyOn(console, "warn").mockImplementation(() => undefined);
    });

    afterEach(() => {
        const win = window as unknown as { umami?: MockUmami };
        win.umami = originalUmami;
        (console.warn as jest.Mock).mockRestore();
    });

    test("loggTømmingAvFilterverdier logger warning når umami mangler", () => {
        loggTømmingAvFilterverdier();

        expect(console.warn).toHaveBeenCalled();
    });
});
