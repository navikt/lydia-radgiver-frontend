import styled from "styled-components";
import { Loader, BodyShort } from "@navikt/ds-react";
import { IASak } from "../../../domenetyper/domenetyper";
import Resultatvisning from "../../../components/Spørreundersøkelse/Resultatvisning";
import { useHentResultat } from "../../../api/lydia-api/spørreundersøkelse";

export const Container = styled.div`
    padding-top: 1rem;
    height: 100%;

    display: flex;
    flex-direction: column;
    gap: 2rem;
`;

export const SpørreundersøkelseResultat = ({
    iaSak,
    spørreundersøkelseId,
}: {
    iaSak: IASak;
    spørreundersøkelseId: string;
}) => {
    const { data: kartleggingResultat, loading: lasterKartleggingResultat } =
        useHentResultat(iaSak.orgnr, iaSak.saksnummer, spørreundersøkelseId);

    if (lasterKartleggingResultat) {
        return <Loader />;
    }

    if (!kartleggingResultat) {
        return <BodyShort>Kunne ikke hente resultater</BodyShort>;
    }

    return <Resultatvisning kartleggingResultat={kartleggingResultat} />;
};
