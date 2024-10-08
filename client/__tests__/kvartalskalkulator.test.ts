import {
    aktivitetIForrigeKvartalEllerNyere,
    datoTilKvartal,
    finnKvartalsNummer,
    kvartalDifferanse,
} from "../src/Pages/Virksomhet/Virksomhetsoversikt/IASakStatus/IngenAktivitetInfo/datoTilKvartal";

describe("Testar logikk for utrekning av kvartal", () => {
    test("Finn rett kvartal for kvar månad", () => {
        expect(finnKvartalsNummer(new Date("January 01, 2023 16:00:00"))).toBe(
            1,
        );
        expect(finnKvartalsNummer(new Date("February 01, 2023 16:00:00"))).toBe(
            1,
        );
        expect(finnKvartalsNummer(new Date("March 01, 2023 16:00:00"))).toBe(1);
        expect(finnKvartalsNummer(new Date("April 01, 2023 16:00:00"))).toBe(2);
        expect(finnKvartalsNummer(new Date("May 01, 2023 16:00:00"))).toBe(2);
        expect(finnKvartalsNummer(new Date("June 01, 2023 16:00:00"))).toBe(2);
        expect(finnKvartalsNummer(new Date("July 01, 2023 16:00:00"))).toBe(3);
        expect(finnKvartalsNummer(new Date("August 01, 2023 16:00:00"))).toBe(
            3,
        );
        expect(
            finnKvartalsNummer(new Date("September 01, 2023 16:00:00")),
        ).toBe(3);
        expect(finnKvartalsNummer(new Date("October 01, 2023 16:00:00"))).toBe(
            4,
        );
        expect(finnKvartalsNummer(new Date("November 01, 2023 16:00:00"))).toBe(
            4,
        );
        expect(finnKvartalsNummer(new Date("December 31, 2023 16:00:00"))).toBe(
            4,
        );
    });

    test("Får ut rett kvartal frå dato", () => {
        expect(
            datoTilKvartal(new Date("Januar 01, 2011 16:00:00")),
        ).toMatchObject({ kvartal: 1, årstall: 2011 });
        expect(
            datoTilKvartal(new Date("December 31, 2023 23:59:00")),
        ).toMatchObject({ kvartal: 4, årstall: 2023 });
    });

    test("Finn differansen mellom to kvartal", () => {
        const nå = { årstall: 2023, kvartal: 1 };

        // Nåtid
        expect(kvartalDifferanse(nå, nå)).toBe(0);

        // Framtid
        expect(kvartalDifferanse(nå, { kvartal: 2, årstall: 2023 })).toBe(1);
        expect(kvartalDifferanse(nå, { kvartal: 3, årstall: 2023 })).toBe(2);
        expect(kvartalDifferanse(nå, { kvartal: 1, årstall: 2024 })).toBe(4);

        // Fortid
        expect(kvartalDifferanse(nå, { kvartal: 4, årstall: 2022 })).toBe(-1);
        expect(kvartalDifferanse(nå, { kvartal: 1, årstall: 2022 })).toBe(-4);
        expect(kvartalDifferanse(nå, { kvartal: 1, årstall: 2018 })).toBe(-20);
    });

    test("Sjekk at vi får rekna ut om saken var utan aktivitet i heile førre kvartal", () => {
        const nå = new Date("June 01, 2023 16:00:00"); // 2. kvartal 2023
        const forrigeKvartal = new Date("January 01, 2023 16:00:00"); // 1. kvartal 2023
        const forriforrigeKvartal = new Date("December 01, 2022 16:00:00"); // 4. kvartal 2022
        const iFjor = new Date("June 01, 2022 16:00:00"); // 2. kvartal 2022
        const fremtida = new Date("December 01, 2024 16:00:00"); // 4. kvartal 2023

        expect(aktivitetIForrigeKvartalEllerNyere(nå, nå)).toBe(true);
        expect(aktivitetIForrigeKvartalEllerNyere(nå, forrigeKvartal)).toBe(
            true,
        );
        expect(
            aktivitetIForrigeKvartalEllerNyere(nå, forriforrigeKvartal),
        ).toBe(false);
        expect(aktivitetIForrigeKvartalEllerNyere(nå, iFjor)).toBe(false);
        expect(aktivitetIForrigeKvartalEllerNyere(nå, fremtida)).toBe(true);
    });
});
