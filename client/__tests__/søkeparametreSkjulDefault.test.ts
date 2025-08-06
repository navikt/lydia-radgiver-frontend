import { TextEncoder, TextDecoder } from "util";
// @ts-expect-error dette må gjøres for å få testene til å kjøre, da disse ikke er definert i jsdom
global.TextEncoder = TextEncoder;
// @ts-expect-error dette må gjøres for å få testene til å kjøre, da disse ikke er definert i jsdom
global.TextDecoder = TextDecoder;

import { søkeverdierTilUrlSearchParams } from "../src/api/lydia-api/sok";
import {
    FiltervisningState,
    initialFiltervisningState,
} from "../src/Pages/Prioritering/Filter/filtervisning-reducer";
import { Kommune } from "../src/domenetyper/fylkeOgKommune";

describe("oversettelse fra søkeverdier til URL-parametre i nettleservindu", () => {
    test("tomme søkeverdier resulterer i søkeparametre uten noen verdier", () => {
        const søkeverdier: FiltervisningState = {
            ...initialFiltervisningState,
            antallArbeidsforhold: {
                fra: NaN,
                til: NaN,
            },
            sykefraværsprosent: {
                fra: NaN,
                til: NaN,
            },
        };

        const searchParams = søkeverdierTilUrlSearchParams(
            søkeverdier,
            true,
        ).toString();

        expect(searchParams).toBe("");
    });

    test("defaultverdier resulterer i søkeparametre uten noen verdier", () => {
        const søkeverdier: FiltervisningState = {
            ...initialFiltervisningState,
            antallArbeidsforhold: {
                fra: 5,
                til: NaN,
            },
            sykefraværsprosent: {
                fra: 0,
                til: 100,
            },
        };

        const searchParams = søkeverdierTilUrlSearchParams(
            søkeverdier,
            true,
        ).toString();

        expect(searchParams).toBe("");
    });

    test("kommuner og fylker blir separert med komma som igjen blir escapet med %2C (uten default-verdier)", () => {
        const kommuner: Kommune[] = [
            { navn: "A", navnNorsk: "A", nummer: "0000" },
            { navn: "B", navnNorsk: "B", nummer: "0001" },
        ];

        const søkeverdier: FiltervisningState = {
            ...initialFiltervisningState,
            kommuner,
            valgteFylker: [
                {
                    fylke: {
                        nummer: "03",
                        navn: "Hei",
                    },
                    kommuner,
                },
            ],
        };

        const searchParams = søkeverdierTilUrlSearchParams(
            søkeverdier,
            true,
        ).toString();
        expect(searchParams).toBe(`kommuner=0000%2C0001&fylker=03`);
    });
});
