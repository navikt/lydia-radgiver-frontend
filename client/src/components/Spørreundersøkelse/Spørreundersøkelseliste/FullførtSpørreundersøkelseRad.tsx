import React from "react";
import { ExpansionCard } from "@navikt/ds-react";
import { Spørreundersøkelse } from "../../../domenetyper/spørreundersøkelse";
import { useSpørreundersøkelse } from "../SpørreundersøkelseContext";
import styles from './spørreundersøkelsesliste.module.scss';
import { SpørreundersøkelseResultat } from "../../../Pages/Virksomhet/Kartlegging/SpørreundersøkelseResultat";
import { FormatertSpørreundersøkelseType } from "./utils";
import { SpørreundersøkelseStatusBadge } from "../../Badge/SpørreundersøkelseStatusBadge";


export default function FullførtSpørreundersøkelseRad({ spørreundersøkelse, erÅpen, dato }: { spørreundersøkelse: Spørreundersøkelse, erÅpen: boolean, dato: string }) {
	return (
		<>
			<SpørreundersøkelseHeader spørreundersøkelse={spørreundersøkelse} dato={dato} />
			{erÅpen && (
				<SpørreundersøkelseRadInnhold spørreundersøkelse={spørreundersøkelse} />
			)}
		</>
	)
}

function SpørreundersøkelseHeader({ spørreundersøkelse, dato }: { spørreundersøkelse: Spørreundersøkelse, dato: string }) {
	return (
		<ExpansionCard.Header className={styles.styledExpansionCardHeader}>
			<ExpansionCard.Title>
				<FormatertSpørreundersøkelseType type={spørreundersøkelse.type} />
			</ExpansionCard.Title>
			<span className={styles.headerRightContent}>
				<span className={styles.datovisning}>{dato}</span>
				<SpørreundersøkelseStatusBadge status={spørreundersøkelse.status} />
			</span>
		</ExpansionCard.Header>
	)
}

function SpørreundersøkelseRadInnhold({
	spørreundersøkelse,
}: { spørreundersøkelse: Spørreundersøkelse }) {
	const spørreundersøkelseStatus = spørreundersøkelse.status;
	const { iaSak } = useSpørreundersøkelse();

	if (iaSak !== undefined) {
		if (spørreundersøkelseStatus === "AVSLUTTET" && spørreundersøkelse.harMinstEttResultat) {
			return (
				<ExpansionCard.Content>
					<SpørreundersøkelseResultat
						iaSak={iaSak}
						spørreundersøkelseId={spørreundersøkelse.id}
					/>
				</ExpansionCard.Content>
			);
		}
	}

	return null;
};
