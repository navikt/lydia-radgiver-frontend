import { BodyShort, Button, Detail, Modal } from "@navikt/ds-react";
import React, { useState } from "react";
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
    const [åpen, setÅpen] = useState(false);

    return (
        <>
            <Modal
                aria-label="Last ned kartleggingsresultater som pdf"
                open={åpen}
                onClose={() => setÅpen(false)}
                header={{ heading: "Last ned kartleggingsresultater som pdf" }}
            >
                <Modal.Body>
                    <BodyShort>
                        Her kan du laste ned resultatene av kartleggingen for
                        deling videre til arbeidsgiver.
                    </BodyShort>
                    <br />
                    <Detail>
                        Merk: Dokumentet blir journalført som et utgående
                        dokument i Gosys.
                    </Detail>
                </Modal.Body>
                <Modal.Footer>
                    <Button
                        as="a"
                        href={kartleggingresultatPdfLenke(
                            iaSak.orgnr,
                            iaSak.saksnummer,
                            spørreundersøkelse.id,
                        )}
                        onClick={() => {
                            setÅpen(false);
                        }}
                    >
                        Last ned
                    </Button>
                    <Button
                        variant="secondary"
                        onClick={() => {
                            setÅpen(false);
                        }}
                    >
                        Avbryt
                    </Button>
                </Modal.Footer>
            </Modal>
            <Button
                icon={<FilePdfIcon fontSize="1.5rem" aria-hidden />}
                iconPosition="right"
                variant="secondary"
                size="small"
                onClick={() => {
                    loggEksportertTilPdf("kartlegging");
                    setÅpen(true);
                }}
            >
                Last ned
            </Button>
        </>
    );
};

export default ResultatEksportVisning;
