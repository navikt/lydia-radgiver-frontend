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
			status: "Fullført",
			statusfarge: "success"
		},
		{
			start: new Date(2024, 2),
			slutt: new Date(2024, 5),
			tittel: 'Oppfølgingssamtaler',
			status: "Pågår",
			statusfarge: "warning"
		},
		{
			start: new Date(2024, 7),
			slutt: new Date(2024, 10),
			tittel: 'Tilretteleggings- og medvirkningsplikt',
			status: "Pågår",
			statusfarge: "danger"
		},
		{
			start: new Date(2024, 7),
			slutt: new Date(2024, 9),
			tittel: 'Gjentagende sykefravær',
			status: "Pågår",
			statusfarge: "info"
		},
		{
			start: new Date(2024, 9),
			slutt: new Date(2025, 0),
			tittel: 'Enda en greie',
			status: "Planlagt",
			statusfarge: "neutral"
		},
	],
	verktøy: [],
}

export default function PlanFane() {
	const [tema, setTema] = React.useState(dummyData);
	return (
		<Container>
			<Heading level="3" size="medium" spacing={true}>{tema.tittel}</Heading>
			<PlanGraf pølser={tema.undertema} />
			<TemaConfig tema={tema} setTema={setTema} />
		</Container>
	);
}