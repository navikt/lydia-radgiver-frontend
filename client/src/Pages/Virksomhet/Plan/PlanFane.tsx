import styled from "styled-components";
import { tabInnholdStyling } from "../../../styling/containere";
import {Button, Heading, HStack, TimelinePeriodProps} from "@navikt/ds-react";
import PlanGraf from "./PlanGraf";
import React from "react";
import UndertemaConfig, { Temainnhold } from "./UndertemaConfig";
import LeggTilTemaKnapp from "./LeggTilTemaKnapp";
import VerktøyConfig from "./VerktøyConfig";
import EditTemaKnapp from "./EditTemaKnapp";
import {
	nyPlanPåSak, useHentIaProsesser, useHentPlan,
} from "../../../api/lydia-api";
import {IASak} from "../../../domenetyper/domenetyper";

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
			status: "FULLFØRT",
			statusfarge: "success"
		},
		{
			start: new Date(2024, 2),
			slutt: new Date(2024, 5),
			tittel: 'Oppfølgingssamtaler',
			status: "FULLFØRT",
			statusfarge: "warning"
		},
		{
			start: new Date(2024, 5),
			slutt: new Date(2024, 8),
			tittel: 'Tilretteleggings- og medvirkningsplikt',
			status: "PÅGÅR",
			statusfarge: "danger"
		},
		{
			start: new Date(2024, 7),
			slutt: new Date(2024, 9),
			tittel: 'Gjentagende sykefravær',
			status: "PLANLAGT",
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

interface Props {
	iaSak: IASak;
}

export default function PlanFane({iaSak}: Props) {
	const [temaer, setTemaer] = React.useState([dummyData]);

	const {
		data: iaSakPlan,
		loading: lasterPlan,
		mutate: muterPlan,
	} = useHentPlan(iaSak.orgnr, iaSak.saksnummer);

	const {mutate: muterProsesser} = useHentIaProsesser(
		iaSak.orgnr,
		iaSak.saksnummer,
	);

	// TODO: Hent plan
	//  Hvis plan ikke finnes, vis opprett plan knapp
	//  Når kanpp trykkes på muterPlaner

	const opprettPlan = () => {
		nyPlanPåSak(iaSak.orgnr, iaSak.saksnummer).then((response) => {
			console.log(response)
			muterPlan();
			muterProsesser();
		})
	};

	if(iaSakPlan === undefined || lasterPlan){
		return(
			<Button
			size="small"
			iconPosition="right"
			variant="secondary"
			onClick={opprettPlan}
		>
			Opprett plan
		</Button>
		)
	}

	return (
		<>
			<div>TEST: {iaSakPlan.id}</div>
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