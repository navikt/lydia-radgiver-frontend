import React from "react";

import { Button, ReadMore } from "@navikt/ds-react";
import { IAProsessStatusEnum, IASak } from "../../../domenetyper/domenetyper";
import { IaSakProsess } from "../../../domenetyper/iaSakProsess";
import styles from "./samarbeidsvelger.module.scss";
import { SamarbeidStatusBadge } from "../../../components/Badge/SamarbeidStatusBadge";

export default function Samarbeidsvelger({ className, samarbeidsliste, valgtSamarbeid, setValgtSamarbeid }: { iaSak?: IASak, className?: string, samarbeidsliste?: IaSakProsess[], valgtSamarbeid: IaSakProsess | null, setValgtSamarbeid: React.Dispatch<React.SetStateAction<IaSakProsess | null>> }) {
	const aktiveSamarbeid = samarbeidsliste?.filter(
		(samarbeid) => samarbeid.status === IAProsessStatusEnum.enum.AKTIV,
	);
	const avsluttedeSamarbeid = samarbeidsliste?.filter(
		(samarbeid) => samarbeid.status !== IAProsessStatusEnum.enum.AKTIV,
	);

	return (
		<nav className={`${className} ${styles.samarbeidsvelger}`}>
			<Samarbeidvelgeroverskrift samarbeid={aktiveSamarbeid} />
			<AktiveSamarbeidListe samarbeid={aktiveSamarbeid} valgtSamarbeid={valgtSamarbeid} setValgtSamarbeid={setValgtSamarbeid} />
			<LeggTilSamarbeidKnapp />
			<AvsluttedeSamarbeidListe avsluttedeSamarbeid={avsluttedeSamarbeid} valgtSamarbeid={valgtSamarbeid} setValgtSamarbeid={setValgtSamarbeid} />
		</nav>
	);
}

function Samarbeidvelgeroverskrift({ samarbeid }: { samarbeid?: IaSakProsess[] }) {
	return (
		<h3 className={`${styles.radCommon} ${styles.overskrift}`}>Samarbeid ({samarbeid?.length})</h3>
	);
}

function AktiveSamarbeidListe({ samarbeid, valgtSamarbeid, setValgtSamarbeid }: { samarbeid?: IaSakProsess[], valgtSamarbeid: IaSakProsess | null, setValgtSamarbeid: React.Dispatch<React.SetStateAction<IaSakProsess | null>> }) {
	if (!samarbeid || samarbeid.length === 0) {
		return <IngenAktiveSamarbeid />;
	}

	return (
		<ul className={styles.liste}>
			{samarbeid?.map((s) => (
				<Button as="li" variant="tertiary" key={s.id} className={`${styles.radCommon} ${styles.klikkbar} ${valgtSamarbeid?.id === s.id ? styles.valgtSamarbeid : ""}`} onClick={() => setValgtSamarbeid(s)}>
					{s.navn}
				</Button>
			))}
		</ul>
	);
}

function LeggTilSamarbeidKnapp() {
	return (
		<div className={`${styles.radCommon} ${styles.leggTilSamarbeidKnapp}`}>
			<Button>+</Button>
		</div>
	);
}

function AvsluttedeSamarbeidListe({ avsluttedeSamarbeid, valgtSamarbeid, setValgtSamarbeid }: { avsluttedeSamarbeid?: IaSakProsess[], valgtSamarbeid: IaSakProsess | null, setValgtSamarbeid: React.Dispatch<React.SetStateAction<IaSakProsess | null>> }) {
	const [åpen, setÅpen] = React.useState(false);
	if (!avsluttedeSamarbeid || avsluttedeSamarbeid.length === 0) {
		return null;
	}

	// Tving åpen dersom valgtSamarbeid er blant de avsluttede samarbeidene
	const defaultEkspandert = valgtSamarbeid && avsluttedeSamarbeid.some(s => s.id === valgtSamarbeid.id) || false;

	return (
		<ReadMore size="small" className={styles.inaktiveSamarbeidReadMore} header={`Avsluttede samarbeid (${avsluttedeSamarbeid.length})`} open={åpen || defaultEkspandert} onClick={() => setÅpen(!åpen)}>
			<ul className={styles.liste}>
				{avsluttedeSamarbeid?.map((s) => (
					<Button as="li" variant="tertiary" key={s.id} className={`${styles.radCommon} ${styles.avsluttetSamarbeid} ${styles.klikkbar} ${valgtSamarbeid?.id === s.id ? styles.valgtSamarbeid : ""}`} onClick={() => setValgtSamarbeid(s)}>
						{s.navn} <SamarbeidStatusBadge status={s.status} slim />
					</Button>
				))}
			</ul>
		</ReadMore>
	);
}

function IngenAktiveSamarbeid() {
	return (
		<p>Ingen aktive samarbeid</p>
	);
}