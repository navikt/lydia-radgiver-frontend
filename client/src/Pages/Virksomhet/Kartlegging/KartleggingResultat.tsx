import { BodyShort, Loader } from "@navikt/ds-react";
import { IASak } from "../../../domenetyper/domenetyper";
import { useHentKartleggingResultat } from "../../../api/lydia-api";
import styled from "styled-components";
import React from "react";
import { TemaResultat } from "./TemaResultat";

const Container = styled.div`
    padding-top: 1rem;
    height: 100%;

    display: flex;
    flex-direction: column;
    gap: 2rem;
`;

interface Props {
    iaSak: IASak;
    kartleggingId: string;
    visSomProsent: boolean;
}

export const KartleggingResultat = ({
    iaSak,
    kartleggingId,
    visSomProsent,
}: Props) => {
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
        return <BodyShort>Kunne ikke hente resultater</BodyShort>;
    }

    return (
        <Container>
            <BodyShort>
                {`Antall deltakere som fullførte behovsvurderingen: ${kartleggingResultat.antallUnikeDeltakereSomHarSvartPåAlt}`}
            </BodyShort>
            {kartleggingResultat.spørsmålMedSvarPerTema.map((tema) => (
                <TemaResultat
                    key={tema.tema}
                    spørsmålMedSvar={tema.spørsmålMedSvar}
                    beskrivelse={tema.beskrivelse}
                    visSomProsent={visSomProsent}
                />
            ))}
        </Container>
    );
};
