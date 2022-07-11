import {Søkeverdier} from "../src/domenetyper";
import {søkeverdierTilUrlSearchParams} from "../src/api/lydia-api";


describe("oversettelse fra søkeverdier til URL-parametre", () => {
    test("tomme søkeverdier resulterer i søkeparametre uten noen verdier", () => {
        const søkeverdier: Søkeverdier = {}
        const searchParams = søkeverdierTilUrlSearchParams(søkeverdier).toString()

        expect(searchParams).toBe(
            "kommuner=&fylker=&neringsgrupper=&sykefraversprosentFra=&sykefraversprosentTil=&ansatteFra=&ansatteTil=&sorteringsnokkel=&iaStatus=&side=&bransjeprogram=&kunMineVirksomheter=&skalInkludereTotaltAntall=false"
        )
    })

    test("kommuner og fylker blir separert med komma som igjen blir escapet med %2C", () => {
        const søkeverdier: Søkeverdier = {
            kommuner: [{navn: "A", nummer: "0000"}, {navn: "B", nummer: "0001"}],
            fylker: [{navn: "F", nummer: "03"}],
        }
        const searchParams = søkeverdierTilUrlSearchParams(søkeverdier).toString()
        expect(searchParams).toBe(
            `kommuner=0000%2C0001&fylker=03&neringsgrupper=&sykefraversprosentFra=&sykefraversprosentTil=&ansatteFra=&ansatteTil=&sorteringsnokkel=&iaStatus=&side=&bransjeprogram=&kunMineVirksomheter=&skalInkludereTotaltAntall=false`
        )

    })
})
