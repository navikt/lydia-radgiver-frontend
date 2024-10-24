import { appendIfNotDefaultValue } from "../src/api/lydia-api/sok";

describe("Få rette parametrar i url", () => {
    test("Skal returnere default-parameterar når skjulDefaultParametre=false", () => {
        const params = new URLSearchParams();
        const skjulDefaultParametre = false;
        const defaultverdi = 5;
        const forventaParams = new URLSearchParams();
        forventaParams.append("ansatteFra", defaultverdi.toString());

        appendIfNotDefaultValue(
            "ansatteFra",
            defaultverdi,
            defaultverdi,
            (verdi: number) => (Number.isNaN(verdi) ? "" : `${verdi}`),
            params,
            skjulDefaultParametre,
        );

        expect(params).toEqual(forventaParams);
    });

    test("Skal ikkje returnere default-parameterar når skjulDefaultParametre=true", () => {
        const params = new URLSearchParams();
        const skjulDefaultParametre = true;
        const defaultverdi = 5;
        const forventaParams = new URLSearchParams();

        appendIfNotDefaultValue(
            "ansatteFra",
            defaultverdi,
            defaultverdi,
            (verdi: number) => (Number.isNaN(verdi) ? "" : `${verdi}`),
            params,
            skjulDefaultParametre,
        );

        expect(params).toEqual(forventaParams);
    });

    test("Skal returnere default-parameterar som default når skjulDefaultParametre=false", () => {
        const params = new URLSearchParams();
        const skjulDefaultParametre = false;
        const verdi = NaN;
        const defaultverdi = 5;
        const forventaParams = new URLSearchParams();
        forventaParams.append("ansatteFra", defaultverdi.toString());

        appendIfNotDefaultValue(
            "ansatteFra",
            verdi,
            defaultverdi,
            (verdi: number) => (Number.isNaN(verdi) ? "" : `${verdi}`),
            params,
            skjulDefaultParametre,
        );

        expect(params).toEqual(forventaParams);
    });
});
