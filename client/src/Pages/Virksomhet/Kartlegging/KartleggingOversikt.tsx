import styled from "styled-components";
import { BodyShort } from "@navikt/ds-react";
import React from "react";
import { IASakKartleggingOversikt } from "../../../domenetyper/iaSakKartleggingResultat";

const Container = styled.div`
    padding-top: 1rem;
    height: 100%;

    display: flex;
    flex-direction: column;
    gap: 0.75rem;
`;

interface KartleggingOversiktProps {
    kartleggingOversikt: IASakKartleggingOversikt;
}

export const KartleggingOversikt = ({
    kartleggingOversikt,
}: KartleggingOversiktProps) => {
    return (
        <>
            {kartleggingOversikt.spørsmålMedAntallSvarPerTema.map(
                (tema, index) => (
                    <Container key={index}>
                        <BodyShort weight={"semibold"}>
                            {tema.temabeskrivelse}
                        </BodyShort>
                        <div>
                            <BodyShort>
                                Antall deltakere med minst ett svar:{" "}
                                {tema.antallUnikeDeltakereMedMinstEttSvar}
                            </BodyShort>
                            <BodyShort>
                                Antall deltakere som fullførte kartlegging:{" "}
                                {tema.antallUnikeDeltakereSomHarSvartPåAlt}
                            </BodyShort>
                        </div>
                    </Container>
                ),
            )}
        </>
    );
};
