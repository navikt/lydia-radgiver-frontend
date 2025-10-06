import { BodyShort, Button, ExpansionCard } from "@navikt/ds-react";
import React from "react";
import { SpørreundersøkelseStatusBadge } from "../../../components/Badge/SpørreundersøkelseStatusBadge";
import { InformationSquareIcon, TrashIcon } from "@navikt/aksel-icons";
import {
	CardHeaderProps,
} from "../../../components/Spørreundersøkelse/SpørreundersøkelseContext";

import styles from './forFåSvarRad.module.scss';
import ActionButtonsHvisSamarbeidIkkeFullført from "./ActionButtonHvisSamarbeidIkkeFullført";
import { SpørreundersøkelseTypeEnum } from "../../../domenetyper/spørreundersøkelseMedInnhold";

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
				<ExpansionCard.Title>{spørreundersøkelse.type === SpørreundersøkelseTypeEnum.enum.BEHOVSVURDERING ? "Behovsvurdering" : "Evaluering"}</ExpansionCard.Title>
				<InformationSquareIcon fontSize="1.5rem" aria-hidden />
				<BodyShort>
					{
						spørreundersøkelse.type === SpørreundersøkelseTypeEnum.enum.BEHOVSVURDERING
							? "Behovsvurderingen"
							: "Evalueringen"
					} har for få besvarelser til å vise svarresultater.
				</BodyShort>
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
				<div className={styles.behovsvurderingStatusWrapper}>
					<SpørreundersøkelseStatusBadge
						status={spørreundersøkelse.status}
					/>
				</div>
				<span className={styles.behovsvurderingDato}>{dato}</span>
			</span>
		</div>
	);
}
