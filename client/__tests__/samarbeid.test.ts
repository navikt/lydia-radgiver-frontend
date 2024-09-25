import {
    DEFAULT_SAMARBEIDSNAVN,
    defaultNavnHvisTomt,
} from "../src/domenetyper/iaSakProsess";

describe("Default navn for samarbeid", () => {
    test("Hvis navn er tom string", () => {
        expect(defaultNavnHvisTomt("")).toMatch(DEFAULT_SAMARBEIDSNAVN);
        expect(defaultNavnHvisTomt(" ")).toMatch(DEFAULT_SAMARBEIDSNAVN);
    });
    test("Hvis er navn er null", () => {
        expect(defaultNavnHvisTomt(null)).toMatch(DEFAULT_SAMARBEIDSNAVN);
    });
    test("Hvis navn er undefined", () => {
        expect(defaultNavnHvisTomt(undefined)).toMatch(DEFAULT_SAMARBEIDSNAVN);
    });
    test("Hvis navn er riktig string", () => {
        expect(defaultNavnHvisTomt("Samarbeid 1")).toMatch("Samarbeid 1");
    });
});
