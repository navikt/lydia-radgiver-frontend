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

interface PrintVisningProps {
	erIPrintMode: boolean;
	setErIPrintMode: (erIPrintMode: boolean) => void;
	iaSak: IASak;
	kartlegging: IASakKartlegging;
}

const PrintVisning = ({ erIPrintMode, setErIPrintMode, iaSak, kartlegging }: PrintVisningProps) => {
	/* 	toPDF har returntypen void, men i den faktiske koden har den returntypen Promise<void>
		Må caste til Promise<void> for å sette loadingindikator */
	const { toPDF, targetRef } = usePDF() as { toPDF: () => Promise<void>, targetRef: React.MutableRefObject<HTMLDivElement> };
	const [erLastet, setErLastet] = React.useState(false);

	React.useEffect(() => {
		if (erIPrintMode && erLastet) {
			targetRef.current.style.display = "block";
			toPDF().then(() => {
				setErIPrintMode(false);
			});
			targetRef.current.style.display = "none";
		}
	}, [erIPrintMode, erLastet]);

	if (kartlegging.status !== "AVSLUTTET") {
		return null;
	}

	return (
		<>
			<Button
				loading={erIPrintMode}
				icon={<FilePdfIcon fontSize="1.5rem" />}
				variant="secondary"
				style={{ marginRight: "1rem" }}
				size='small'
				onClick={(e) => {
					e.stopPropagation();
					setErIPrintMode(true);
				}}>
				Eksporter
			</Button>
			<div ref={targetRef} style={{ display: "none", position: "absolute", width: 1280, left: 0, top: 0 }}>
				<PrintInnhold erLastet={erLastet} setErLastet={setErLastet} kartlegging={kartlegging} iaSak={iaSak} />
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
`;

function PrintInnhold({ kartlegging, iaSak, erLastet, setErLastet }: { kartlegging: IASakKartlegging, iaSak: IASak, erLastet: boolean, setErLastet: (erLastet: boolean) => void }) {
	const { data: kartleggingResultat, loading: lasterKartleggingResultat } =
		useHentKartleggingResultat(
			iaSak.orgnr,
			iaSak.saksnummer,
			kartlegging.kartleggingId,
		);

	//const kartleggingResultat = dummyKartleggingResultat;
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
					erIPrintMode={true}
				/>
			))}
		</Container>
	);
}

export default PrintVisning;