import { Alert, BodyLong, Button, Heading, List, Modal } from "@navikt/ds-react";
import { IaSakProsess } from "../../../../domenetyper/iaSakProsess";
import { KanIkkeGjennomføreBegrunnelse, MuligSamarbeidsgandling } from "../../../../domenetyper/samarbeidsEndring";
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
	advarsler,
	blokkerende,
	type,
	erTillatt
}: {
	open: boolean,
	onCancel: () => void,
	onConfirm: () => void,
	samarbeid: IaSakProsess,
	advarsler?: KanIkkeGjennomføreBegrunnelse[],
	blokkerende?: KanIkkeGjennomføreBegrunnelse[],
	type: MuligSamarbeidsgandling | null,
	erTillatt?: boolean
}) {
	if (!type) {
		return null;
	}

	return (
		<Modal open={open} onClose={onCancel} aria-labelledby="bekreft-handling-modal-heading" closeOnBackdropClick>
			<BekreftHandlingHeader samarbeid={samarbeid} type={type} />
			<Modal.Body>
				<BekreftHandlingBrødtekst type={type} />
				<BegrunnelserForIkkeKunne begrunnelser={blokkerende} type={type} blokkerende />
				<BegrunnelserForIkkeKunne begrunnelser={advarsler} type={type} />
				<SalesforcelenkeHvisNødvendig type={type} />
			</Modal.Body>
			<Handlingsknapper onCancel={onCancel} onConfirm={onConfirm} type={type} erTillatt={erTillatt} />
		</Modal>
	);
}

function BekreftHandlingHeader({ samarbeid, type }: { samarbeid: IaSakProsess, type: MuligSamarbeidsgandling }) {
	const prettyType = usePrettyType(type);

	return (
		<Modal.Header>
			<Heading size="medium" id="bekreft-handling-modal-heading">{prettyType.capitalized} <i>{samarbeid.navn}</i></Heading>
		</Modal.Header>
	);
}

function BekreftHandlingBrødtekst({ type }: { type: MuligSamarbeidsgandling }) {
	return (
		<BodyLong spacing>
			{
				type === "slettes"
					? "Samarbeid med fullførte behovsvurderinger, evalueringer og aktive planer kan ikke slettes. Aktiviteter i Salesforce må slettes eller flyttes til at annet samarbeid."
					: "Når du fullfører vil alle dokumenter bli arkivert og det vil ikke være mulig å gjøre endringer på samarbeidet."
			}
		</BodyLong>
	);
}

const AlertWithMargin = styled(Alert)`
	margin-top: 1rem;
	margin-bottom: 1rem;
`;

function BegrunnelserForIkkeKunne(
	{ begrunnelser, type, blokkerende = false }:
		{ begrunnelser?: KanIkkeGjennomføreBegrunnelse[], type: MuligSamarbeidsgandling, blokkerende?: boolean }
) {
	const prettyBegrunnelser = usePrettyBegrunnelser(begrunnelser);
	const prettyType = usePrettyType(type);

	if (prettyBegrunnelser === null) {
		return null;
	}

	return (
		<AlertWithMargin variant={blokkerende ? "error" : "warning"}>
			<Heading spacing size="small" level="3">
				{blokkerende ? `Samarbeidet kan ikke ${prettyType.uncapitalized}es:` : `Er du sikker på at du ønsker å ${prettyType.uncapitalized}e?`}
			</Heading>
			<List>
				{
					prettyBegrunnelser.map((begrunnelse) => (
						<List.Item key={begrunnelse}>{begrunnelse}</List.Item>
					))
				}
			</List>
		</AlertWithMargin>
	);
}

function usePrettyType(type: MuligSamarbeidsgandling) {
	return React.useMemo(() => {
		switch (type) {
			case "fullfores":
				return {
					capitalized: "Fullfør",
					uncapitalized: "fullfør"
				}
			case "slettes":
				return {
					capitalized: "Slett",
					uncapitalized: "slett"
				};
			case "avbrytes":
				return {
					capitalized: "Avbryt",
					uncapitalized: "avbryt"
				};
		}
	}, [type]);
}

function usePrettyBegrunnelser(begrunnelser?: KanIkkeGjennomføreBegrunnelse[]): string[] | null {
	return React.useMemo(() => {
		if (!begrunnelser || begrunnelser.length === 0) {
			return null;
		}

		return begrunnelser.map((begrunnelse) => {
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
		})
	}, [begrunnelser]);
}

const SalesforceLenke = styled(EksternLenke)`
	font-size: 1.125rem;
	margin-top: 1rem;
`;

function SalesforcelenkeHvisNødvendig({ type }: { type: MuligSamarbeidsgandling }) {
	const { virksomhet } = useVirksomhetContext();
	const { data: salesforceInfo } = useHentSalesforceUrl(virksomhet.orgnr);

	if (type === "slettes" && salesforceInfo?.url) {
		return (
			<SalesforceLenke href={salesforceInfo?.url}>
				Se virksomhet i Salesforce
			</SalesforceLenke>
		);
	}

	return null;
}

function Handlingsknapper({ onCancel, onConfirm, type, erTillatt }: { onCancel: () => void, onConfirm: () => void, type: MuligSamarbeidsgandling, erTillatt?: boolean }) {
	const prettyType = usePrettyType(type);

	return (
		<Modal.Footer>
			<Button variant="primary" onClick={onConfirm} disabled={!erTillatt}>{prettyType.capitalized}</Button>
			<Button variant="secondary" onClick={onCancel}>Avbryt</Button>
		</Modal.Footer>
	);
}