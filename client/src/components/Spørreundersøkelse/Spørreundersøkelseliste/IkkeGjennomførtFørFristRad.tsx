import React from "react";
import { Button, ExpansionCard } from "@navikt/ds-react";
import { Spørreundersøkelse } from "../../../domenetyper/spørreundersøkelse";
import styles from './spørreundersøkelsesliste.module.scss';
import { SpørreundersøkelseStatusBadge } from "../../Badge/SpørreundersøkelseStatusBadge";
import { SlettSpørreundersøkelseModal } from "../../../Pages/Virksomhet/Kartlegging/SlettSpørreundersøkelseModal";
import ActionButtonsHvisSamarbeidIkkeFullført from "../../../Pages/Virksomhet/Kartlegging/ActionButtonHvisSamarbeidIkkeFullført";
import { ExclamationmarkTriangleIcon, TrashIcon } from "@navikt/aksel-icons";
import { SpørreundersøkelseType } from "../../../domenetyper/spørreundersøkelseMedInnhold";
import { FormatertSpørreundersøkelseType } from "./utils";

function IkkeGjennomførtFørFrist({
	type,
}: {
	type: SpørreundersøkelseType;
}) {
	return (
		<span className={styles.headerLeftContent}>
			<ExpansionCard.Title className={styles.tittelUtenTopMargin}>
				<FormatertSpørreundersøkelseType type={type} />
			</ExpansionCard.Title>
			<span className={styles.infolinje}>
				<ExclamationmarkTriangleIcon aria-hidden fontSize="1.5rem" />{" "}
				<FormatertSpørreundersøkelseType type={type} />en ble ikke gjennomført innen 24 timer
			</span>
		</span>
	);
}

export default function IkkeGjennomførtFørFristRad({
	spørreundersøkelse,
	kanEndreSpørreundersøkelser,
	setSlettSpørreundersøkelseModalÅpen,
	slettSpørreundersøkelseModalÅpen,
	slettSpørreundersøkelsen,
	laster,
	dato,
}: {
	spørreundersøkelse: Spørreundersøkelse;
	kanEndreSpørreundersøkelser: boolean;
	setSlettSpørreundersøkelseModalÅpen: React.Dispatch<
		React.SetStateAction<boolean>
	>;
	slettSpørreundersøkelseModalÅpen: boolean;
	slettSpørreundersøkelsen: () => void;
	laster: boolean;
	dato?: string;
}) {
	return (
		<div className={`${styles.styledEmptyCardHeader} ${styles.styledExpansionCardHeader}`}>
			<IkkeGjennomførtFørFrist type={spørreundersøkelse.type} />
			<span className={styles.headerRightContent}>
				<ActionButtonsHvisSamarbeidIkkeFullført>
					{kanEndreSpørreundersøkelser && (
						<Button
							iconPosition="right"
							variant="secondary"
							size="small"
							icon={<TrashIcon aria-hidden />}
							onClick={() =>
								setSlettSpørreundersøkelseModalÅpen(true)
							}
							loading={laster}
						>
							Slett
						</Button>
					)}
				</ActionButtonsHvisSamarbeidIkkeFullført>
				<div className={styles.kartleggingStatusWrapper}>
					<SpørreundersøkelseStatusBadge
						status={spørreundersøkelse.status}
					/>
					<SlettSpørreundersøkelseModal
						spørreundersøkelse={spørreundersøkelse}
						erModalÅpen={slettSpørreundersøkelseModalÅpen}
						lukkModal={() =>
							setSlettSpørreundersøkelseModalÅpen(false)
						}
						slettSpørreundersøkelsen={slettSpørreundersøkelsen}
					/>
				</div>
				<span className={styles.datovisning}>{dato}</span>
			</span>
		</div>
	);
}