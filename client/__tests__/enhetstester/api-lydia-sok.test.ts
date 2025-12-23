import "@testing-library/jest-dom";

import {
	appendIfNotDefaultValue,
	appendIfPresent,
	søkeverdierTilUrlSearchParams,
} from "../../src/api/lydia-api/sok";
import {
	getSykefraværsstatistikkAntallTreffUrl,
	getSykefraværsstatistikkUrl,
	getStatusoversiktUrl,
	sykefraværsstatistikkAntallTreffPath,
	sykefraværsstatistikkPath,
	statusoversiktPath,
} from "../../src/api/lydia-api/paths";
import { FiltervisningState } from "../../src/Pages/Prioritering/Filter/filtervisning-reducer";

const lagFilterstate = (overrides: Partial<FiltervisningState> = {}) => {
	const base = {
		kommuner: [{ nummer: "0301" }] as Array<{ nummer: string }>,
		valgteFylker: [
			{ fylke: { nummer: "03" } },
		] as Array<{ fylke: { nummer: string } }>,
		næringsgrupper: [{ kode: "A" }] as Array<{ kode: string }>,
		sykefraværsprosent: { fra: 0, til: 100 },
		valgtSnittfilter: "ALLE",
		antallArbeidsforhold: { fra: 5, til: 50 },
		sorteringsretning: "ASC",
		sorteringsnokkel: "IASTATUS",
		iaStatus: "IA",
		side: 1,
		bransjeprogram: ["BP1", "BP2"],
		eiere: [{ navIdent: "Z12345" }] as Array<{ navIdent: string }>,
		sektor: "PRIVAT",
	} as unknown as FiltervisningState;

	return {
		...base,
		...overrides,
	};
};

describe("appendIfNotDefaultValue", () => {
	test("appender ikke når verdien er default og skjulDefaultParametreIUrl=true", () => {
		const params = new URLSearchParams();

		appendIfNotDefaultValue(
			"side",
			undefined,
			1,
			(v) => String(v),
			params,
			true,
		);

		expect(params.toString()).toBe("");
	});

	test("appender når verdien ikke er default", () => {
		const params = new URLSearchParams();

		appendIfNotDefaultValue(
			"side",
			2,
			1,
			(v) => String(v),
			params,
			true,
		);

		expect(params.get("side")).toBe("2");
	});
});

describe("appendIfPresent", () => {
	test("appender ikke når verdien er undefined", () => {
		const params = new URLSearchParams();

		appendIfPresent("kommuner", undefined, (v) => String(v), params);

		expect(params.toString()).toBe("");
	});

	test("appender når verdien er satt og mapper gir ikke-tom streng", () => {
		const params = new URLSearchParams();

		appendIfPresent("kommuner", ["0301", "0302"], (v) => v.join(","), params);

		expect(params.get("kommuner")).toBe("0301,0302");
	});
});

describe("søkeverdierTilUrlSearchParams", () => {
	test("bygger opp forventede query-parametre fra FiltervisningState", () => {
		const filterstate = lagFilterstate();

		const params = søkeverdierTilUrlSearchParams(filterstate);
		const asString = params.toString();

		expect(asString).toContain("kommuner=0301");
		expect(asString).toContain("fylker=03");
		expect(asString).toContain("naringsgrupper=A");
		expect(asString).toContain("sykefravarsprosentFra=0.00");
		expect(asString).toContain("sykefravarsprosentTil=100.00");
		expect(asString).toContain("ansatteFra=5");
		expect(asString).toContain("side=1");
	});

	test("skjuler defaultverdier når skjulDefaultParametreIUrl=true", () => {
		const filterstate = lagFilterstate();

		const params = søkeverdierTilUrlSearchParams(filterstate, true);
		const asString = params.toString();

		expect(asString).not.toContain("sykefravarsprosentFra=0.00");
		expect(asString).not.toContain("sykefravarsprosentTil=100.00");
		expect(asString).not.toContain("side=1");
	});
});

describe("URL helpere i paths.ts", () => {
	const filterstate = lagFilterstate();

	test("getSykefraværsstatistikkUrl lager korrekt base-path og query", () => {
		const url = getSykefraværsstatistikkUrl(filterstate);

		expect(url.startsWith(`${sykefraværsstatistikkPath}?`)).toBe(true);
		const query = url.split("?")[1] ?? "";
		const params = new URLSearchParams(query);

		expect(params.get("kommuner")).toBe("0301");
		expect(params.get("fylker")).toBe("03");
	});

	test("getStatusoversiktUrl lager korrekt base-path", () => {
		const url = getStatusoversiktUrl(filterstate);

		expect(url.startsWith(`${statusoversiktPath}?`)).toBe(true);
	});

	test("getSykefraværsstatistikkAntallTreffUrl lager korrekt base-path", () => {
		const url = getSykefraværsstatistikkAntallTreffUrl(filterstate);

		expect(url.startsWith(`${sykefraværsstatistikkAntallTreffPath}?`)).toBe(
			true,
		);
	});
});
