import { Alert, Heading, List } from "@navikt/ds-react";
import { KanIkkeGjennomføreBegrunnelse, MuligSamarbeidsgandling } from "../../../../domenetyper/samarbeidsEndring";
import React from "react";
import styled from "styled-components";

const AlertWithMargin = styled(Alert)`
	margin-top: 1rem;
	margin-bottom: 1rem;
`;

export default function BegrunnelserForIkkeKunne(
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

export function usePrettyType(type: MuligSamarbeidsgandling) {
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
					return "Det en påbegynt behovsvurdering";
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
