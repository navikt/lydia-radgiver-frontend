import styled from "styled-components";
import { tabInnholdStyling } from "../../../styling/containere";
import { Heading, HStack, TimelinePeriodProps } from "@navikt/ds-react";
import PlanGraf from "./PlanGraf";
import React from "react";
import UndertemaConfig, { Temainnhold } from "./UndertemaConfig";
import LeggTilTemaKnapp from "./LeggTilTemaKnapp";
import VerktøyConfig from "./VerktøyConfig";
import EditTemaKnapp from "./EditTemaKnapp";

const Container = styled.div`
  height: 100%;
  display: flex;
  flex-direction: column;
  gap: 3rem;
  margin-bottom: 2rem;

  ${tabInnholdStyling};
`;

export type TilgjengeligTema = {
	tittel: string;
	undertema: TilgjengeligUndertema[];
};

export type TilgjengeligUndertema = {
	tittel: string;
	statusfarge: TimelinePeriodProps["status"];
};

export const tilgjengeligeTemaer: TilgjengeligTema[] = [
	{
		tittel: "Sykefraværsarbeid",
		undertema: [
			{
				tittel: "Sykefraværsrutiner",
				statusfarge: "success",
			},
			{
				tittel: "Oppfølgingssamtaler",
				statusfarge: "warning",
			},
			{
				tittel: "Tilretteleggings- og medvirkningsplikt",
				statusfarge: "danger",
			},
			{
				tittel: "Gjentagende sykefravær",
				statusfarge: "info",
			},
		]
	},
	{
		tittel: "Partssamarbeid",
		undertema: [
			{
				tittel: "Utvikle partssamarbeidet",
				statusfarge: "success",
			},
			{
				tittel: "Arbeidsmiljøloven",
				statusfarge: "warning",
			},
			{
				tittel: "Medbestemmelse",
				statusfarge: "danger",
			},
			{
				tittel: "Medvirkning",
				statusfarge: "info",
			},
		]
	},
	{
		tittel: "Arbeidsmiljø",
		undertema: [
			{
				tittel: "Arbeidsmiljøloven",
				statusfarge: "success",
			},
			{
				tittel: "Medbestemmelse",
				statusfarge: "warning",
			},
			{
				tittel: "Medvirkning",
				statusfarge: "danger",
			},
		]
	}
];

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
	],
	verktøy: [
		{
			tittel: "NRK",
			lenke: "https://www.nrk.no"
		},
		{
			tittel: "Avisa Oslo",
			lenke: "https://www.ao.no"
		},
	],
}

export default function PlanFane() {
	const [temaer, setTemaer] = React.useState([dummyData]);

	return (
		<>
			<Temaer temaer={temaer} setTemaer={setTemaer} />
			<LeggTilTemaKnapp temaer={temaer} setTemaer={setTemaer} tilgjengeligeTemaer={tilgjengeligeTemaer} />
		</>
	);
}

function Temaer({ temaer, setTemaer }: { temaer: Temainnhold[], setTemaer: (t: Temainnhold[]) => void }) {
	return temaer.map((tema, index) => {
		const setTema = (tema: Temainnhold) => {
			const nyeTema = [...temaer];
			nyeTema[index] = tema;

			return setTemaer(nyeTema);
		};

		return (
			<Container key={index}>
				<HStack justify="space-between">
					<Heading level="3" size="medium" spacing={true}>{tema.tittel}</Heading>
					<EditTemaKnapp tema={tema} setTema={setTema} tilgjengeligeTemaer={tilgjengeligeTemaer} />
				</HStack>
				<PlanGraf pølser={tema.undertema} />
				<UndertemaConfig tema={tema} setTema={setTema} />
				<VerktøyConfig verktøy={tema.verktøy} setVerktøy={(verktøy) => setTema({ ...tema, verktøy })} />
			</Container>
		)
	});
}