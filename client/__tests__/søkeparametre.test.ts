import { Kommune, Søkeverdier } from "../src/domenetyper";
import { søkeverdierTilUrlSearchParams } from "../src/api/lydia-api";
import { FiltervisningState } from "../src/Pages/Virksomhet/filtervisning-reducer";

describe("oversettelse fra søkeverdier til URL-parametre", () => {
    test("tomme søkeverdier resulterer i søkeparametre uten noen verdier", () => {
        const søkeverdier: FiltervisningState = {
            antallArbeidsforhold: {
                fra: 5,
                til: NaN,
            },
            bransjeprogram: [],
            kommuner: [],
            næringsgrupper: [],
            side: 1,
            sykefraværsprosent: {
                fra: 0,
                til: 100,
            },
        };
        const searchParams =
            søkeverdierTilUrlSearchParams(søkeverdier).toString();

        expect(searchParams).toBe(
            "kommuner=&fylker=&neringsgrupper=&sykefraversprosentFra=0.00&sykefraversprosentTil=100.00&ansatteFra=5&ansatteTil=&sorteringsnokkel=&sorteringsretning=desc&iaStatus=&side=1&bransjeprogram=&eiere="
        );
    });

    test("kommuner og fylker blir separert med komma som igjen blir escapet med %2C", () => {
        const kommuner: Kommune[] = [
            { navn: "A", nummer: "0000" },
            { navn: "B", nummer: "0001" },
        ];
        const søkeverdier: FiltervisningState = {
            antallArbeidsforhold: {
                fra: 5,
                til: NaN,
            },
            bransjeprogram: [],
            næringsgrupper: [],
            side: 1,
            sykefraværsprosent: {
                fra: 0,
                til: 100,
            },
            kommuner,
            valgtFylke: {
                fylke: {
                    nummer: "03",
                    navn: "Hei",
                },
                kommuner,
            },
        };
        const searchParams =
            søkeverdierTilUrlSearchParams(søkeverdier).toString();
        expect(searchParams).toBe(
            `kommuner=0000%2C0001&fylker=03&neringsgrupper=&sykefraversprosentFra=0.00&sykefraversprosentTil=100.00&ansatteFra=5&ansatteTil=&sorteringsnokkel=&sorteringsretning=desc&iaStatus=&side=1&bransjeprogram=&eiere=`
        );
    });
});
