
import { åpneSpørreundersøkelseINyFane } from "@/util/navigasjon";

// erIDev is a value exported from Dekoratør, mocked here to control environment
vi.mock("@/components/Dekoratør/Dekoratør", () => ({
    erIDev: true,
}));

describe("åpneSpørreundersøkelseINyFane", () => {
    const originalOpen = window.open;

    beforeEach(() => {
        window.open = vi.fn();
    });

    afterEach(() => {
        window.open = originalOpen;
        vi.resetModules();
    });

    test("åpner oversikt-side i dev-miljø for PÅBEGYNT", () => {
        åpneSpørreundersøkelseINyFane("spm-123", "PÅBEGYNT");

        expect(window.open).toHaveBeenCalledWith(
            "https://fia-arbeidsgiver.ekstern.dev.nav.no/spm-123/vert/oversikt",
        );
    });

    test("åpner grunn-URL i dev-miljø for andre statuser", () => {
        åpneSpørreundersøkelseINyFane("spm-456", "OPPRETTET");

        expect(window.open).toHaveBeenCalledWith(
            "https://fia-arbeidsgiver.ekstern.dev.nav.no/spm-456/vert",
        );
    });

    test("bruker prod-URL når erIDev er false", async () => {
        vi.resetModules();

        vi.doMock("@/components/Dekoratør/Dekoratør", () => ({
            erIDev: false,
        }));

        const { åpneSpørreundersøkelseINyFane: åpneINyFaneProd } =
            await import("@/util/navigasjon");

        åpneINyFaneProd("spm-789", "PÅBEGYNT");

        expect(window.open).toHaveBeenCalledWith(
            "https://fia-arbeidsgiver.nav.no/spm-789/vert/oversikt",
        );
    });
});
