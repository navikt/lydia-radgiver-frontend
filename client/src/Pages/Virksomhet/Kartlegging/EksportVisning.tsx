import { BodyShort, Button, Heading, Loader } from '@navikt/ds-react';
import React from 'react';
import { usePDF } from 'react-to-pdf';
import { FilePdfIcon } from '@navikt/aksel-icons';
import { IASak } from '../../../domenetyper/domenetyper';
import { IASakKartlegging } from '../../../domenetyper/iaSakKartlegging';
import { useHentKartleggingResultat } from '../../../api/lydia-api';
import styled from 'styled-components';
import { TemaResultat } from './TemaResultat';
import { useVirksomhetContext } from '../VirksomhetContext';
import NAVLogo from "../../../img/NAV_logo_rød.png";
import { erIDev } from '../../../components/Dekoratør/Dekoratør';
//import { dummyKartleggingResultat } from './dummyKartleggingResultat';

interface EksportVisningProps {
	erIEksportMode: boolean;
	setErIEksportMode: (erIEksportMode: boolean) => void;
	iaSak: IASak;
	kartlegging: IASakKartlegging;
}

const EksportVisning = ({ erIEksportMode, setErIEksportMode, iaSak, kartlegging }: EksportVisningProps) => {
	/* 	toPDF har returntypen void, men i den faktiske koden har den returntypen Promise<void>
		Må caste til Promise<void> for å sette loadingindikator */
	const { toPDF, targetRef } = usePDF() as { toPDF: () => Promise<void>, targetRef: React.MutableRefObject<HTMLDivElement> };
	const [erLastet, setErLastet] = React.useState(false);

	React.useEffect(() => {
		if (erIEksportMode && erLastet) {
			targetRef.current.style.display = "block";
			toPDF().then(() => {
				setErIEksportMode(false);
			});
			targetRef.current.style.display = "none";
		}
	}, [erIEksportMode, erLastet]);

	if (kartlegging.status !== "AVSLUTTET" || !erIDev) {
		return null;
	}

	return (
		<>
			<Button
				loading={erIEksportMode}
				icon={<FilePdfIcon fontSize="1.5rem" />}
				variant="secondary"
				style={{ marginRight: "1rem" }}
				size='small'
				onClick={(e) => {
					e.stopPropagation();
					setErIEksportMode(true);
				}}>
				Eksporter
			</Button>
			<div ref={targetRef} style={{ display: "none", position: "absolute", width: 1280, left: 0, top: 0, padding: "2rem" }}>
				<EksportHeader />
				<EksportInnhold erLastet={erLastet} setErLastet={setErLastet} kartlegging={kartlegging} iaSak={iaSak} />
			</div>
		</>
	);
};

const Container = styled.div`
    padding-top: 1rem;
    height: 100%;

    display: flex;
    flex-direction: column;
    gap: 2rem;
	padding: 2rem;
`;


function EksportHeader() {
	const { virksomhet } = useVirksomhetContext();
	const { navn: virksomhetsnavn } = virksomhet;
	return (
		<div style={{ marginBottom: "4rem" }}>
			<div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
				<BodyShort>Behovsvurdering for {virksomhetsnavn}</BodyShort>
				<BodyShort>Eksportert {new Date().toLocaleDateString()}</BodyShort>
			</div>
			<img src={NAVLogo} alt="NAV-logo" style={{ width: "10rem", height: "auto", margin: "auto", display: "block" }} />
		</div>
	);
}


function EksportInnhold({ kartlegging, iaSak, erLastet, setErLastet }: { kartlegging: IASakKartlegging, iaSak: IASak, erLastet: boolean, setErLastet: (erLastet: boolean) => void }) {
	//const { loading: lasterKartleggingResultat } =
	const { data: kartleggingResultat, loading: lasterKartleggingResultat } =
		useHentKartleggingResultat(
			iaSak.orgnr,
			iaSak.saksnummer,
			kartlegging.kartleggingId,
		);

	// const kartleggingResultat = dummyKartleggingResultat;
	const { virksomhet } = useVirksomhetContext();

	React.useEffect(() => {
		if (!lasterKartleggingResultat && kartleggingResultat && !erLastet) {
			setErLastet(true);
		}
	}, [lasterKartleggingResultat, kartleggingResultat, setErLastet, erLastet]);

	if (lasterKartleggingResultat) {
		return <Loader />;
	}

	if (!kartleggingResultat) {
		return <BodyShort>Kunne ikke hente resultater</BodyShort>;
	}


	return (
		<Container>
			<Heading level="3" size="large" spacing={true}>
				Behovsvurdering for {virksomhet.navn}
			</Heading>
			<BodyShort>
				{`Antall deltakere som fullførte behovsvurderingen: ${kartleggingResultat.antallUnikeDeltakereSomHarSvartPåAlt}`}
			</BodyShort>
			{kartleggingResultat.spørsmålMedSvarPerTema.map((tema) => (
				<TemaResultat
					key={tema.navn}
					spørsmålMedSvar={tema.spørsmålMedSvar}
					navn={tema.navn}
					erIEksportMode={true}
				/>
			))}
		</Container>
	);
}

export default EksportVisning;