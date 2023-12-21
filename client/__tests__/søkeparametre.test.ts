import { søkeverdierTilUrlSearchParams } from "../src/api/lydia-api";
import { FiltervisningState, initialFiltervisningState } from "../src/Pages/Prioritering/Filter/filtervisning-reducer";
import { Kommune } from "../src/domenetyper/fylkeOgKommune";

describe("oversettelse fra søkeverdier til URL-parametre mot API", () => {
    test("tomme søkeverdier resulterer i default-verdier for søkeparametre", () => {
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

        const searchParams =
            søkeverdierTilUrlSearchParams(søkeverdier).toString();

        expect(searchParams).toBe(
            "sykefravarsprosentFra=0.00&sykefravarsprosentTil=100.00&ansatteFra=5&side=1"
        );
    });

    test("defaultverdier vises i søkeparametre", () => {
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

        const searchParams =
            søkeverdierTilUrlSearchParams(søkeverdier).toString();

        expect(searchParams).toBe(
            "sykefravarsprosentFra=0.00&sykefravarsprosentTil=100.00&ansatteFra=5&side=1"
        );
    });

    test("Ikkje bruk default-verdi for 'ansatteFra' når input er 0", () => {
        const søkeverdier: FiltervisningState = {
            ...initialFiltervisningState,
            antallArbeidsforhold: {
                fra: 0,
                til: 5,
            },
        };

        const searchParams =
            søkeverdierTilUrlSearchParams(søkeverdier,
            ).toString();

        expect(searchParams).toBe(
            "sykefravarsprosentFra=0.00&sykefravarsprosentTil=100.00&ansatteFra=0&ansatteTil=5&side=1"
        );
    })

    test("kommuner og fylker blir separert med komma som igjen blir escapet med %2C (og vi får med default-verdier)", () => {
        const kommuner: Kommune[] = [
            {navn: "A", navnNorsk: "A", nummer: "0000"},
            {navn: "B", navnNorsk: "B", nummer: "0001"},
        ];

        const søkeverdier: FiltervisningState = {
            ...initialFiltervisningState,
            kommuner,
            valgteFylker: [{
                fylke: {
                    nummer: "03",
                    navn: "Hei",
                },
                kommuner,
            }],
        };

        const searchParams =
            søkeverdierTilUrlSearchParams(søkeverdier).toString();
        expect(searchParams).toBe(
            "kommuner=0000%2C0001&fylker=03&sykefravarsprosentFra=0.00&sykefravarsprosentTil=100.00&ansatteFra=5&side=1"
        );
    });
});
