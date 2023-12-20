import { Fylke } from "../src/domenetyper/fylkeOgKommune";
import { erSammeFylker } from "../src/Pages/Prioritering/Filter/filtervisning-reducer";

describe("Sammenligne lister av fylker", () => {

    const OSLO: Fylke = { navn: "Oslo", nummer: "03" }
    const INNLANDET: Fylke = { navn: "Innlandet", nummer: "34" }
    const NORDLAND: Fylke = { navn: "Nordland", nummer: "18" }

    test('Sammenligner med en tom liste', () => {
        const liste1: Fylke[] = [OSLO]
        expect(erSammeFylker(liste1, [])).toBeFalsy()
    });
    test('Sammenligner med en annen liste som er forskjellig', () => {
        const liste1: Fylke[] = [OSLO, INNLANDET]
        const liste2: Fylke[] = [OSLO, INNLANDET, NORDLAND]
        expect(erSammeFylker(liste1, liste2)).toBeFalsy()
    });
    test('Sammenligner to like lister', () => {
        const liste1: Fylke[] = [OSLO, INNLANDET]
        const liste2: Fylke[] = [OSLO, INNLANDET]
        expect(erSammeFylker(liste1, liste2)).toBeTruthy()
    });
    test('Sammenligner to like lister i forskjellig rekkefølge', () => {
        const liste1: Fylke[] = [OSLO, INNLANDET]
        const liste2: Fylke[] = [INNLANDET, OSLO]
        expect(erSammeFylker(liste1, liste2)).toBeTruthy()
    });
})
