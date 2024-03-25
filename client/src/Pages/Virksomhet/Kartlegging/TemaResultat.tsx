import { BodyShort, Heading } from "@navikt/ds-react";
import styled from "styled-components";
import React from "react";
import StackedBarChart from "./KartleggingResultatChart";

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
    beskrivelse: string;
    liste: {
        svarListe: {
            prosent: number;
            tekst: string;
            svarId: string;
            antallSvar: number;
        }[];
        spørsmålId: string;
        tekst: string;
    }[];
}

export const TemaResultat = ({ beskrivelse, liste }: Props) => {
    const MINIMUM_ANTALL_DELTAKERE = 3;
    return (
        <>
            <Heading spacing={true} level="3" size="medium">
                {beskrivelse}
            </Heading>
            {liste.map((spørsmål) => (
                <FlexContainer key={spørsmål.spørsmålId}>
                    <HeadingContainer>
                        <BodyShort weight={"semibold"}>
                            {spørsmål.tekst}
                        </BodyShort>
                    </HeadingContainer>
                    <StackedBarChart
                        harNokDeltakere={
                            spørsmål.svarListe.reduce(
                                (prev, current) => prev + current.antallSvar,
                                0,
                            ) >= MINIMUM_ANTALL_DELTAKERE
                        }
                        spørsmål={spørsmål}
                    />
                </FlexContainer>
            ))}
        </>
    );
};
