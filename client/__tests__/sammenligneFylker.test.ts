import { FylkeMedKommuner, Kommune } from "../src/domenetyper/fylkeOgKommune";
import { erSammeFylker } from "../src/Pages/Prioritering/Filter/filtervisning-reducer";

describe("Sammenligne lister av fylker", () => {
    const kommuner: Kommune[] = [
        { navn: "A", navnNorsk: "A", nummer: "0000" },
        { navn: "B", navnNorsk: "B", nummer: "0001" },
    ];

    const OSLO: FylkeMedKommuner = {
        fylke: { navn: "Oslo", nummer: "03" },
        kommuner,
    };
    const INNLANDET: FylkeMedKommuner = {
        fylke: { navn: "Innlandet", nummer: "34" },
        kommuner,
    };
    const NORDLAND: FylkeMedKommuner = {
        fylke: { navn: "Nordland", nummer: "18" },
        kommuner,
    };

    test("Sammenligner med en tom liste", () => {
        const liste1: FylkeMedKommuner[] = [OSLO];
        expect(erSammeFylker(liste1, [])).toBeFalsy();
    });
    test("Sammenligner med en annen liste som er forskjellig", () => {
        const liste1: FylkeMedKommuner[] = [OSLO, INNLANDET];
        const liste2: FylkeMedKommuner[] = [OSLO, INNLANDET, NORDLAND];
        expect(erSammeFylker(liste1, liste2)).toBeFalsy();
    });
    test("Sammenligner to like lister", () => {
        const liste1: FylkeMedKommuner[] = [OSLO, INNLANDET];
        const liste2: FylkeMedKommuner[] = [OSLO, INNLANDET];
        expect(erSammeFylker(liste1, liste2)).toBeTruthy();
    });
    test("Sammenligner to like lister i forskjellig rekkefølge", () => {
        const liste1: FylkeMedKommuner[] = [OSLO, INNLANDET];
        const liste2: FylkeMedKommuner[] = [INNLANDET, OSLO];
        expect(erSammeFylker(liste1, liste2)).toBeTruthy();
    });
});
