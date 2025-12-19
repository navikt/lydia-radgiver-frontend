import {
    skjulNyStatistikkBanner,
    skalViseStatistikkKommer,
} from "../../src/util/nyStatistikkBannerUtils";
import { Publiseringsinfo } from "../../src/domenetyper/publiseringsinfo";

const publiseringsinfo: Publiseringsinfo = {
    sistePubliseringsdato: "2023-03-02",
    nestePubliseringsdato: "2023-06-01",
    fraTil: {
        fra: {
            kvartal: 1,
            årstall: 2022,
        },
        til: {
            kvartal: 4,
            årstall: 2022,
        },
    },
};

describe("Sjekker at statistikk banner kan vises", () => {
    test("Skjul banner 5 dager før publisering", () => {
        expect(
            skjulNyStatistikkBanner(
                new Date("2023-05-25T10:15:59"),
                publiseringsinfo,
            ),
        ).toBeTruthy();
    });
    test("Vis banner 4 dager før publisering", () => {
        expect(
            skjulNyStatistikkBanner(
                new Date("2023-02-26T10:15:59"),
                publiseringsinfo,
            ),
        ).toBeFalsy();
    });

    test("Vis banner på publisering", () => {
        expect(
            skjulNyStatistikkBanner(
                new Date("2023-03-02T10:15:59"),
                publiseringsinfo,
            ),
        ).toBeFalsy();
    });

    test("Vis banner inntil 7 dager etter publisering", () => {
        expect(
            skjulNyStatistikkBanner(
                new Date("2023-03-08T23:59:59"),
                publiseringsinfo,
            ),
        ).toBeFalsy();
    });
    test("Skjul banner 8 dager etter publisering", () => {
        expect(
            skjulNyStatistikkBanner(
                new Date("2023-03-10T00:00:00"),
                publiseringsinfo,
            ),
        ).toBeTruthy();
    });

    test("Viser at statistikk kommer tett på neste publisering", () => {
        expect(
            skalViseStatistikkKommer(
                new Date("2023-05-27T00:00:00"),
                publiseringsinfo,
            ),
        ).toBeFalsy();

        expect(
            skalViseStatistikkKommer(
                new Date("2023-06-01T00:00:00"),
                publiseringsinfo,
            ),
        ).toBeTruthy();
    });
});
