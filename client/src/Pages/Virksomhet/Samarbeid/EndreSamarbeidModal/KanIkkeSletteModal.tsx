import { Alert, BodyLong, Heading, List, Modal } from "@navikt/ds-react";
import { IaSakProsess } from "../../../../domenetyper/iaSakProsess";
import { EksternLenke } from "../../../../components/EksternLenke";
import React from "react";
import styled from "styled-components";
import { useHentSalesforceUrl } from "../../../../api/lydia-api/virksomhet";
import { useVirksomhetContext } from "../../VirksomhetContext";

export default function KanIkkeSletteModal({
	åpen,
	lukkModal,
	samarbeid,
	begrunnelser,
}: {
	åpen: boolean;
	lukkModal: () => void;
	samarbeid: IaSakProsess;
	begrunnelser: string[];
}) {
	const prettyBegrunnelser = usePrettyBegrunnelser(begrunnelser);
	const { virksomhet } = useVirksomhetContext();
	const { data: salesforceInfo } = useHentSalesforceUrl(virksomhet.orgnr);

	return (
		<Modal open={åpen} onClose={lukkModal} aria-labelledby="kan-ikke-slette-modal-heading" closeOnBackdropClick>
			<Modal.Header>
				<Heading size="medium" id="kan-ikke-slette-modal-heading">Slett <i>Avdeling</i> {samarbeid.navn}</Heading>
			</Modal.Header>
			<Modal.Body>
				<BodyLong spacing>
					Samarbeid med fullførte behovsvurderinger, evalueringer og aktive planer kan ikke slettes. Aktiviteter i Salesforce må slettes eller flyttes til at annet samarbeid.
				</BodyLong>
				<Alert variant="warning">
					<Heading spacing size="small" level="3">
						Samarbeidet kan ikke slettes:
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

function usePrettyBegrunnelser(begrunnelser: string[]): string[] {
	return React.useMemo(() => begrunnelser.map((begrunnelse) => {
		switch (begrunnelse) {
			case "SALESFORCE_ACTIVITET":
				return "Aktiviteter i Salesforce";
			case "FULLFØRT_BEHOVSVURDERING":
				return "Fullført behovsvurdering";
			case "AKTIV_SAMARBEIDSPLAN":
				return "Aktiv samarbeidsplan";
			case "PÅBEGYNT_EVALUERING":
				return "Påbegynt evaluering";
			default:
				return begrunnelse;
		}
	}), [begrunnelser]);
}