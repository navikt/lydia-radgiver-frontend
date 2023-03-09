import { skjulNyStatistikkBanner } from "../src/components/Banner/NyStatistikkPubliseresBanner";

const publiseringsdato = new Date('2023-03-02');

describe("Sjekker at statistikk banner kan vises", () => {
    test('Skjul banner 5 dager før publisering', () => {
        expect(skjulNyStatistikkBanner(
            new Date('2023-02-25T10:15:59'),
            publiseringsdato
        )).toBeTruthy();
    })
    test('Vis banner 4 dager før publisering', () => {
        expect(skjulNyStatistikkBanner(
            new Date('2023-02-26T10:15:59'),
            publiseringsdato
        )).toBeFalsy();
    })

    test('Vis banner på publisering', () => {
        expect(skjulNyStatistikkBanner(
            new Date('2023-03-02T10:15:59'),
            publiseringsdato
        )).toBeFalsy();
    })

    test('Vis banner inntil 7 dager etter publisering', () => {
        expect(skjulNyStatistikkBanner(
            new Date('2023-03-08T23:59:59'),
            publiseringsdato
        )).toBeFalsy();
    })
    test('Skjul banner 8 dager etter publisering', () => {
        expect(skjulNyStatistikkBanner(
            new Date('2023-03-10T00:00:00'),
            publiseringsdato
        )).toBeTruthy();
    })
});
