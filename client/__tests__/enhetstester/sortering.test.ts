import { Kvartal } from "../../src/domenetyper/kvartal";
import {
	sorterKvartalStigende,
	sorterPåDatoSynkende,
} from "../../src/util/sortering";

interface TestObjektMedDato {
	navn: string;
	dato: Date;
}

describe("sortering utils", () => {
	test("sorterKvartalStigende sorterer på årstall og kvartal", () => {
		const kvartaler: Kvartal[] = [
			{ årstall: 2024, kvartal: 3 },
			{ årstall: 2023, kvartal: 4 },
			{ årstall: 2023, kvartal: 2 },
		];

		const sortert = [...kvartaler].sort((a, b) =>
			sorterKvartalStigende(a, b),
		);

		expect(sortert).toEqual([
			{ årstall: 2023, kvartal: 2 },
			{ årstall: 2023, kvartal: 4 },
			{ årstall: 2024, kvartal: 3 },
		]);
	});

	test("sorterPåDatoSynkende sorterer nyeste dato først", () => {
		const liste: TestObjektMedDato[] = [
			{ navn: "eldst", dato: new Date(2022, 0, 1) },
			{ navn: "nyest", dato: new Date(2024, 0, 1) },
			{ navn: "midt", dato: new Date(2023, 0, 1) },
		];

		const sortert = [...liste].sort((a, b) =>
			sorterPåDatoSynkende(a.dato, b.dato),
		);

		expect(sortert.map((it) => it.navn)).toEqual([
			"nyest",
			"midt",
			"eldst",
		]);
	});
});
