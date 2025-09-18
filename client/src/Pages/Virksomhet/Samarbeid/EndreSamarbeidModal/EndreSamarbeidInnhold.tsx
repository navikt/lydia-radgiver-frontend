import { IaSakProsess } from "../../../../domenetyper/iaSakProsess";
import {
    Alert,
    BodyShort,
    Button,
    Detail,
    Heading,
    Modal,
    TextField,
} from "@navikt/ds-react";
import { IASakshendelseType } from "../../../../domenetyper/domenetyper";
import React, { useEffect, useState } from "react";
import { CheckmarkIcon, TrashIcon } from "@navikt/aksel-icons";
import { navnError } from "../NyttSamarbeidModal";
import {
    KanGjennomføreStatusendring,
    MuligSamarbeidsgandling,
} from "../../../../domenetyper/samarbeidsEndring";
import { EksternLenke } from "../../../../components/EksternLenke";
import { KeyedMutator } from "swr";
import styles from "./endresamarbeidmodal.module.scss";

export const MAX_LENGDE_SAMARBEIDSNAVN = 50;

export default function EndreSamarbeidModalInnhold({
    open,
    setOpen,
    samarbeid,
    samarbeidData,
    navn,
    setNavn,
    setLagreNavnVellykket,
    setKanGjennomføreResultat,
    hentSamarbeidPåNytt,
    nyHendelse,
    lagreNavnVellykket,
    setLasterKanGjennomføreHandling,
    setBekreftType,
    hentKanGjennomføreStatusendring,
    lasterKanGjennomføreHandling,
    setVelgHandlingModalÅpen,
}: {
    open: boolean;
    setOpen: React.Dispatch<React.SetStateAction<boolean>>;
    samarbeid: IaSakProsess;
    samarbeidData?: IaSakProsess[];
    navn: string;
    setNavn: React.Dispatch<React.SetStateAction<string>>;
    setLagreNavnVellykket: React.Dispatch<React.SetStateAction<boolean>>;
    setKanGjennomføreResultat: React.Dispatch<
        React.SetStateAction<KanGjennomføreStatusendring | undefined>
    >;
    hentSamarbeidPåNytt: KeyedMutator<IaSakProsess[]>;
    nyHendelse: (hendelsestype: IASakshendelseType) => Promise<void>;
    lagreNavnVellykket: boolean;
    setLasterKanGjennomføreHandling: React.Dispatch<
        React.SetStateAction<string | null>
    >;
    setBekreftType: React.Dispatch<
        React.SetStateAction<MuligSamarbeidsgandling | null>
    >;
    hentKanGjennomføreStatusendring: (
        handling: MuligSamarbeidsgandling,
    ) => Promise<KanGjennomføreStatusendring>;
    lasterKanGjennomføreHandling: string | null;
    setVelgHandlingModalÅpen: React.Dispatch<React.SetStateAction<boolean>>;
}) {
    const [antallTegn, setAntallTegn] = useState(samarbeid.navn?.length ?? 0);
    const navnErUbrukt =
        samarbeidData?.find(
            (s) => s.navn?.toLowerCase() === navn.toLowerCase(),
        ) === undefined;

    const avbrytEndring = () => {
        setOpen(false);
        setLagreNavnVellykket(false);
        setLasterKanGjennomføreHandling(null);
        setKanGjennomføreResultat(undefined);
        hentSamarbeidPåNytt().then(() => {
            setNavn(samarbeid.navn ?? "");
        });
    };

    const endreNavn = () => {
        nyHendelse("ENDRE_PROSESS").then(() => {
            setOpen(false);
        });
    };

    useEffect(() => {
        setNavn(samarbeid.navn ?? "");
        setAntallTegn(samarbeid.navn?.length ?? 0);
    }, [samarbeid]);

    useEffect(() => {
        setLagreNavnVellykket(false);
    }, [open]);

    return (
        <Modal
            className={styles.endreSamarbeidModal}
            open={open}
            onClose={() => {
                avbrytEndring();
            }}
            aria-label={"Administrer samarbeid"}
        >
            <Modal.Header closeButton={true}>
                <Heading size="medium">Administrer samarbeid</Heading>
            </Modal.Header>
            <Modal.Body>
                <div className={styles.slettFullførFlex}>
                    <Button
                        variant="primary"
                        size="small"
                        onClick={() => setVelgHandlingModalÅpen(true)}
                        icon={<CheckmarkIcon aria-hidden />}
                        loading={lasterKanGjennomføreHandling === "fullfores"}
                    >
                        Avslutt samarbeid
                    </Button>
                    <Button
                        icon={<TrashIcon title={`Slett "${samarbeid.navn}"`} />}
                        size="small"
                        variant="secondary-neutral"
                        title={`Slett "${samarbeid.navn}"`}
                        onClick={() => {
                            hentKanGjennomføreStatusendring("slettes").then(
                                () => {
                                    setBekreftType("slettes");
                                },
                            );
                        }}
                        loading={lasterKanGjennomføreHandling === "slettes"}
                    />
                </div>
                <div className={styles.endreSamarbeidModalInnhold}>
                    <BodyShort>
                        Her kan du endre navn på samarbeidet &quot;
                        {samarbeid.navn}&quot; Samarbeidsnavn skal beskrive den
                        avdelingen eller gruppen man samarbeider med. Navnet må
                        være det samme som virksomheten bruker selv.
                    </BodyShort>
                    <br />
                    <TextField
                        className={styles.textField}
                        maxLength={MAX_LENGDE_SAMARBEIDSNAVN}
                        size="small"
                        label="Navngi samarbeid"
                        value={navn}
                        onChange={(nyttnavn) => {
                            setNavn(nyttnavn.target.value);
                            setLagreNavnVellykket(false);
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
