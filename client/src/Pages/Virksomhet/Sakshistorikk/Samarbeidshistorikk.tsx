import { BodyShort, Heading } from "@navikt/ds-react";
import { Sakshistorikk } from "../../../domenetyper/sakshistorikk";
import { SamarbeidStatusBadge } from "../../../components/Badge/SamarbeidStatusBadge";
import { lokalDato } from "../../../util/dato";
import React from "react";
import { InternLenke } from "../../../components/InternLenke";
import { IASamarbeidStatusEnum } from "../../../domenetyper/iaSakProsess";
import styles from './sakshistorikk.module.scss';

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
			<div className={`${styles.samarbeidGrid} ${kompakt ? styles.kompakt : ""}`}>
				{
					sorterteSamarbeid.map((samarbeid) => (
						<div className={styles.samarbeidrad} key={samarbeid.id}>
							{
								lenke ? (
									<InternLenke className={styles.medEllipse} underline={false} href={`/virksomhet/${orgnr}/sak/${samarbeid.saksnummer}/samarbeid/${samarbeid.id}`}>
										{samarbeid.navn}
									</InternLenke>
								) : (
									<BodyShort className={styles.medEllipse}>{samarbeid.navn}</BodyShort>
								)
							}
							<SamarbeidStatusBadge status={samarbeid.status} />
							{
								(samarbeid.status === IASamarbeidStatusEnum.enum.FULLFØRT || samarbeid.status === IASamarbeidStatusEnum.enum.AVBRUTT)
									&& samarbeid.sistEndret
									? <span>{lokalDato(samarbeid.sistEndret)}</span>
									: <div />
							}
						</div>
					))
				}
				<SkjulteRader antallSkjulteRader={antallSkjulteRader} />
			</div>
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