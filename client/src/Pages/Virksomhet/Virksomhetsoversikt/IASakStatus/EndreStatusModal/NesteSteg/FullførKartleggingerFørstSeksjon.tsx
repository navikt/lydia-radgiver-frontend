import { Modal, Heading, BodyLong, List, Button } from "@navikt/ds-react";
import { Knappecontainer } from ".";
import { IASak } from "../../../../../../domenetyper/domenetyper";
import { IaSakProsess } from "../../../../../../domenetyper/iaSakProsess";
import { loggSendBrukerTilKartleggingerTab } from "../../../../../../util/amplitude-klient";
import { useHentSpørreundersøkelser } from "../../../../../../api/lydia-api/spørreundersøkelse";
import { SpørreundersøkelseType } from "../../../../../../domenetyper/spørreundersøkelseMedInnhold";
import { LenkeTilBehovsvurderingFane, LenkeTilEvalueringsFane } from "./LenkeTilFanePåSamarbeid";


export function FullførKartleggingerFørstSeksjon({
	lukkModal, sak, alleSamarbeid,
}: {
	lukkModal: () => void;
	clearNesteSteg: () => void;
	sak: IASak;
	alleSamarbeid: IaSakProsess[] | undefined;
}) {
	const { data: alleSamarbeidMedIkkeFullførteBehovsvurderinger } = useHentAlleSpørreundersøkelserAvType(sak, alleSamarbeid?.map(s => s.id) || [], "Behovsvurdering");
	const { data: alleSamarbeidMedIkkeFullførteEvalueringer } = useHentAlleSpørreundersøkelserAvType(sak, alleSamarbeid?.map(s => s.id) || [], "Evaluering");

	return (
		<Modal.Body>
			<FullførFørstHeader
				alleSamarbeidMedIkkeFullførteBehovsvurderinger={alleSamarbeidMedIkkeFullførteBehovsvurderinger}
				alleSamarbeidMedIkkeFullførteEvalueringer={alleSamarbeidMedIkkeFullførteEvalueringer} />
			<br />
			<BodyLong>
				For å gå videre må du fullføre eller slette kartleggingene som er påbegynt.
			</BodyLong>
			<br />
			{alleSamarbeidMedIkkeFullførteBehovsvurderinger.length > 0 &&
				<>
					<Heading level="3" size="xsmall">
						Samarbeid med påbegynt behovsvurdering:
					</Heading>
					<List as="ul" size="small">
						{alleSamarbeidMedIkkeFullførteBehovsvurderinger.map((samarbeidId) => {
							return (
								<List.Item key={samarbeidId}>
									<LenkeTilBehovsvurderingFane samarbeidId={samarbeidId} alleSamarbeid={alleSamarbeid} onClick={() => {
										loggSendBrukerTilKartleggingerTab(
											"fullfør kartlegginger",
											"behovsvurdering"
										);
										lukkModal();
									}} />
								</List.Item>
							);
						})}
					</List>
				</>
			}
			{alleSamarbeidMedIkkeFullførteEvalueringer.length > 0 &&
				<>
					<Heading level="3" size="xsmall">
						Samarbeid med påbegynt evaluering:
					</Heading>
					<List as="ul" size="small">
						{alleSamarbeidMedIkkeFullførteEvalueringer.map((samarbeidId) => {
							return (
								<List.Item key={samarbeidId}>
									<LenkeTilEvalueringsFane samarbeidId={samarbeidId} alleSamarbeid={alleSamarbeid} onClick={() => {
										loggSendBrukerTilKartleggingerTab(
											"fullfør kartlegginger",
											"evaluering"
										);
										lukkModal();
									}} />
								</List.Item>
							);
						})}
					</List>
				</>
			}
			<br />
			<Knappecontainer>
				<Button variant="secondary" onClick={lukkModal}>
					Avbryt
				</Button>
			</Knappecontainer>
		</Modal.Body>
	);
}

function FullførFørstHeader(
	{ alleSamarbeidMedIkkeFullførteEvalueringer, alleSamarbeidMedIkkeFullførteBehovsvurderinger }:
		{ alleSamarbeidMedIkkeFullførteEvalueringer?: number[], alleSamarbeidMedIkkeFullførteBehovsvurderinger?: number[] }
) {
	if (
		alleSamarbeidMedIkkeFullførteBehovsvurderinger && alleSamarbeidMedIkkeFullførteEvalueringer &&
		alleSamarbeidMedIkkeFullførteBehovsvurderinger.length > 0 && alleSamarbeidMedIkkeFullførteEvalueringer.length > 0) {
		return (
			<Heading level="2" size="medium">
				Virksomheten har behovsvurdering{alleSamarbeidMedIkkeFullførteBehovsvurderinger.length > 1 ? "er" : ""} og evaluering{alleSamarbeidMedIkkeFullførteEvalueringer.length > 1 ? "er" : ""} som ikke er fullført
			</Heading>
		);
	} else if (alleSamarbeidMedIkkeFullførteEvalueringer && alleSamarbeidMedIkkeFullførteEvalueringer.length > 0) {
		return (
			<Heading level="2" size="medium">
				Virksomheten har evaluering{alleSamarbeidMedIkkeFullførteEvalueringer.length > 1 ? "er" : ""} som ikke er fullført
			</Heading>
		);
	} else {
		return (
			<Heading level="2" size="medium">
				Virksomheten har behovsvurdering{alleSamarbeidMedIkkeFullførteBehovsvurderinger && alleSamarbeidMedIkkeFullførteBehovsvurderinger.length > 1 ? "er" : ""} som ikke er fullført
			</Heading>
		);
	}
}

//TODO: Bytt ut med et endepunkt som henter alle behovsvurderinger for en sak
function useHentAlleSpørreundersøkelserAvType(iaSak: IASak, samarbeidsIder: number[], type: SpørreundersøkelseType) {
	const vurderingerResultater = samarbeidsIder.map((id) => {
		return useHentSpørreundersøkelser(
			iaSak.orgnr,
			iaSak.saksnummer,
			id,
			type
		);
	});

	return {
		data: vurderingerResultater
			.map((v) => v.data)
			.flat()
			.filter((v) => v?.status === "OPPRETTET" || v?.status === "PÅBEGYNT")
			.map((v) => v?.samarbeidId)
			.filter((v) => v !== undefined)
			.filter((v, i, a) => a.indexOf(v) === i),
		loading: vurderingerResultater.some((v) => v.loading),
		error: vurderingerResultater.some((v) => v.error),
	};
}

