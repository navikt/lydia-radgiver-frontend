import { tallTilFemmerintervall } from "../../src/util/tallTilFemmerintervall";

describe("testar at ulike tal havnar i rette femmer-intervall", () => {
    test("Vi får ut rett streng når vi sender inn ulike tall", () => {
        expect(tallTilFemmerintervall(0)).toBe("0 – 4");
        expect(tallTilFemmerintervall(1)).toBe("0 – 4");
        expect(tallTilFemmerintervall(2)).toBe("0 – 4");
        expect(tallTilFemmerintervall(3)).toBe("0 – 4");
        expect(tallTilFemmerintervall(4)).toBe("0 – 4");

        expect(tallTilFemmerintervall(5)).toBe("5 – 9");
        expect(tallTilFemmerintervall(9)).toBe("5 – 9");

        expect(tallTilFemmerintervall(10)).toBe("10 – 14");
        expect(tallTilFemmerintervall(10.7)).toBe("10 – 14");
    });
});
