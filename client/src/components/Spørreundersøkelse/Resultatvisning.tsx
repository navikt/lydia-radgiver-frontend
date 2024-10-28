import styled from "styled-components";
import { TemaResultat } from "./TemaResultat";
import { IASakKartleggingResultat } from "../../domenetyper/iaSakKartleggingResultat";
import { TemaResultatDto } from "../../domenetyper/iaSakSpørreundersøkelse";

export const Container = styled.div`
    padding-top: 1rem;
    height: 100%;

    display: flex;
    flex-direction: column;
    gap: 2rem;
`;

export default function Resultatvisning({ kartleggingResultat }:
	{ kartleggingResultat: IASakKartleggingResultat }) {
	return (
		<Container>
			{kartleggingResultat.spørsmålMedSvarPerTema.map(
				(tema: TemaResultatDto) => (
					<TemaResultat
						key={tema.navn}
						spørsmålResultat={tema.spørsmålMedSvar}
						navn={tema.navn} />
				)
			)}
		</Container>
	);
}
