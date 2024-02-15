import { BodyShort, Heading, Loader } from "@navikt/ds-react";
import { IASak } from "../../../domenetyper/domenetyper";
import { useHentKartleggingResultat } from "../../../api/lydia-api";
import styled from "styled-components";
import React from "react";
import StackedBarChart from "./KartleggingResultatChart";

const Container = styled.div`
    padding-top: 1rem;
    height: 100%;

    display: flex;
    flex-direction: column;
    gap: 2rem;
`;

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
    iaSak: IASak;
    kartleggingId: string;
}

export const KartleggingResultat = ({ iaSak, kartleggingId }: Props) => {
    const { data: kartleggingResultat, loading: lasterKartleggingResultat } =
        useHentKartleggingResultat(
            iaSak.orgnr,
            iaSak.saksnummer,
            kartleggingId,
        );


    if (lasterKartleggingResultat) {
        return <Loader />;
    }

    if (!kartleggingResultat) {
        return <BodyShort>Kunne ikke hente kartleggingsresultater</BodyShort>;
    }

    const kartleggingerMedProsent = kartleggingResultat.spørsmålMedSvar.map(
        (spørsmål) => {
            const totalAntallSvar = spørsmål.svarListe.reduce(
                (accumulator, svar) => accumulator + svar.antallSvar,
                0,
            );
            const svarListeMedProsent = spørsmål.svarListe.map((svar) => ({
                ...svar,
                prosent: (svar.antallSvar / totalAntallSvar) * 100,
            }));

            return {
                ...spørsmål,
                svarListe: svarListeMedProsent,
            };
        },
    );

    return (
        <Container>
            <Heading spacing={true} level="3" size="medium">
                Partssamarbeid
            </Heading>
            {kartleggingerMedProsent.map((spørsmål) => (
                <FlexContainer key={spørsmål.spørsmålId}>
                    <HeadingContainer>
                        <BodyShort weight={"semibold"}>
                            {spørsmål.tekst}
                        </BodyShort>
                    </HeadingContainer>
                    <StackedBarChart spørsmål={spørsmål} />
                </FlexContainer>
            ))}
        </Container>
    );
};
