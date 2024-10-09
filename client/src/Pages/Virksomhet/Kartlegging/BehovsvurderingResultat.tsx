import { BodyShort, Loader } from "@navikt/ds-react";
import { IASak } from "../../../domenetyper/domenetyper";
import { useHentKartleggingResultat } from "../../../api/lydia-api";
import styled from "styled-components";
import { TemaResultat } from "./TemaResultat";

const Container = styled.div`
    padding-top: 1rem;
    height: 100%;

    display: flex;
    flex-direction: column;
    gap: 2rem;
`;

export const BehovsvurderingResultat = ({
    iaSak,
    behovsvurderingId,
}: {
    iaSak: IASak;
    behovsvurderingId: string;
}) => {
    //const kartleggingResultat = dummyKartleggingResultat;
    //const { loading: lasterKartleggingResultat } =
    const { data: kartleggingResultat, loading: lasterKartleggingResultat } =
        useHentKartleggingResultat(
            iaSak.orgnr,
            iaSak.saksnummer,
            behovsvurderingId,
        );

    if (lasterKartleggingResultat) {
        return <Loader />;
    }

    if (!kartleggingResultat) {
        return <BodyShort>Kunne ikke hente resultater</BodyShort>;
    }

    return (
        <Container>
            {kartleggingResultat.spørsmålMedSvarPerTema.map((tema) => (
                <TemaResultat
                    key={tema.navn}
                    spørsmålMedSvar={tema.spørsmålMedSvar}
                    navn={tema.navn}
                />
            ))}
        </Container>
    );
};
