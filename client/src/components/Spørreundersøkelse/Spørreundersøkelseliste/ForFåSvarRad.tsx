import { Button, ExpansionCard, HStack, VStack } from "@navikt/ds-react";
import React from "react";
import { SpørreundersøkelseStatusBadge } from "../../Badge/SpørreundersøkelseStatusBadge";
import { InformationSquareIcon, TrashIcon } from "@navikt/aksel-icons";
import {
	CardHeaderProps,
} from "../SpørreundersøkelseContext";

import styles from './spørreundersøkelsesliste.module.scss';
import ActionButtonsHvisSamarbeidIkkeFullført from "../../../Pages/Virksomhet/Kartlegging/ActionButtonHvisSamarbeidIkkeFullført";
import { Spørreundersøkelse } from "../../../domenetyper/spørreundersøkelse";
import { FormatertSpørreundersøkelseType } from "./utils";

export default function ForFåSvarRad({
	spørreundersøkelse,
	dato,
	setSlettSpørreundersøkelseModalÅpen,
	loading = false,
	kanEndreSpørreundersøkelser,
	erLesebruker
}: CardHeaderProps & { setSlettSpørreundersøkelseModalÅpen: React.Dispatch<React.SetStateAction<boolean>>, loading?: boolean, kanEndreSpørreundersøkelser: boolean }) {
	return (
		<VStack className={styles.styledEmptyCardHeader} justify="center" align="start">
			<HStack justify="space-between" align="center" style={{ width: "100%" }}>
				<span className={styles.headerLeftContent}>
					<ExpansionCard.Title>
						<FormatertSpørreundersøkelseType type={spørreundersøkelse.type} />
					</ExpansionCard.Title>
				</span>
				<span className={styles.headerRightContent}>
					<ActionButtonsHvisSamarbeidIkkeFullført>
						{kanEndreSpørreundersøkelser && !erLesebruker && <Button
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
					<span className={styles.datovisning}>{dato}</span>
					<SpørreundersøkelseStatusBadge
						status={spørreundersøkelse.status}
					/>
				</span>
			</HStack>
			<ForFåSvarWarning spørreundersøkelse={spørreundersøkelse} />
		</VStack>
	);
}

function ForFåSvarWarning({ spørreundersøkelse }: { spørreundersøkelse: Spørreundersøkelse }) {
	return (
		<span className={styles.infolinje}>
			<InformationSquareIcon aria-hidden fontSize="1.5rem" />
			<FormatertSpørreundersøkelseType type={spørreundersøkelse.type} /> har for få besvarelser til å vise svarresultater
		</span>
	)
}