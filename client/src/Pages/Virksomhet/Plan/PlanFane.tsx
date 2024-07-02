import styled from "styled-components";
import { tabInnholdStyling } from "../../../styling/containere";
import { Heading } from "@navikt/ds-react";
import PlanGraf from "./PlanGraf";
import React from "react";
import TemaConfig, { Temainnhold } from "./TemaConfig";

const Container = styled.div`
  height: 100%;
  display: flex;
  flex-direction: column;
  gap: 3rem;

  ${tabInnholdStyling};
`;

const dummyData: Temainnhold = {
	tittel: "Sykefraværsarbeid",
	undertema: [
		{
			start: new Date(2024, 0),
			slutt: new Date(2024, 3),
			tittel: 'Sykefraværsrutiner',
			status: "Fullført"
		},
		{
			start: new Date(2024, 2),
			slutt: new Date(2024, 5),
			tittel: 'Oppfølgingssamtaler',
			status: "Pågår"
		},
		{
			start: new Date(2024, 7),
			slutt: new Date(2024, 10),
			tittel: 'Tilretteleggings- og medvirkningsplikt',
			status: "Pågår"
		},
		{
			start: new Date(2024, 7),
			slutt: new Date(2024, 9),
			tittel: 'Gjentagende sykefravær',
			status: "Pågår"
		},
		{
			start: new Date(2024, 9),
			slutt: new Date(2025, 0),
			tittel: 'Enda en greie',
			status: "Planlagt"
		},
	],
	verktøy: [],
}

export default function PlanFane() {
	const [tema, setTema] = React.useState(dummyData);
	return (
		<Container>
			<Heading level="3" size="medium" spacing={true}>{tema.tittel}</Heading>
			<PlanGraf start={new Date(2024, 0)} slutt={new Date(2025, 0)} pølser={tema.undertema} />
			<TemaConfig tema={tema} setTema={setTema} />
		</Container>
	);
}