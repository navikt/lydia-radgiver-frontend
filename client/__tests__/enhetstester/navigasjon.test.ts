/** @jest-environment jsdom */

import { åpneSpørreundersøkelseINyFane } from "../../src/util/navigasjon";

// erIDev is a value exported from Dekoratør, mocked here to control environment
jest.mock("../../src/components/Dekoratør/Dekoratør", () => ({
    erIDev: true,
}));

describe("åpneSpørreundersøkelseINyFane", () => {
    const originalOpen = window.open;

    beforeEach(() => {
        window.open = jest.fn();
    });

    afterEach(() => {
        window.open = originalOpen;
        jest.resetModules();
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
        jest.resetModules();

        jest.doMock("../../src/components/Dekoratør/Dekoratør", () => ({
            erIDev: false,
        }));

        const { åpneSpørreundersøkelseINyFane: åpneINyFaneProd } =
            await import("../../src/util/navigasjon");

        åpneINyFaneProd("spm-789", "PÅBEGYNT");

        expect(window.open).toHaveBeenCalledWith(
            "https://fia-arbeidsgiver.nav.no/spm-789/vert/oversikt",
        );
    });
});
