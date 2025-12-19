import { maskerOrgnr } from "../../src/util/analytics-klient-utils";

describe("Masker orgnr (9 siffer) i url", () => {
    test("URL blir uendret dersom det ikke er noe å maskere", () => {
        expect(maskerOrgnr(undefined)).toBe("");
        expect(maskerOrgnr("")).toBe("");
        expect(maskerOrgnr("ingen url her")).toBe("ingen url her");
        expect(maskerOrgnr("http://localhost:2222/statusoversikt")).toBe(
            "http://localhost:2222/statusoversikt",
        );
        expect(maskerOrgnr("12345678")).toBe("12345678");
    });

    test("Masker orgnr i url", () => {
        expect(maskerOrgnr("http://localhost:2222/virksomhet/852409131")).toBe(
            "http://localhost:2222/virksomhet/*********",
        );
    });
});
