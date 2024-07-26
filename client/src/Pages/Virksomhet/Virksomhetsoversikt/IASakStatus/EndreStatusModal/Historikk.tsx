import styled from "styled-components";
import { useHentSamarbeidshistorikk } from "../../../../../api/lydia-api";
import { IASak } from "../../../../../domenetyper/domenetyper";
import { Sakshendelse } from "../../../../../domenetyper/sakshistorikk";
import { StatusBadge } from "../../../../../components/Badge/StatusBadge";
import { Loader } from "@navikt/ds-react";
import React from "react";

export default function Historikk({ sak }: { sak: IASak }) {
	const { data: samarbeidshistorikk, loading: lasterSamarbeidshistorikk } = useHentSamarbeidshistorikk(sak.orgnr);
	const sakshendelser = samarbeidshistorikk?.find((historikk) => historikk.saksnummer === sak.saksnummer)?.sakshendelser;

	if (lasterSamarbeidshistorikk || !sakshendelser) {
		return <Loader title="Laster samarbeidshistorikk" />;
	}

	return (
		<Sakshendelser sakshendelser={sakshendelser} />
	);
}

const SakshendelseContainer = styled.div`
	display: grid;
	grid-template-columns: 1fr max-content;
	gap: 1rem;
`;

function Sakshendelser({ sakshendelser }: { sakshendelser: Sakshendelse[] }) {
	return (
		<SakshendelseContainer>
			{sakshendelser.map((sakshendelse, index) => (
				<React.Fragment key={index}>
					<StatusBadge status={sakshendelse.status} />
					<Sakshendelsedatoer sakshendelse={sakshendelse} nesteSakshendelse={sakshendelser[index + 1]} />
				</React.Fragment>
			))}
		</SakshendelseContainer>
	);
}

function Sakshendelsedatoer({ sakshendelse, nesteSakshendelse }: { sakshendelse: Sakshendelse, nesteSakshendelse?: Sakshendelse }) {
	return (
		<div>{sakshendelse.tidspunktForSnapshot.toLocaleString('default', { month: 'numeric', day: 'numeric', year: 'numeric' })} - {nesteSakshendelse?.tidspunktForSnapshot.toLocaleString('default', { month: 'numeric', day: 'numeric', year: 'numeric' })}</div>
	);
}