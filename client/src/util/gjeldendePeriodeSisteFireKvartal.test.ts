import { getGjeldendePeriodeTekst } from "@/util/gjeldendePeriodeSisteFireKvartal";
import { Publiseringsinfo } from "@features/plan/types/publiseringsinfo";

describe("getGjeldendePeriodeTekst", () => {
    test("returnerer tom streng når publiseringsinfo mangler", () => {
        expect(getGjeldendePeriodeTekst(undefined)).toBe("");
    });

    test("formatterer fra- og til-kvartal korrekt når publiseringsinfo finnes", () => {
        const publiseringsinfo: Publiseringsinfo = {
            sistePubliseringsdato: "2024-01-01",
            nestePubliseringsdato: "2024-04-01",
            fraTil: {
                fra: { kvartal: 1, årstall: 2020 },
                til: { kvartal: 4, årstall: 2021 },
            },
        };

        const tekst = getGjeldendePeriodeTekst(publiseringsinfo);

        expect(tekst).toContain("1. kvartal 2020");
        expect(tekst).toContain("4. kvartal 2021");
    });
});
