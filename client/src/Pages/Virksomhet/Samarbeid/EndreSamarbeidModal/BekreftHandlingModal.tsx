import { Alert, BodyLong, Button, Heading, List, Modal } from "@navikt/ds-react";
import { IaSakProsess } from "../../../../domenetyper/iaSakProsess";
import { KanIkkeFullføreBegrunnelse, KanIkkeSletteBegrunnelse } from "../../../../domenetyper/samarbeidsEndring";
import React from "react";
import styled from "styled-components";
import { EksternLenke } from "../../../../components/EksternLenke";
import { useHentSalesforceUrl } from "../../../../api/lydia-api/virksomhet";
import { useVirksomhetContext } from "../../VirksomhetContext";

export default function BekreftHandlingModal({
	open,
	onCancel,
	onConfirm,
	samarbeid,
	begrunnelser,
	type,
	erTillatt
}: {
	open: boolean,
	onCancel: () => void,
	onConfirm: () => void,
	samarbeid: IaSakProsess,
	begrunnelser: KanIkkeSletteBegrunnelse[] | KanIkkeFullføreBegrunnelse[],
	type: "slette" | "fullføre",
	erTillatt: boolean
}) {

	return (
		<Modal open={open} onClose={onCancel} aria-labelledby="bekreft-handling-modal-heading" closeOnBackdropClick>
			<BekreftHandlingHeader samarbeid={samarbeid} type={type} />
			<Modal.Body>
				<BekreftHandlingBrødtekst type={type} />
				<BegrunnelserForIkkeKunne begrunnelser={begrunnelser} type={type} />
				<SalesforcelenkeHvisNødvendig type={type} />
			</Modal.Body>
			<Handlingsknapper onCancel={onCancel} onConfirm={onConfirm} type={type} erTillatt={erTillatt} />
		</Modal>
	);
}

function BekreftHandlingHeader({ samarbeid, type }: { samarbeid: IaSakProsess, type: "slette" | "fullføre" }) {
	if (type === "slette") {
		return (
			<Modal.Header>
				<Heading size="medium" id="bekreft-handling-modal-heading">Slett <i>Avdeling</i> {samarbeid.navn}</Heading>
			</Modal.Header>
		);

	}
	return (
		<Modal.Header>
			<Heading size="medium" id="bekreft-handling-modal-heading">Fullfør <i>Avdeling</i> {samarbeid.navn}</Heading>
		</Modal.Header>
	);
}

function BekreftHandlingBrødtekst({ type }: { type: "slette" | "fullføre" }) {
	if (type === "slette") {
		return (
			<BodyLong spacing>
				Samarbeid med fullførte behovsvurderinger, evalueringer og aktive planer kan ikke slettes. Aktiviteter i Salesforce må slettes eller flyttes til at annet samarbeid.
			</BodyLong>
		);
	}

	return (
		<BodyLong spacing>
			Når du fullfører vil alle dokumenter bli journalført og det vil ikke være mulig å gjøre endringer på samarbeidet.
		</BodyLong>
	);
}

function BegrunnelserForIkkeKunne(
	{ begrunnelser, type }:
		{ begrunnelser: KanIkkeSletteBegrunnelse[] | KanIkkeFullføreBegrunnelse[], type: "slette" | "fullføre" }
) {
	const prettyBegrunnelser = usePrettyBegrunnelser(begrunnelser);

	if (begrunnelser.length === 0) {
		return null;
	}

	return (
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
	);
}

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

const SalesforceLenke = styled(EksternLenke)`
    font-size: 1.125rem;
`;

function SalesforcelenkeHvisNødvendig({ type }: { type: "slette" | "fullføre" }) {
	const { virksomhet } = useVirksomhetContext();
	const { data: salesforceInfo } = useHentSalesforceUrl(virksomhet.orgnr);

	if (type === "slette" && salesforceInfo?.url) {
		return (
			<SalesforceLenke href={salesforceInfo?.url}>
				Se virksomhet i Salesforce
			</SalesforceLenke>
		);
	}

	return null;
}

function Handlingsknapper({ onCancel, onConfirm, type, erTillatt }: { onCancel: () => void, onConfirm: () => void, type: "slette" | "fullføre", erTillatt: boolean }) {
	return (
		<Modal.Footer>
			<Button variant="primary" onClick={onConfirm} disabled={!erTillatt}>{type === "fullføre" ? "Fullfør" : "Slett"}</Button>
			<Button variant="secondary" onClick={onCancel}>Avbryt</Button>
		</Modal.Footer>
	);
}