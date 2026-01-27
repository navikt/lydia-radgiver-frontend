import { Button } from "@navikt/ds-react";
import React from "react";
import { FilePdfIcon } from "@navikt/aksel-icons";
import { IASak } from "../../../domenetyper/domenetyper";
import { Spørreundersøkelse } from "../../../domenetyper/spørreundersøkelse";
import { loggEksportertTilPdf } from "../../../util/analytics-klient";
import { kartleggingresultatPdfLenke } from "../../../api/lydia-api/spørreundersøkelse";

interface ResultatEksportVisningProps {
    iaSak: IASak;
    spørreundersøkelse: Spørreundersøkelse;
}

const ResultatEksportVisning = ({
    iaSak,
    spørreundersøkelse,
}: ResultatEksportVisningProps) => {
    if (spørreundersøkelse.status !== "AVSLUTTET") {
        return null;
    }

    return (
        <>
            <Button
                as="a"
                href={kartleggingresultatPdfLenke(
                    iaSak.orgnr,
                    iaSak.saksnummer,
                    spørreundersøkelse.id,
                )}
                icon={<FilePdfIcon fontSize="1.5rem" aria-hidden />}
                iconPosition="right"
                variant="secondary"
                size="small"
                onClick={() => {
                    loggEksportertTilPdf("kartlegging");
                }}
            >
                Last ned
            </Button>
        </>
    );
};

export default ResultatEksportVisning;
