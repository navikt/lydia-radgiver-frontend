import styled from "styled-components";
import { tabInnholdStyling } from "../../../styling/containere";
import { BodyShort, Heading } from "@navikt/ds-react";
import PlanGraf from "./PlanGraf";

const Container = styled.div`
  height: 100%;
  display: flex;
  flex-direction: column;
  gap: 3rem;

  ${tabInnholdStyling};
`;

export default function PlanFane() {
	return (
		<Container>
			<Heading level="3" size="large" spacing={true}>Plan</Heading>
			<BodyShort>
				Her skal det stå noe greier om planen.
			</BodyShort>
			<PlanGraf periodStart={new Date(2024, 0)} periodeSlutt={new Date(2025, 0)} pølser={[
				{
					pølseStart: new Date(2024, 0),
					pølseSlutt: new Date(2024, 3),
					tittel: 'Sykefraværsrutiner',
				},
				{
					pølseStart: new Date(2024, 2),
					pølseSlutt: new Date(2024, 5),
					tittel: 'Oppfølgingssamtaler',
				},
				{
					pølseStart: new Date(2024, 7),
					pølseSlutt: new Date(2024, 10),
					tittel: 'Tilretteleggings- og medvirkningsplikt',
				},
				{
					pølseStart: new Date(2024, 7),
					pølseSlutt: new Date(2024, 9),
					tittel: 'Gjentagende sykefravær',
				},
				{
					pølseStart: new Date(2024, 9),
					pølseSlutt: new Date(2024, 11),
					tittel: 'Enda en greie',
				},
			]} />
		</Container>
	);
}