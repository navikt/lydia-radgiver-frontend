import { Loader, BodyShort } from "@navikt/ds-react";
import { useHentResultat } from "@/api/lydia-api/spørreundersøkelse";
import Resultatvisning from "@/components/Spørreundersøkelse/Resultatvisning";
import { IASak } from "@/domenetyper/domenetyper";

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
