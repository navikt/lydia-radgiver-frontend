import React from "react";

import { Button, HStack, ReadMore, Skeleton } from "@navikt/ds-react";
import { IAProsessStatusEnum, IASak } from "../../../domenetyper/domenetyper";
import { IaSakProsess } from "../../../domenetyper/iaSakProsess";
import styles from "./samarbeidsvelger.module.scss";
import { SamarbeidStatusBadge } from "../../../components/Badge/SamarbeidStatusBadge";
import { InternLenke } from "../../../components/InternLenke";
import { NyttSamarbeidModal } from "../../Virksomhet/Samarbeid/NyttSamarbeidModal";
import { Virksomhet } from "../../../domenetyper/virksomhet";
import { useHentBrukerinformasjon } from "../../../api/lydia-api/bruker";
import { useHentTeam } from "../../../api/lydia-api/team";
import { PlusIcon } from "@navikt/aksel-icons";

export default function Samarbeidsvelger({ iaSak, className, samarbeidsliste, valgtSamarbeid, lasterSamarbeid, virksomhet }: { iaSak?: IASak, className?: string, samarbeidsliste?: IaSakProsess[], valgtSamarbeid?: IaSakProsess | null, lasterSamarbeid?: boolean, virksomhet: Virksomhet }) {
	const aktiveSamarbeid = samarbeidsliste?.filter(
		(samarbeid) => samarbeid.status === IAProsessStatusEnum.enum.AKTIV,
	);
	const avsluttedeSamarbeid = samarbeidsliste?.filter(
		(samarbeid) => samarbeid.status !== IAProsessStatusEnum.enum.AKTIV,
	);

	if (lasterSamarbeid) {
		return (
			<nav className={`${className} ${styles.samarbeidsvelger}`}>
				<Samarbeidvelgeroverskrift samarbeid={aktiveSamarbeid} />
				<div className={styles.liste}>
					<div className={styles.radCommon}><Skeleton width="80%" /></div>
					<div className={styles.radCommon}><Skeleton width="80%" /></div>
					<div className={styles.radCommon}><Skeleton width="80%" /></div>
					<div className={styles.radCommon}><Skeleton width="80%" /></div>
				</div>
			</nav>
		);
	}

	if (iaSak?.saksnummer !== virksomhet.aktivtSaksnummer) {
		return <AvsluttedeSamarbeidVelger samarbeid={samarbeidsliste || []} className={className} iaSak={iaSak} valgtSamarbeid={valgtSamarbeid} />;
	}

	return (
		<nav className={`${className} ${styles.samarbeidsvelger}`}>
			<Samarbeidvelgeroverskrift samarbeid={aktiveSamarbeid} iaSak={iaSak} virksomhet={virksomhet} />
			<AktiveSamarbeidListe samarbeid={aktiveSamarbeid} valgtSamarbeid={valgtSamarbeid} orgnr={iaSak?.orgnr} />
			<AvsluttedeSamarbeidListe avsluttedeSamarbeid={avsluttedeSamarbeid} valgtSamarbeid={valgtSamarbeid} orgnr={iaSak?.orgnr} />
		</nav>
	);
}

function AvsluttedeSamarbeidVelger({ samarbeid, className, iaSak, valgtSamarbeid }: { samarbeid: IaSakProsess[], className?: string, iaSak?: IASak, valgtSamarbeid?: IaSakProsess | null }) {
	return (
		<nav className={`${className} ${styles.samarbeidsvelger}`}>
			<HStack className={`${styles.radCommon} ${styles.overskriftRad}`} align="center" justify="space-between">
				<h3 className={`${styles.overskrift}`}>{`Avsluttede samarbeid${samarbeid && ` (${samarbeid.length})`}`}</h3>
			</HStack>
			<div className={styles.liste}>
				{samarbeid?.map((s) => (
					<InternLenke key={s.id} className={`${styles.radCommon} ${styles.avsluttetSamarbeid} ${styles.klikkbar} ${valgtSamarbeid?.id === s.id ? styles.valgtSamarbeid : ""}`} href={`/virksomhet/${iaSak?.orgnr}/sak/${iaSak?.saksnummer}/samarbeid/${s.id}`}>
						{s.navn} <SamarbeidStatusBadge className={styles.avsluttetSamarbeidStatus} status={s.status} slim />
					</InternLenke>
				))}
			</div>
		</nav>
	);
}

function Samarbeidvelgeroverskrift({ samarbeid, iaSak, virksomhet }: { samarbeid?: IaSakProsess[], iaSak?: IASak, virksomhet?: Virksomhet }) {
	return (
		<HStack className={`${styles.radCommon} ${styles.overskriftRad}`} align="center" justify="space-between">
			<h3 className={`${styles.overskrift}`}>{samarbeid && samarbeid.length ? `Samarbeid${samarbeid && ` (${samarbeid.length})`}` : "Ingen aktive samarbeid"}</h3>
			{
				iaSak && virksomhet && (iaSak.status === "KARTLEGGES" || iaSak.status === "VI_BISTÅR") && <LeggTilSamarbeidKnapp iaSak={iaSak} virksomhet={virksomhet} />
			}
		</HStack>
	);
}

function AktiveSamarbeidListe({ samarbeid, valgtSamarbeid, orgnr }: { samarbeid?: IaSakProsess[], valgtSamarbeid?: IaSakProsess | null, orgnr?: string }) {

	if (!samarbeid || samarbeid.length === 0) {
		return null;
	}

	return (
		<div className={styles.liste}>
			{samarbeid?.map((s) => (
				<InternLenke key={s.id} className={`${styles.radCommon} ${styles.klikkbar} ${valgtSamarbeid?.id === s.id ? styles.valgtSamarbeid : ""}`} href={`/virksomhet/${orgnr}/samarbeid/${s.id}`}>
					{s.navn}
				</InternLenke>
			))}
		</div>
	);
}

function LeggTilSamarbeidKnapp({ iaSak, virksomhet }: { iaSak?: IASak, virksomhet: Virksomhet }) {
	const [nyttSamarbeidModalÅpen, setNyttSamarbeidModalÅpen] = React.useState(false);
	const { data: brukerInformasjon } = useHentBrukerinformasjon();
	const { data: følgere = [] } = useHentTeam(iaSak?.saksnummer);
	const brukerFølgerSak = følgere.some(
		(følger) => følger === brukerInformasjon?.ident,
	);

	const brukerErEierAvSak = iaSak?.eidAv === brukerInformasjon?.ident;
	const kanEndreSamarbeid = (brukerFølgerSak || brukerErEierAvSak) && brukerInformasjon?.rolle !== "Lesetilgang";

	if (!iaSak || !kanEndreSamarbeid) {
		return null;
	}

	return (
		<>
			<Button size="xsmall" onClick={() => setNyttSamarbeidModalÅpen(true)} title="Legg til nytt samarbeid" icon={<PlusIcon fontSize="1.5rem" aria-hidden />} />
			<NyttSamarbeidModal
				iaSak={iaSak}
				virksomhet={virksomhet}
				åpen={nyttSamarbeidModalÅpen}
				setÅpen={setNyttSamarbeidModalÅpen}
			/>
		</>
	);
}

function AvsluttedeSamarbeidListe({ avsluttedeSamarbeid, valgtSamarbeid, orgnr }: { avsluttedeSamarbeid?: IaSakProsess[], valgtSamarbeid?: IaSakProsess | null, orgnr?: string }) {
	if (!avsluttedeSamarbeid || avsluttedeSamarbeid.length === 0) {
		return null;
	}
	const defaultEkspandert = valgtSamarbeid && avsluttedeSamarbeid.some(s => s.id === valgtSamarbeid.id) || false;
	const [åpen, setÅpen] = React.useState(defaultEkspandert);


	return (
		<ReadMore size="small" className={styles.inaktiveSamarbeidReadMore} header={`Avsluttede samarbeid (${avsluttedeSamarbeid.length})`} open={åpen} onClick={() => setÅpen(!åpen)}>
			<div className={styles.liste}>
				{avsluttedeSamarbeid?.map((s) => (
					<InternLenke key={s.id} className={`${styles.radCommon} ${styles.avsluttetSamarbeid} ${styles.klikkbar} ${valgtSamarbeid?.id === s.id ? styles.valgtSamarbeid : ""}`} href={`/virksomhet/${orgnr}/samarbeid/${s.id}`}>
						{s.navn} <SamarbeidStatusBadge className={styles.avsluttetSamarbeidStatus} status={s.status} slim />
					</InternLenke>
				))}
			</div>
		</ReadMore>
	);
}
