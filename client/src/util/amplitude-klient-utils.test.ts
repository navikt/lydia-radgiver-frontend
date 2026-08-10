import { maskerSensitiveVerdierIUrl } from "./analytics-klient-utils";

describe("Masker sensitive verdier i url før logging til Umami", () => {
    test("URL blir uendret dersom det ikke er noe å maskere", () => {
        expect(maskerSensitiveVerdierIUrl(undefined)).toBe("");
        expect(maskerSensitiveVerdierIUrl("")).toBe("");
        expect(maskerSensitiveVerdierIUrl("ingen url her")).toBe(
            "ingen url her",
        );
        expect(
            maskerSensitiveVerdierIUrl("http://localhost:2222/statusoversikt"),
        ).toBe("http://localhost:2222/statusoversikt");
        expect(maskerSensitiveVerdierIUrl("12345678")).toBe("12345678");
    });

    test("Masker orgnr (9 siffer) i url", () => {
        expect(
            maskerSensitiveVerdierIUrl(
                "http://localhost:2222/virksomhet/852409131",
            ),
        ).toBe("http://localhost:2222/virksomhet/[PROXY-ORG-NUMBER]");
    });

    test("Masker sasksnummer og samarbeidId i url", () => {
        expect(
            maskerSensitiveVerdierIUrl(
                "http://localhost:2222/virksomhet/852409131/sak/01K5BFZKXHVCSX0659EVJJ0Z29/samarbeid/123",
            ),
        ).toBe(
            "http://localhost:2222/virksomhet/[PROXY-ORG-NUMBER]/sak/[PROXY-SAK-NUMBER]/samarbeid/[PROXY-SAMARBEID-ID]",
        );
    });

    test("Bevarer query parametre ved maskering av orgnr, saksnr, samarbeidId", () => {
        expect(
            maskerSensitiveVerdierIUrl(
                "http://localhost:2222/virksomhet/852409131/sak/01K5BFZKXHVCSX0659EVJJ0Z29/samarbeid/123?fane=behovsvurdering",
            ),
        ).toBe(
            "http://localhost:2222/virksomhet/[PROXY-ORG-NUMBER]/sak/[PROXY-SAK-NUMBER]/samarbeid/[PROXY-SAMARBEID-ID]?fane=behovsvurdering",
        );
    });
});
