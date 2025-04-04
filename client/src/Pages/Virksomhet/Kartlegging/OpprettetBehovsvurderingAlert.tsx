import React from "react";
import { Alert } from "@navikt/ds-react";
import styled from "styled-components";
import { useSpørreundersøkelse } from "../../../components/Spørreundersøkelse/SpørreundersøkelseContext";

const StyledAlert = styled(Alert)`
	margin-top: 1rem;
    margin-bottom: 1rem;
	margin-left: auto;
	margin-right: auto;
	width: fit-content;
`;

export default function OpprettBehovsvurderingAlert({
	onClose,
}: {
	onClose: () => void;
}) {
	const { spørreundersøkelseType } = useSpørreundersøkelse();
	return (
		<StyledAlert variant="success" closeButton onClose={onClose}>
			{`${spørreundersøkelseType} opprettet. Når ${spørreundersøkelseType.toLocaleLowerCase()}en startes vil den være åpen i 24 timer.`}
		</StyledAlert>
	);
}