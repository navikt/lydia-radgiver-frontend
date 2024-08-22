import { BodyShort, Button, Loader } from '@navikt/ds-react';
import React from 'react';
import { usePDF } from 'react-to-pdf';
import { FilePdfIcon } from '@navikt/aksel-icons';
import { IASak } from '../../../domenetyper/domenetyper';
import { IASakKartlegging } from '../../../domenetyper/iaSakKartlegging';
import { useHentKartleggingResultat } from '../../../api/lydia-api';
import styled from 'styled-components';
import { TemaResultat } from './TemaResultat';
import { erIDev } from '../../../components/Dekoratør/Dekoratør';
import VirksomhetsEksportHeader from '../../../components/pdfEksport/VirksomhetsEksportHeader';
import useEksportFilnavn from '../../../components/pdfEksport/useEksportFilnavn';
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
	const { toPDF, targetRef } = usePDF({ filename: useEksportFilnavn("Behovsvurdering") }) as { toPDF: () => Promise<void>, targetRef: React.MutableRefObject<HTMLDivElement> };
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
				<VirksomhetsEksportHeader type="Behovsvurdering" dato={kartlegging.endretTidspunkt} />
				<EksportInnhold erLastet={erLastet} setErLastet={setErLastet} kartlegging={kartlegging} iaSak={iaSak} />
			</div>
		</>
	);
};

const Container = styled.div`
    height: 100%;
	padding-left: 2rem;
	padding-right: 2rem;

    display: flex;
    flex-direction: column;
`;


const StyledBodyShort = styled(BodyShort)`
	margin-bottom: 2rem;
`;


function EksportInnhold({ kartlegging, iaSak, erLastet, setErLastet }: { kartlegging: IASakKartlegging, iaSak: IASak, erLastet: boolean, setErLastet: (erLastet: boolean) => void }) {
	//const { loading: lasterKartleggingResultat } =
	const { data: kartleggingResultat, loading: lasterKartleggingResultat } =
		useHentKartleggingResultat(
			iaSak.orgnr,
			iaSak.saksnummer,
			kartlegging.kartleggingId,
		);

	//const kartleggingResultat = dummyKartleggingResultat;

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
			<StyledBodyShort>
				{`Antall deltakere: ${kartleggingResultat.antallUnikeDeltakereSomHarSvartPåAlt}`}
			</StyledBodyShort>
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