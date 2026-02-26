import React from "react";
import {
    Alert,
    BodyLong,
    Button,
    Detail,
    Modal,
    TextField,
} from "@navikt/ds-react";
import { MAX_LENGDE_SAMARBEIDSNAVN } from "../../../Virksomhet/Samarbeid/EndreSamarbeidModal/EndreSamarbeidInnhold";
import styles from "./administrerSamarbeid.module.scss";
import { EksternLenke } from "../../../../components/EksternLenke";
import { IaSakProsess } from "../../../../domenetyper/iaSakProsess";

export default function EndreSamarbeidsnavnModal({
    ref,
    samarbeid,
    alleSamarbeid,
}: {
    ref: React.RefObject<HTMLDialogElement | null>;
    samarbeid: IaSakProsess;
    alleSamarbeid?: IaSakProsess[];
}) {
    const [navn, setNavn] = React.useState(samarbeid.navn ?? "");
    const [lagreNavnVellykket, setLagreNavnVellykket] = React.useState(false);
    const [antallTegn, setAntallTegn] = React.useState(0);
    const navnErUbrukt =
        alleSamarbeid?.find((s) => s.navn === navn) === undefined;
    const endreNavn = () => {
        // TODO: Ta i bruk API her når det er klart.
        alert("Endre navn til: " + navn);
        setLagreNavnVellykket(true);
        ref.current?.close();
    };

    const avbrytEndring = () => {
        setNavn(samarbeid.navn ?? "");
        setLagreNavnVellykket(false);
        ref.current?.close();
    };

    return (
        <Modal
            ref={ref}
            header={{ heading: "Endre samarbeidsnavn" }}
            className={styles.endreSamarbeidsnavnModal}
        >
            <Modal.Body>
                <BodyLong>
                    Samarbeidsnavn skal beskrive den avdelingen eller gruppen
                    man samarbeider med. Navnet må være det samme som
                    virksomheten bruker selv.
                </BodyLong>
                <TextField
                    className={styles.textField}
                    maxLength={MAX_LENGDE_SAMARBEIDSNAVN}
                    size="small"
                    label="Navngi samarbeid"
                    value={navn}
                    onChange={(nyttnavn) => {
                        setNavn(nyttnavn.target.value);
                        setAntallTegn(nyttnavn.target.value.length);
                    }}
                    error={navnError(
                        navn,
                        navnErUbrukt,
                        samarbeid.navn ?? undefined,
                    )}
                    onKeyDown={(event) => {
                        // Submit på enter.
                        if (event.key === "Enter" && navnErUbrukt) {
                            endreNavn();
                        }
                    }}
                    hideLabel
                />
                <div className={styles.detaljer}>
                    <Detail>
                        <b>
                            Husk, aldri skriv{" "}
                            <EksternLenke
                                href="https://www.datatilsynet.no/rettigheter-og-plikter/personopplysninger/"
                                inlineText
                            >
                                personopplysninger
                            </EksternLenke>
                            .
                        </b>
                    </Detail>
                    <Detail>
                        {antallTegn}/{MAX_LENGDE_SAMARBEIDSNAVN} tegn
                    </Detail>
                </div>
            </Modal.Body>
            <Modal.Footer>
                <Button
                    variant="primary"
                    onClick={() => {
                        endreNavn();
                    }}
                    disabled={
                        !navnErUbrukt ||
                        navn.length === 0 ||
                        navn === samarbeid.navn
                    }
                >
                    Lagre
                </Button>
                <Button
                    variant="secondary"
                    onClick={() => {
                        avbrytEndring();
                    }}
                >
                    Avbryt
                </Button>
                {lagreNavnVellykket && (
                    <div style={{ display: "flex", alignItems: "center" }}>
                        <Alert inline variant="success" size="small">
                            Lagret
                        </Alert>
                    </div>
                )}
            </Modal.Footer>
        </Modal>
    );
}

export function navnError(
    navn: string,
    navnErUbrukt: boolean,
    eksisterendeNavn?: string,
) {
    if (navn === "") {
        return "Navnet kan ikke være tomt";
    }
    if (!navnErUbrukt && eksisterendeNavn !== navn) {
        return "Navnet er allerede i bruk";
    }
    return undefined;
}
