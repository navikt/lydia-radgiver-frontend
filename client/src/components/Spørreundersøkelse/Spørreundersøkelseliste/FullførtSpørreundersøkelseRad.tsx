import React from "react";
import { ExpansionCard } from "@navikt/ds-react";
import { Spørreundersøkelse } from "../../../domenetyper/spørreundersøkelse";
import { useSpørreundersøkelse } from "../SpørreundersøkelseContext";
import styles from './spørreundersøkelsesliste.module.scss';
import { SpørreundersøkelseResultat } from "../../../Pages/Virksomhet/Kartlegging/SpørreundersøkelseResultat";
import { FormatertSpørreundersøkelseType } from "./utils";
import { SpørreundersøkelseStatusBadge } from "../../Badge/SpørreundersøkelseStatusBadge";
import { FlyttTilAnnenProsess } from "../../../Pages/Virksomhet/Kartlegging/FlyttTilAnnenProsess";
import { flyttSpørreundersøkelse } from "../../../api/lydia-api/spørreundersøkelse";
import ActionButtonsHvisSamarbeidIkkeFullført from "../../../Pages/Virksomhet/Kartlegging/ActionButtonHvisSamarbeidIkkeFullført";


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
	const { iaSak, samarbeid, hentSpørreundersøkelserPåNytt } = useSpørreundersøkelse();
	const flyttTilValgtSamarbeid = (samarbeidId: number) => {
		flyttSpørreundersøkelse(
			iaSak.orgnr,
			iaSak.saksnummer,
			samarbeidId,
			spørreundersøkelse.id,
		).then(() => hentSpørreundersøkelserPåNytt?.());
	};

	return (
		<ExpansionCard.Header className={styles.styledExpansionCardHeader}>
			<ExpansionCard.Title>
				<FormatertSpørreundersøkelseType type={spørreundersøkelse.type} />
			</ExpansionCard.Title>
			<span className={styles.headerRightContent}>
				{
					spørreundersøkelse.publiseringStatus === "IKKE_PUBLISERT"
					&& spørreundersøkelse.type === "BEHOVSVURDERING"
					&& (
						<ActionButtonsHvisSamarbeidIkkeFullført>
							<FlyttTilAnnenProsess
								gjeldendeSamarbeid={samarbeid}
								iaSak={iaSak}
								flyttTilValgtSamarbeid={
									flyttTilValgtSamarbeid
								}
								dropdownSize="small"
							/>
						</ActionButtonsHvisSamarbeidIkkeFullført>
					)
				}
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
