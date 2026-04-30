import {
    Alert,
    BodyLong,
    Button,
    Detail,
    Modal,
    TextField,
} from "@navikt/ds-react";
import React from "react";
import { EksternLenke } from "@/components/EksternLenke";
import { IASak } from "@/domenetyper/domenetyper";
import { useHentSamarbeid } from "@features/kartlegging/api/spørreundersøkelse";
import {
    endreSamarbeidsNavnNyFlyt,
    useHentSisteSakNyFlyt,
    useHentSpesifikkSakNyFlyt,
} from "@features/sak/api/nyFlyt";
import { IaSakProsess } from "@features/sak/types/iaSakProsess";
import { MAX_LENGDE_SAMARBEIDSNAVN } from "../Samarbeid/EndreSamarbeidModal/EndreSamarbeidInnhold";
import styles from "./administrerSamarbeid.module.scss";

export default function EndreSamarbeidsnavnModal({
    ref,
    valgtSamarbeid,
    alleSamarbeid,
    iaSak,
}: {
    ref: React.RefObject<HTMLDialogElement | null>;
    valgtSamarbeid: IaSakProsess;
    alleSamarbeid?: IaSakProsess[];
    iaSak?: IASak;
}) {
    const [navn, setNavn] = React.useState(valgtSamarbeid.navn ?? "");
    const [lagreNavnVellykket, setLagreNavnVellykket] = React.useState(false);
    const [antallTegn, setAntallTegn] = React.useState(0);
    const navnErUbrukt =
        alleSamarbeid?.find((s) => s.navn === navn) === undefined;
    const { mutate: hentSisteSakPåNytt } = useHentSisteSakNyFlyt(iaSak?.orgnr);
    const { mutate: hentSpesifikkSakPåNytt } = useHentSpesifikkSakNyFlyt(
        iaSak?.orgnr,
        iaSak?.saksnummer,
    );
    const { mutate: hentSamarbeidPåNytt } = useHentSamarbeid(
        iaSak?.orgnr,
        iaSak?.saksnummer,
    );
    const endreNavn = async () => {
        if (!iaSak?.orgnr) return;
        try {
            await endreSamarbeidsNavnNyFlyt(iaSak.orgnr, valgtSamarbeid.id, {
                id: valgtSamarbeid.id,
                saksnummer: valgtSamarbeid.saksnummer,
                navn: navn,
                status: valgtSamarbeid.status,
            });
            setLagreNavnVellykket(true);
            ref.current?.close();
        } finally {
            hentSisteSakPåNytt();
            hentSpesifikkSakPåNytt();
            hentSamarbeidPåNytt();
        }
    };

    const avbrytEndring = () => {
        setNavn(valgtSamarbeid.navn ?? "");
        setLagreNavnVellykket(false);
        ref.current?.close();
    };

    React.useEffect(() => {
        setNavn(valgtSamarbeid.navn ?? "");
        setAntallTegn((valgtSamarbeid.navn ?? "").length);
    }, [valgtSamarbeid]);

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
                        valgtSamarbeid.navn ?? undefined,
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
                        navn === valgtSamarbeid.navn
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
