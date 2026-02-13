import { BodyShort, Button, Detail, Modal } from "@navikt/ds-react";
import React, { useState } from "react";
import { FilePdfIcon } from "@navikt/aksel-icons";
import { IASak } from "../../../domenetyper/domenetyper";
import { Spørreundersøkelse } from "../../../domenetyper/spørreundersøkelse";
import { loggEksportertTilPdf } from "../../../util/analytics-klient";
import { kartleggingresultatPdfLenke } from "../../../api/lydia-api/spørreundersøkelse";
import {
    formaterSpørreundersøkelsetype,
    FormatertSpørreundersøkelseType,
} from "../../../components/Spørreundersøkelse/Spørreundersøkelseliste/utils";
import { lokalDatoMedKlokkeslett } from "../../../util/dato";

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

    const lastNedTittel = `Last ned ${formaterSpørreundersøkelsetype(spørreundersøkelse.type, false)}sresultater som pdf`;

    return (
        <>
            <Modal
                aria-label={lastNedTittel}
                open={åpen}
                onClose={() => setÅpen(false)}
                header={{ heading: lastNedTittel }}
            >
                <Modal.Body>
                    <BodyShort>
                        Her kan du laste ned resultatene av{" "}
                        <FormatertSpørreundersøkelseType
                            type={spørreundersøkelse.type}
                            storForbokstav={false}
                        />
                        en for deling videre til arbeidsgiver.{" "}
                    </BodyShort>
                    <br />
                    <Detail>
                        Merk:{" "}
                        {formaterSpørreundersøkelsetype(
                            spørreundersøkelse.type,
                            true,
                        )}{" "}
                        opprettet{" "}
                        {lokalDatoMedKlokkeslett(
                            spørreundersøkelse.opprettetTidspunkt,
                        )}{" "}
                        blir journalført som et utgående dokument i Gosys.
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
