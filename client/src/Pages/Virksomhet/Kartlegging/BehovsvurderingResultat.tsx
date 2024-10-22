import styled from "styled-components";
import { Loader, BodyShort } from "@navikt/ds-react";
import { useHentKartleggingResultat } from "../../../api/lydia-api";
import { IASak } from "../../../domenetyper/domenetyper";
import Resultatvisning from "../../../components/Spørreundersøkelse/Resultatvisning";

export const Container = styled.div`
    padding-top: 1rem;
    height: 100%;

    display: flex;
    flex-direction: column;
    gap: 2rem;
`;

export const BehovsvurderingResultat = ({
    iaSak, behovsvurderingId,
}: {
    iaSak: IASak;
    behovsvurderingId: string;
}) => {
    const { data: kartleggingResultat, loading: lasterKartleggingResultat } = useHentKartleggingResultat(
        iaSak.orgnr,
        iaSak.saksnummer,
        behovsvurderingId
    );

    if (lasterKartleggingResultat) {
        return <Loader />;
    }

    if (!kartleggingResultat) {
        return <BodyShort>Kunne ikke hente resultater</BodyShort>;
    }

    return (
        <Resultatvisning kartleggingResultat={kartleggingResultat} />
    );
};