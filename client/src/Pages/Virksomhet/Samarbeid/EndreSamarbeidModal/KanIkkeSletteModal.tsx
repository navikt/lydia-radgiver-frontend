import { Alert, BodyLong, Heading, List, Modal } from "@navikt/ds-react";
import { IaSakProsess } from "../../../../domenetyper/iaSakProsess";
import { EksternLenke } from "../../../../components/EksternLenke";
import React from "react";
import styled from "styled-components";
import { useHentSalesforceUrl } from "../../../../api/lydia-api/virksomhet";
import { useVirksomhetContext } from "../../VirksomhetContext";
import { KanIkkeFullføreBegrunnelse, KanIkkeSletteBegrunnelse } from "../../../../domenetyper/samarbeidsEndring";
import capitalizeFirstLetterLowercaseRest from "../../../../util/formatering/capitalizeFirstLetterLowercaseRest";

export default function KanIkkeSletteModal({
	åpen,
	lukkModal,
	samarbeid,
	begrunnelser,
	type,
}: {
	åpen: boolean;
	lukkModal: () => void;
	samarbeid: IaSakProsess;
	begrunnelser: KanIkkeSletteBegrunnelse[] | KanIkkeFullføreBegrunnelse[];
	type: "slette" | "fullføre";
}) {
	const prettyBegrunnelser = usePrettyBegrunnelser(begrunnelser);
	const { virksomhet } = useVirksomhetContext();
	const { data: salesforceInfo } = useHentSalesforceUrl(virksomhet.orgnr);

	return (
		<Modal open={åpen} onClose={lukkModal} aria-labelledby="kan-ikke-slette-modal-heading" closeOnBackdropClick>
			<Modal.Header>
				<Heading size="medium" id="kan-ikke-slette-modal-heading">{capitalizeFirstLetterLowercaseRest(type)} <i>Avdeling</i> {samarbeid.navn}</Heading>
			</Modal.Header>
			<Modal.Body>
				{
					type === "slette" ? (
						<BodyLong spacing>
							Samarbeid med fullførte behovsvurderinger, evalueringer og aktive planer kan ikke slettes. Aktiviteter i Salesforce må slettes eller flyttes til at annet samarbeid.
						</BodyLong>
					) : (
						<BodyLong spacing>
							TODO: BESKRIVELSE AV HVORFOR SAMARBEID IKKE KAN FULLFØRES
						</BodyLong>
					)
				}
				<Alert variant="warning">
					<Heading spacing size="small" level="3">
						Samarbeidet kan ikke {type}s:
					</Heading>
					<List>
						{
							prettyBegrunnelser.map((begrunnelse) => (
								<List.Item key={begrunnelse}>{begrunnelse}</List.Item>
							))
						}
					</List>
				</Alert>
				{salesforceInfo && (
					<SalesforceLenke href={salesforceInfo?.url}>
						Se virksomhet i Salesforce
					</SalesforceLenke>
				)}
			</Modal.Body>
		</Modal>
	);
}

const SalesforceLenke = styled(EksternLenke)`
    font-size: 1.125rem;
	margin-top: 3rem;
`;

function usePrettyBegrunnelser(begrunnelser: KanIkkeSletteBegrunnelse[] | KanIkkeFullføreBegrunnelse[]): string[] {
	return React.useMemo(() => begrunnelser.map((begrunnelse) => {
		switch (begrunnelse) {
			case "FINNES_SALESFORCE_AKTIVITET":
				return "Aktiviteter i Salesforce";
			case "FINNES_BEHOVSVURDERING":
				return "Fullført behovsvurdering";
			case "FINNES_SAMARBEIDSPLAN":
				return "Aktiv samarbeidsplan";
			case "FINNES_EVALUERING":
				return "Påbegynt evaluering";
			case "AKTIV_BEHOVSVURDERING":
				return "Det finnes en påbegynt behovsvurdering";
			case "SAK_I_FEIL_STATUS":
				return "Saken må være i status Vi bistår";
			case "AKTIV_EVALUERING":
				return "Det finnes en påbegynt evaluering";
			case "INGEN_EVALUERING":
				return "Det er ikke gjennomført evaluering, vil du fortsatt fullføre?";
			case "INGEN_PLAN":
				return "Mangler samarbeidsplan";
			default:
				return begrunnelse;
		}
	}), [begrunnelser]);
}