import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";

import {
	getSortertSvaralternativer,
	getSpørsmålMedSorterteSvaralternativer,
	useSpørsmålMedSorterteSvaralternativer,
} from "../../src/util/sorterSvaralternativer";
import { SpørsmålResultat } from "../../src/domenetyper/spørreundersøkelseResultat";

function lagSpørsmål(svarTekster: string[]): SpørsmålResultat {
	return {
		id: "spm-1",
		tekst: "Spørsmål",
		flervalg: true,
		antallDeltakereSomHarSvart: 10,
		kategori: undefined,
		svarListe: svarTekster.map((tekst, index) => ({
			id: `svar-${index}`,
			tekst,
			antallSvar: index + 1,
		})),
	};
}

describe("sorterSvaralternativer", () => {
	test("getSortertSvaralternativer sorterer etter definert rekkefølge når mulig", () => {
		const svarListe = lagSpørsmål(["Uenig", "Enig", "Vet ikke"]).svarListe;

		const sortert = getSortertSvaralternativer([...svarListe]);

		expect(sortert.map((s) => s.tekst)).toEqual([
			"Enig",
			"Uenig",
			"Vet ikke",
		]);
	});

	test("getSortertSvaralternativer returnerer original rekkefølge når ingen sett passer", () => {
		const svarListe = lagSpørsmål(["Annet svar", "Noe annet"]).svarListe;

		const resultat = getSortertSvaralternativer(svarListe);

		expect(resultat).toBe(svarListe);
		expect(resultat.map((s) => s.tekst)).toEqual([
			"Annet svar",
			"Noe annet",
		]);
	});

	test("getSpørsmålMedSorterteSvaralternativer lager nytt spørsmål med sortert svarliste", () => {
		const spørsmål = lagSpørsmål(["Uenig", "Enig", "Vet ikke"]);

		const resultat = getSpørsmålMedSorterteSvaralternativer(spørsmål);

		expect(resultat.svarListe.map((s) => s.tekst)).toEqual([
			"Enig",
			"Uenig",
			"Vet ikke",
		]);
		expect(resultat.id).toBe(spørsmål.id);
	});

	test("useSpørsmålMedSorterteSvaralternativer gir sorterte svaralternativer i komponent", () => {
		const spørsmål = lagSpørsmål(["Uenig", "Enig", "Vet ikke"]);

		function TestKomponent() {
			const resultat = useSpørsmålMedSorterteSvaralternativer(spørsmål);
			return (
				<div data-testid="svar-tekster">
					{resultat.svarListe.map((s) => s.tekst).join(",")}
				</div>
			);
		}

		render(<TestKomponent />);

		expect(screen.getByTestId("svar-tekster")).toHaveTextContent(
			"Enig,Uenig,Vet ikke",
		);
	});
});
