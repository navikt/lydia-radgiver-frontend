import { maskerOrgnr } from "../src/util/amplitude-klient-utils";

describe("Masker orgn (9 siffer) i url", () => {
    test("URL blir uendreet dersom det ikke er noe å maskere", () => {
        expect(maskerOrgnr(undefined)).toBe('');
        expect(maskerOrgnr('')).toBe('');
        expect(maskerOrgnr('ingen url her')).toBe('ingen url her');
        expect(maskerOrgnr('http://localhost:2222/statusoversikt')).toBe('http://localhost:2222/statusoversikt');
    });

    test("Masker orgnr i url", () => {
        expect(maskerOrgnr('http://localhost:2222/virksomhet/852409131')).toBe('http://localhost:2222/virksomhet/*********');
    });

});
