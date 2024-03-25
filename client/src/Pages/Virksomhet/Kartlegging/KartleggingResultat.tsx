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

    const kartleggingerMedProsent =
        kartleggingResultat.spørsmålMedSvarPerTema.map((tema) => {
            return {
                tittel: tema.tema,
                liste: tema.spørsmålMedSvar.map((spørsmål) => {
                    const totalAntallSvar = spørsmål.svarListe.reduce(
                        (accumulator, svar) => accumulator + svar.antallSvar,
                        0,
                    );
                    const svarListeMedProsent = spørsmål.svarListe.map(
                        (svar) => ({
                            ...svar,
                            prosent: (svar.antallSvar / totalAntallSvar) * 100,
                        }),
                    );

                    return {
                        ...spørsmål,
                        svarListe: svarListeMedProsent,
                    };
                }),
            };
        });

    return (
        <Container>
            <BodyShort>
                {`Antall deltakere som fullførte kartleggingen: ${kartleggingResultat.antallUnikeDeltakereSomHarSvartPåAlt}`}
            </BodyShort>

            {kartleggingerMedProsent.map((tema) => (
                <TemaResultat
                    key={tema.tittel}
                    tittel={tema.tittel}
                    liste={tema.liste}
                />
            ))}
        </Container>
    );
};
