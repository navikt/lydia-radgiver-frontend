import { sorterPåDato, formaterDatoForSpørreundersøkelse } from "./dato";
import { useSpørreundersøkelse } from "./SpørreundersøkelseContext";
import SpørreundersøkelseRad from "./SpørreundersøkelseRad";

export default function Spørreundersøkelseliste() {
	const {
		spørreundersøkelseliste,
		sisteOpprettedeSpørreundersøkelseId,
	} = useSpørreundersøkelse();

	return spørreundersøkelseliste.length > 0 &&
		sorterPåDato(spørreundersøkelseliste).map(
			(behovsvurdering, index, originalArray) => (
				<SpørreundersøkelseRad
					key={behovsvurdering.kartleggingId}
					spørreundersøkelse={behovsvurdering}
					avstandFraSiste={spørreundersøkelseliste.length - index}
					dato={formaterDatoForSpørreundersøkelse(
						behovsvurdering,
						index,
						originalArray,
					)}
					defaultOpen={
						behovsvurdering.kartleggingId ===
						sisteOpprettedeSpørreundersøkelseId
					}
				/>
			),
		);
}
