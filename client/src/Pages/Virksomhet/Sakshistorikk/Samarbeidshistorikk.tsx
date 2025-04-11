import { Heading } from "@navikt/ds-react";
import { Sakshistorikk } from "../../../domenetyper/sakshistorikk";
import { SamarbeidStatusBadge } from "../../../components/Badge/SamarbeidStatusBadge";
import { lokalDato } from "../../../util/dato";
import styled from "styled-components";
import React from "react";
import { defaultNavnHvisTomt } from "../../../domenetyper/iaSakProsess";
import { InternLenke } from "../../../components/InternLenke";


export default function Samarbeidshistorikk({
	historikk,
	orgnr,
}: { historikk: Sakshistorikk, orgnr: string }) {
	if (historikk.samarbeid.length === 0) {
		return null;
	}

	const sorterteSamarbeid = React.useMemo(() => historikk.samarbeid.sort((a, b) => {
		if (a.sistEndret && b.sistEndret) {
			return new Date(b.sistEndret).getTime() - new Date(a.sistEndret).getTime();
		}
		return 0;
	}), [historikk.samarbeid]);

	return (
		<>
			<Heading size="small" spacing level="3">
				Samarbeid
			</Heading>
			<Samarbeidgrid>
				{
					sorterteSamarbeid.map((samarbeid) => (
						<Samarbeidrad key={samarbeid.id}>
							<InternLenke underline={false} href={`/virksomhet/${orgnr}/sak/${samarbeid.saksnummer}/samarbeid/${samarbeid.id}`}>
								{defaultNavnHvisTomt(samarbeid.navn)}
							</InternLenke>
							<SamarbeidStatusBadge status={samarbeid.status} />
							{samarbeid.sistEndret ? <span>{lokalDato(samarbeid.sistEndret)}</span> : <div />}
						</Samarbeidrad>
					))
				}
			</Samarbeidgrid>
		</>
	);
}

const Samarbeidgrid = styled.div`
	display: grid;
	grid-template-columns: minmax(auto, 20rem) minmax(auto, 8rem) minmax(auto, 8rem);
	gap: 0.5rem;
	padding-bottom: 2rem;
`;

const Samarbeidrad = styled.div`
	display: contents;
`;