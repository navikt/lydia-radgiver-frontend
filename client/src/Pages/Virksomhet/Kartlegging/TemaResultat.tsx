import { BodyShort, Heading } from "@navikt/ds-react";
import styled from "styled-components";
import React from "react";
import KartleggingResultatChart from "./KartleggingResultatChart";

const FlexContainer = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: flex-end;
    flex-wrap: wrap;
    gap: 1rem;
`;

const HeadingContainer = styled.div`
    flex-grow: 1;
    width: 20rem;
`;

interface Props {
    visSomProsent: boolean;
    beskrivelse: string;
    spørsmålMedSvar: {
        spørsmålId: string;
        tekst: string;
        svarListe: { tekst: string; svarId: string; antallSvar: number }[];
    }[];
}

export const TemaResultat = ({
    visSomProsent,
    beskrivelse,
    spørsmålMedSvar,
}: Props) => {
    return (
        <>
            <Heading spacing={true} level="3" size="medium">
                {beskrivelse}
            </Heading>
            {spørsmålMedSvar.map((spørsmål) => (
                <FlexContainer key={spørsmål.spørsmålId}>
                    <HeadingContainer>
                        <BodyShort size={"large"} weight={"semibold"}>
                            {spørsmål.tekst}
                        </BodyShort>
                    </HeadingContainer>
                    <KartleggingResultatChart
                        visSomProsent={visSomProsent}
                        spørsmål={spørsmål}
                    />
                </FlexContainer>
            ))}
        </>
    );
};
