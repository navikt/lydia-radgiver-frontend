import { Button, ExpansionCard } from "@navikt/ds-react";
import React from "react";
import { SpørreundersøkelseStatusBadge } from "../../Badge/SpørreundersøkelseStatusBadge";
import { InformationSquareIcon, TrashIcon } from "@navikt/aksel-icons";
import {
	CardHeaderProps,
} from "../SpørreundersøkelseContext";

import styles from './spørreundersøkelsesliste.module.scss';
import ActionButtonsHvisSamarbeidIkkeFullført from "../../../Pages/Virksomhet/Kartlegging/ActionButtonHvisSamarbeidIkkeFullført";
import { SpørreundersøkelseTypeEnum } from "../../../domenetyper/spørreundersøkelseMedInnhold";
import { Spørreundersøkelse } from "../../../domenetyper/spørreundersøkelse";
import { FormatertSpørreundersøkelseType } from "./utils";

export default function ForFåSvarRad({
	spørreundersøkelse,
	dato,
	setSlettSpørreundersøkelseModalÅpen,
	loading = false,
	erLesebruker = false,
}: CardHeaderProps & { setSlettSpørreundersøkelseModalÅpen: React.Dispatch<React.SetStateAction<boolean>>, loading?: boolean }) {
	return (
		<div className={styles.styledEmptyCardHeader}>
			<span className={styles.headerLeftContent}>
				<ExpansionCard.Title>
					<FormatertSpørreundersøkelseType type={spørreundersøkelse.type} />
				</ExpansionCard.Title>
				<ForFåSvarWarning spørreundersøkelse={spørreundersøkelse} />
			</span>
			<span className={styles.headerRightContent}>
				<ActionButtonsHvisSamarbeidIkkeFullført>
					{erLesebruker ? null : <Button
						variant="secondary"
						size="small"
						iconPosition="right"
						onClick={() => setSlettSpørreundersøkelseModalÅpen(true)}
						icon={<TrashIcon aria-hidden />}
						loading={loading}
					>
						Slett
					</Button>}
				</ActionButtonsHvisSamarbeidIkkeFullført>
				<SpørreundersøkelseStatusBadge
					status={spørreundersøkelse.status}
				/>
				<span className={styles.datovisning}>{dato}</span>
			</span>
		</div>
	);
}

function ForFåSvarWarning({ spørreundersøkelse }: { spørreundersøkelse: Spørreundersøkelse }) {
	return (
		<span className={styles.infolinje}>
			<InformationSquareIcon aria-hidden fontSize="1.5rem" />
			{
				spørreundersøkelse.type === SpørreundersøkelseTypeEnum.enum.BEHOVSVURDERING
					? "Behovsvurderingen"
					: "Evalueringen"
			} har for få besvarelser til å vise svarresultater
		</span>
	)
}