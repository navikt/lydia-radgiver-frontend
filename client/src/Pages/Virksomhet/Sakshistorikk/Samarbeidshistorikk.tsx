import { BodyShort, Heading } from "@navikt/ds-react";
import { Sakshistorikk } from "../../../domenetyper/sakshistorikk";
import { SamarbeidStatusBadge } from "../../../components/Badge/SamarbeidStatusBadge";
import { lokalDato } from "../../../util/dato";
import styled from "styled-components";
import React from "react";
import { InternLenke } from "../../../components/InternLenke";
import { IASamarbeidStatusEnum } from "../../../domenetyper/iaSakProsess";

const KOMPAKT_MAKS_ANTALL_RADER = 5;

export default function Samarbeidshistorikk({
	historikk,
	orgnr,
	visHeading = true,
	kompakt = false,
	lenke = true,
}: { historikk: Sakshistorikk, orgnr: string, visHeading?: boolean, kompakt?: boolean, lenke?: boolean }) {
	if (historikk.samarbeid.length === 0) {
		return null;
	}

	const { sorterteSamarbeid, antallSkjulteRader } = React.useMemo(() => {
		const samarbeid = historikk.samarbeid.sort((a, b) => {
			if (a.sistEndret && b.sistEndret) {
				return new Date(b.sistEndret).getTime() - new Date(a.sistEndret).getTime();
			}
			return 0;
		});

		const skalForkorte = kompakt && samarbeid.length > KOMPAKT_MAKS_ANTALL_RADER;

		return {
			sorterteSamarbeid: skalForkorte ? samarbeid.slice(0, KOMPAKT_MAKS_ANTALL_RADER - 1) : samarbeid,
			antallSkjulteRader: skalForkorte ? Math.max(0, samarbeid.length - (KOMPAKT_MAKS_ANTALL_RADER - 1)) : 0,
		};
	}, [historikk.samarbeid]);

	return (
		<>
			{visHeading && (
				<Heading size="small" spacing level="3">
					Samarbeid
				</Heading>
			)}
			<Samarbeidgrid $kompakt={kompakt}>
				{
					sorterteSamarbeid.map((samarbeid) => (
						<Samarbeidrad key={samarbeid.id}>
							{
								lenke ? (
									<InternLenkeMedEllipse underline={false} href={`/virksomhet/${orgnr}/sak/${samarbeid.saksnummer}/samarbeid/${samarbeid.id}`}>
										{samarbeid.navn}
									</InternLenkeMedEllipse>
								) : (
									<BodyShortMedEllipse>{samarbeid.navn}</BodyShortMedEllipse>
								)
							}
							<SamarbeidStatusBadge status={samarbeid.status} />
							{
								(samarbeid.status === IASamarbeidStatusEnum.enum.FULLFØRT || samarbeid.status === IASamarbeidStatusEnum.enum.AVBRUTT)
									&& samarbeid.sistEndret
									? <span>{lokalDato(samarbeid.sistEndret)}</span>
									: <div />
							}
						</Samarbeidrad>
					))
				}
				<SkjulteRader antallSkjulteRader={antallSkjulteRader} />
			</Samarbeidgrid>
		</>
	);
}

function SkjulteRader({ antallSkjulteRader }: { antallSkjulteRader: number }) {
	if (antallSkjulteRader === 0) {
		return null;
	}

	if (antallSkjulteRader === 1) {
		return (
			<span style={{ columnSpan: "all" }}>
				{`+ ${antallSkjulteRader} samarbeid`}
			</span>
		);
	}

	return (
		<span style={{ columnSpan: "all" }}>
			{`+ ${antallSkjulteRader} flere samarbeid`}
		</span>
	);
}

const InternLenkeMedEllipse = styled(InternLenke)`
	overflow: hidden;
	text-overflow: ellipsis;
	white-space: nowrap;
	display: inline-block;
`;

const BodyShortMedEllipse = styled(BodyShort)`
	overflow: hidden;
	text-overflow: ellipsis;
	white-space: nowrap;
	display: inline-block;
`;

const Samarbeidgrid = styled.div<{ $kompakt: boolean }>`
	display: grid;
	grid-template-columns: ${({ $kompakt }) => $kompakt ? "minmax(auto, 10rem) auto auto" : "minmax(auto, 20rem) minmax(auto, 8rem) minmax(auto, 8rem)"};
	gap: 0.5rem 1.5rem;
	padding-bottom: ${({ $kompakt }) => $kompakt ? "none" : "2rem"};
`;

const Samarbeidrad = styled.div`
	display: contents;
`;