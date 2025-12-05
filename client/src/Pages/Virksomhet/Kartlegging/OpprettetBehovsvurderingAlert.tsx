import React from "react";
import { Alert } from "@navikt/ds-react";
import { useSpørreundersøkelse } from "../../../components/Spørreundersøkelse/SpørreundersøkelseContext";
import styles from './opprettetBehovsvurderingAlert.module.scss';
import { FormatertSpørreundersøkelseType } from "../../../components/Spørreundersøkelse/Spørreundersøkelseliste/utils";

export default function OpprettBehovsvurderingAlert({
	onClose,
}: {
	onClose: () => void;
}) {
	const { spørreundersøkelseType } = useSpørreundersøkelse(); // TODO: Faktisk bruk sist valgte type
	return (
		<Alert className={styles.alert} variant="success" closeButton onClose={onClose}>
			<FormatertSpørreundersøkelseType type={spørreundersøkelseType} /> opprettet. Når <FormatertSpørreundersøkelseType type={spørreundersøkelseType} storForbokstav={false} />en startes vil den være åpen i 24 timer.
		</Alert>
	);
}