import { BodyShort, Loader } from "@navikt/ds-react";
import { IASak } from "../../../domenetyper/domenetyper";
import { useHentKartleggingResultat } from "../../../api/lydia-api";
import styled from "styled-components";
import { TemaResultat } from "./TemaResultat";
import { TemaResultatDto } from "../../../domenetyper/iaSakKartleggingResultat";

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
            {kartleggingResultat.spørsmålMedSvarPerTema.map(
                (tema: TemaResultatDto) => (
                    <TemaResultat
                        key={tema.navn}
                        spørsmålResultat={tema.spørsmålMedSvar}
                        navn={tema.navn}
                    />
                ),
            )}
        </Container>
    );
};
