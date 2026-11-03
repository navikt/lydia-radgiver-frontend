import {
    FEILMELDINGER,
    formaterFrist,
    formaterMålverdi,
    opptatteTyper,
    parseMålverdi,
    Sykefraværsmålutkast,
    tilSamarbeidsmål,
    validerSykefraværsmål,
} from "./målskjema";

const utkast = (
    overstyring: Partial<Sykefraværsmålutkast> = {},
): Sykefraværsmålutkast => ({
    id: "1",
    type: "KORTTIDSFRAVÆR",
    nåværende: "6,5",
    mål: "4",
    frist: new Date(2026, 11, 31),
    ...overstyring,
});

describe("parseMålverdi", () => {
    test("godtar desimaltall med komma og punkt", () => {
        expect(parseMålverdi("6,5", "KORTTIDSFRAVÆR")).toBe(6.5);
        expect(parseMålverdi(" 6.5 ", "KORTTIDSFRAVÆR")).toBe(6.5);
    });

    test("avviser prosent over 100, negative tall og tekst", () => {
        expect(parseMålverdi("100,1", "LEGEMELDT_FRAVÆR")).toBeNull();
        expect(parseMålverdi("-1", "LEGEMELDT_FRAVÆR")).toBeNull();
        expect(parseMålverdi("-1", "TAPTE_DAGSVERK")).toBeNull();
        expect(parseMålverdi("1e2", "TAPTE_DAGSVERK")).toBeNull();
        expect(parseMålverdi("", "TAPTE_DAGSVERK")).toBeNull();
    });

    test("tapte dagsverk kan være over 100", () => {
        expect(parseMålverdi("1250,5", "TAPTE_DAGSVERK")).toBe(1250.5);
    });

    test("godtar høyst to desimaler", () => {
        expect(parseMålverdi("6,25", "KORTTIDSFRAVÆR")).toBe(6.25);
        expect(parseMålverdi("6,123", "KORTTIDSFRAVÆR")).toBeNull();
        expect(parseMålverdi("6,", "KORTTIDSFRAVÆR")).toBeNull();
    });
});

describe("validerSykefraværsmål", () => {
    test("gir gyldig mål med ISO-dato", () => {
        expect(validerSykefraværsmål(utkast(), [])).toEqual({
            ok: true,
            mål: {
                type: "KORTTIDSFRAVÆR",
                nåværende: 6.5,
                mål: 4,
                frist: "2026-12-31",
            },
        });
    });

    test("avviser type som allerede er brukt", () => {
        const resultat = validerSykefraværsmål(utkast(), ["KORTTIDSFRAVÆR"]);
        expect(resultat).toEqual({
            ok: false,
            feil: { type: FEILMELDINGER.duplikatType },
        });
    });

    test("gir feil for alle felt i tomt skjema", () => {
        const resultat = validerSykefraværsmål(
            utkast({ type: "", nåværende: "", mål: "", frist: undefined }),
            [],
        );
        expect(resultat).toEqual({
            ok: false,
            feil: {
                type: FEILMELDINGER.manglerType,
                nåværende: FEILMELDINGER.nåværendeProsent,
                mål: FEILMELDINGER.målProsent,
                frist: FEILMELDINGER.frist,
            },
        });
    });

    test("bruker dagsverk-meldinger for tapte dagsverk", () => {
        const resultat = validerSykefraværsmål(
            utkast({ type: "TAPTE_DAGSVERK", nåværende: "-3", mål: "x" }),
            [],
        );
        expect(resultat).toEqual({
            ok: false,
            feil: {
                nåværende: FEILMELDINGER.nåværendeDagsverk,
                mål: FEILMELDINGER.målDagsverk,
            },
        });
    });
});

describe("opptatteTyper", () => {
    test("holder målet som redigeres utenfor", () => {
        const alle = [
            utkast({ id: "a", type: "KORTTIDSFRAVÆR" }),
            utkast({ id: "b", type: "TAPTE_DAGSVERK" }),
            utkast({ id: "c", type: "" }),
        ];
        expect(opptatteTyper(alle, "a")).toEqual(["TAPTE_DAGSVERK"]);
    });
});

describe("tilSamarbeidsmål", () => {
    const lagret = [
        { id: 7, mål: "Ola skal tilbake", lagretMedKiAdvarsel: true },
    ];

    test("fjerner KI-flagget når et flagget mål endres og sjekken er grønn", () => {
        expect(
            tilSamarbeidsmål(
                { ...lagret[0], nøkkel: "a", mål: " Bedre dialog " },
                lagret,
                false,
            ),
        ).toEqual({ id: 7, mål: "Bedre dialog", lagretMedKiAdvarsel: false });
    });

    test("beholder KI-flagget på uendret mål", () => {
        expect(
            tilSamarbeidsmål({ ...lagret[0], nøkkel: "a" }, lagret, false),
        ).toEqual(lagret[0]);
    });
});

describe("formatering", () => {
    test("bruker norsk tallformat og riktig enhet", () => {
        expect(formaterMålverdi(6.5, "KORTTIDSFRAVÆR")).toBe("6,5\u00a0%");
        expect(formaterMålverdi(1250.5, "TAPTE_DAGSVERK")).toBe(
            "1\u00a0250,5\u00a0dagsverk",
        );
    });

    test("viser frist som norsk dato uten tidssoneforskyvning", () => {
        expect(formaterFrist("2026-12-31")).toBe("31.12.2026");
    });
});
