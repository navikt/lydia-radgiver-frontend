import React from "react";
import { Alert } from "@navikt/ds-react";
import { useSpørreundersøkelse } from "../../../components/Spørreundersøkelse/SpørreundersøkelseContext";
import styles from './opprettetBehovsvurderingAlert.module.scss';

export default function OpprettBehovsvurderingAlert({
	onClose,
}: {
	onClose: () => void;
}) {
	const { spørreundersøkelseType } = useSpørreundersøkelse();
	return (
		<Alert className={styles.alert} variant="success" closeButton onClose={onClose}>
			{`${spørreundersøkelseType} opprettet. Når ${spørreundersøkelseType.toLocaleLowerCase()}en startes vil den være åpen i 24 timer.`}
		</Alert>
	);
}