import styled from "styled-components";
import { TemaResultat } from "./TemaResultat";
import { SpørreundersøkelseResultat } from "../../domenetyper/spørreundersøkelseResultat";

export const Container = styled.div`
    padding-top: 1rem;
    height: 100%;

    display: flex;
    flex-direction: column;
    gap: 2rem;
`;

export default function Resultatvisning({
    kartleggingResultat,
}: {
    kartleggingResultat: SpørreundersøkelseResultat;
}) {
    return (
        <Container>
            {kartleggingResultat.spørsmålMedSvarPerTema.map((tema) => (
                <TemaResultat
                    key={tema.navn}
                    spørsmålResultat={tema.spørsmålMedSvar}
                    navn={tema.navn}
                />
            ))}
        </Container>
    );
}
