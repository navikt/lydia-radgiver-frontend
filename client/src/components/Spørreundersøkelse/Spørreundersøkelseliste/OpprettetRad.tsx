import React from 'react';
import { Button, ExpansionCard, HStack, VStack } from '@navikt/ds-react';
import { Spørreundersøkelse } from '../../../domenetyper/spørreundersøkelse';
import ActionButtonsHvisSamarbeidIkkeFullført from '../../../Pages/Virksomhet/Kartlegging/ActionButtonHvisSamarbeidIkkeFullført';
import { useSpørreundersøkelse } from '../SpørreundersøkelseContext';
import { TrashIcon } from '@navikt/aksel-icons';
import { SpørreundersøkelseStatusBadge } from '../../Badge/SpørreundersøkelseStatusBadge';
import { SlettSpørreundersøkelseModal } from '../../../Pages/Virksomhet/Kartlegging/SlettSpørreundersøkelseModal';
import { SpørreundersøkelseMedInnholdVisning } from '../../../Pages/Virksomhet/Kartlegging/SpørreundersøkelseForhåndsvisningModal';
import { StartSpørreundersøkelseModal } from '../../../Pages/Virksomhet/Kartlegging/StartSpørreundersøkelseModal';
import { useHentIASaksStatus } from '../../../api/lydia-api/sak';
import styles from './spørreundersøkelsesliste.module.scss';
import { slettSpørreundersøkelse, startSpørreundersøkelse } from '../../../api/lydia-api/spørreundersøkelse';
import { FormatertSpørreundersøkelseType } from './utils';

export default function OpprettetRad({
	spørreundersøkelse,
	dato,
}: {
	spørreundersøkelse: Spørreundersøkelse;
	dato: string;
}) {
	const [bekreftStartKartleggingModalÅpen, setBekreftStartKartleggingModalÅpen] = React.useState(false);
	const [forhåndsvisModalÅpen, setForhåndsvisModalÅpen] = React.useState(false);
	const [slettSpørreundersøkelseModalÅpen, setSlettSpørreundersøkelseModalÅpen] = React.useState(false);
	const [sletterSpørreundersøkelse, setSletterSpørreundersøkelse] = React.useState(false);

	const {
		lasterSpørreundersøkelser,
		validererSpørreundersøkelser,
		iaSak,
		brukerRolle,
		kanEndreSpørreundersøkelser,
		hentSpørreundersøkelserPåNytt
	} = useSpørreundersøkelse();

	const {
		mutate: oppdaterSaksStatus,
		loading: lasterIaSakStatus,
		validating: validererIaSakStatus,
	} = useHentIASaksStatus(iaSak.orgnr, iaSak.saksnummer);

	const startSpørreundersøkelsen = () => {
		startSpørreundersøkelse(
			iaSak.orgnr,
			iaSak.saksnummer,
			spørreundersøkelse.id,
		).then(() => {
			hentSpørreundersøkelserPåNytt?.();
		});
	};

	const slettSpørreundersøkelsen = () => {
		if (sletterSpørreundersøkelse) return;
		setSletterSpørreundersøkelse(true);
		slettSpørreundersøkelse(
			iaSak.orgnr,
			iaSak.saksnummer,
			spørreundersøkelse.id,
		).then(() => {
			hentSpørreundersøkelserPåNytt?.();
			oppdaterSaksStatus();
			setSlettSpørreundersøkelseModalÅpen(false);
			setSletterSpørreundersøkelse(false);
		});
	};

	return (
		<VStack className={styles.styledEmptyCardHeader} justify="center" align="start">
			<HStack justify="space-between" align="center" style={{ width: "100%" }}>
				<div className={styles.headerLeftContent}>
					<ExpansionCard.Title>
						<FormatertSpørreundersøkelseType type={spørreundersøkelse.type} />
					</ExpansionCard.Title>
					<ActionButtonsHvisSamarbeidIkkeFullført>
						{(iaSak.status === "KARTLEGGES" ||
							iaSak.status === "VI_BISTÅR") &&
							brukerRolle !== "Lesetilgang" ? (
							<>
								<Button
									variant="primary"
									size="small"
									onClick={() =>
										setBekreftStartKartleggingModalÅpen(
											true,
										)
									}
								>
									Start
								</Button>
								<Button
									variant="secondary"
									size="small"
									onClick={() =>
										setForhåndsvisModalÅpen(true)
									}
								>
									Forhåndsvis
								</Button>
								{kanEndreSpørreundersøkelser && (
									<Button
										variant="secondary-neutral"
										size="small"
										onClick={() =>
											setSlettSpørreundersøkelseModalÅpen(
												true,
											)
										}
										icon={<TrashIcon aria-hidden />}
										aria-label="Slett behovsvurdering"
										loading={sletterSpørreundersøkelse || lasterSpørreundersøkelser || validererSpørreundersøkelser || lasterIaSakStatus || validererIaSakStatus}
									/>
								)}
							</>
						) : <ExpansionCard.Title className={styles.tittelUtenTopMargin}>Evaluering</ExpansionCard.Title>}
						<StartSpørreundersøkelseModal
							spørreundersøkelse={spørreundersøkelse}
							erModalÅpen={bekreftStartKartleggingModalÅpen}
							lukkModal={() =>
								setBekreftStartKartleggingModalÅpen(false)
							}
							startSpørreundersøkelsen={startSpørreundersøkelsen}
						/>
						<SpørreundersøkelseMedInnholdVisning
							spørreundersøkelse={spørreundersøkelse}
							erModalÅpen={forhåndsvisModalÅpen}
							spørreundersøkelseid={spørreundersøkelse.id}
							lukkModal={() => setForhåndsvisModalÅpen(false)}
						/>
						{brukerRolle && (
							<SlettSpørreundersøkelseModal
								spørreundersøkelse={spørreundersøkelse}
								erModalÅpen={slettSpørreundersøkelseModalÅpen}
								lukkModal={() =>
									setSlettSpørreundersøkelseModalÅpen(false)
								}
								slettSpørreundersøkelsen={slettSpørreundersøkelsen}
							/>
						)}
					</ActionButtonsHvisSamarbeidIkkeFullført>
				</div>
				<span className={styles.headerRightContent}>
					<span className={styles.datovisning}>{dato}</span>
					<div className={styles.kartleggingStatusWrapper}>
						<SpørreundersøkelseStatusBadge
							status={spørreundersøkelse.status}
						/>
					</div>
				</span>
			</HStack>
		</VStack>
	);
}

