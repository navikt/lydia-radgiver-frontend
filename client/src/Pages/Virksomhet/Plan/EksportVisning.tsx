import { usePDF } from "react-to-pdf";
import { Plan, PlanTema } from "../../../domenetyper/plan";
import { BodyShort, Button, Heading, HStack } from "@navikt/ds-react";
import { FilePdfIcon } from "@navikt/aksel-icons";
import React from "react";
import styled from "styled-components";
import PlanGraf from "./PlanGraf";
import { PrettyUndertemaDate } from "./UndertemaConfig";

export default function EksportVisning({ plan }: { plan: Plan }) {
	/* 	toPDF har returntypen void, men i den faktiske koden har den returntypen Promise<void>
		Må caste til Promise<void> for å sette loadingindikator */
	const { toPDF, targetRef } = usePDF() as { toPDF: () => Promise<void>, targetRef: React.MutableRefObject<HTMLDivElement> };
	const [lagrer, setLagrer] = React.useState(false);

	return (
		<>
			<div style={{ display: "flex", justifyContent: "flex-end", marginBottom: "1rem" }}>
				<Button
					loading={lagrer}
					icon={<FilePdfIcon fontSize="1.5rem" />}
					variant="secondary"
					size='small'
					onClick={(e) => {
						e.stopPropagation();
						setLagrer(true);
						targetRef.current.style.display = "block";
						toPDF().then(() => {
							setLagrer(false);
						});
						targetRef.current.style.display = "none";
					}}>
					Eksporter
				</Button>
			</div>
			<div ref={targetRef} style={{ display: "none", width: 1280, backgroundColor: "white", padding: "2rem" }}>
				<EksportInnhold plan={plan} />
			</div>
		</>
	);
}
const Container = styled.div`
    height: 100%;
    display: flex;
    flex-direction: column;
    gap: 3rem;
    margin-bottom: 2rem;
	border-bottom: 2px solid #c6c2bf;
	padding-bottom: 2rem;
`;

function EksportInnhold({ plan }: { plan: Plan }) {
	return plan.temaer
		.filter((tema) => tema.planlagt)
		.sort((a, b) => {
			return a.id - b.id;
		})
		.map((tema, index) => {
			return (
				<Container key={index}>
					<Heading level="3" size="medium" spacing={true}>
						{tema.navn}
					</Heading>
					<PlanGraf undertemaer={tema.undertemaer} />
					<UndertemaInnhold tema={tema} />
				</Container>
			);
		});
}

function UndertemaInnhold({ tema }: { tema: PlanTema }) {
	return (
		<div>
			{tema.undertemaer
				.filter((undertema) => undertema.planlagt)
				.sort((a, b) => {
					return a.id - b.id;
				})
				.map((undertema) => (
					<div key={undertema.id} style={{ paddingLeft: "8rem", paddingRight: "8rem" }}>
						<HStack align="baseline">
							<Heading level="4" size="small" spacing>
								{undertema.navn}:
							</Heading>
							<BodyShort style={{ marginLeft: "2rem" }}>{undertema.status?.charAt(0)?.toLocaleUpperCase()}{undertema.status?.substring(1)?.toLocaleLowerCase()}</BodyShort>
							<BodyShort style={{ marginLeft: "2rem" }}>
								{undertema.startDato && <PrettyUndertemaDate date={undertema.startDato} />} -{" "}
								{undertema.sluttDato && <PrettyUndertemaDate date={undertema.sluttDato} />}
							</BodyShort>
						</HStack>
						<BodyShort spacing>Mål: {undertema.målsetning}</BodyShort>
						<BodyShort>{undertema.beskrivelse}</BodyShort>
					</div>
				))}
		</div>
	);
}