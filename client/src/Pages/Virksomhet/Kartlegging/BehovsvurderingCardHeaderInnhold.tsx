import { BodyShort, Button, ExpansionCard } from "@navikt/ds-react";
import React, { useState } from "react";
import { åpneSpørreundersøkelseINyFane } from "../../../util/navigasjon";
import { SlettSpørreundersøkelseModal } from "./SlettSpørreundersøkelseModal";
import { StartSpørreundersøkelseModal } from "./StartSpørreundersøkelseModal";
import { FullførSpørreundersøkelseModal } from "./FullførSpørreundersøkelseModal";
import ResultatEksportVisning from "./ResultatEksportVisning";
import { FlyttTilAnnenProsess } from "./FlyttTilAnnenProsess";
import { SpørreundersøkelseStatusBadge } from "../../../components/Badge/SpørreundersøkelseStatusBadge";
import { InformationSquareIcon, TrashIcon } from "@navikt/aksel-icons";
import {
    CardHeaderProps,
    useSpørreundersøkelse,
} from "../../../components/Spørreundersøkelse/SpørreundersøkelseContext";
import { useHentIASaksStatus } from "../../../api/lydia-api/sak";
import {
    avsluttSpørreundersøkelse,
    flyttSpørreundersøkelse,
    slettSpørreundersøkelse,
    startSpørreundersøkelse,
    useHentSpørreundersøkelser,
} from "../../../api/lydia-api/spørreundersøkelse";
import { SpørreundersøkelseMedInnholdVisning } from "./SpørreundersøkelseForhåndsvisningModal";
import { VisHvisSamarbeidErÅpent } from "../Samarbeid/SamarbeidContext";
import { PubliserSpørreundersøkelse } from "./PubliserSpørreundersøkelse";
import { Spørreundersøkelse } from "../../../domenetyper/spørreundersøkelse";

import styles from './behovsvurderingCardHeaderInnhold.module.scss';


function ActionButtonsHvisSamarbeidIkkeFullført({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <VisHvisSamarbeidErÅpent>
            <div className={styles.actionButtonContainer}>{children}</div>
        </VisHvisSamarbeidErÅpent>
    );
}

function usePollingAvBehovsvurderingVedAvsluttetStatus(
    spørreundersøkelseStatus: string,
    spørreundersøkelse: Spørreundersøkelse,
    hentBehovsvurderingPåNytt: () => void,
) {
    const [henterBehovsvurderingPånytt, setHenterBehovsvurderingPåNytt] =
        useState(false);
    const [forsøkPåÅHenteBehovsvurdering, setForsøkPåÅHenteBehovsvurdering] =
        useState(0);

    React.useEffect(() => {
        if (spørreundersøkelseStatus === "AVSLUTTET") {
            if (spørreundersøkelse.publiseringStatus === "OPPRETTET") {
                if (
                    !henterBehovsvurderingPånytt &&
                    forsøkPåÅHenteBehovsvurdering < 10
                ) {
                    setHenterBehovsvurderingPåNytt(true);
                    setForsøkPåÅHenteBehovsvurdering(
                        forsøkPåÅHenteBehovsvurdering + 1,
                    );
                    setTimeout(
                        () => {
                            hentBehovsvurderingPåNytt();
                            setHenterBehovsvurderingPåNytt(false);
                        },
                        (forsøkPåÅHenteBehovsvurdering + 1) * 2000,
                    );
                }
            }
        }
    }, [
        spørreundersøkelseStatus,
        hentBehovsvurderingPåNytt,
        henterBehovsvurderingPånytt,
    ]);

    return { henterBehovsvurderingPånytt, forsøkPåÅHenteBehovsvurdering };
}

export const BehovsvurderingCardHeaderInnhold = ({
    spørreundersøkelse,
    dato,
}: CardHeaderProps) => {
    const [
        bekreftFullførBehovsvurderingModalÅpen,
        setBekreftFullførBehovsvurderingModalÅpen,
    ] = useState(false);
    const [forhåndsvisModalÅpen, setForhåndsvisModalÅpen] = useState(false);
    const [
        slettSpørreundersøkelseModalÅpen,
        setSlettSpørreundersøkelseModalÅpen,
    ] = useState(false);
    const [
        bekreftStartBehovsvurderingModalÅpen,
        setBekreftStartBehovsvurderingModalÅpen,
    ] = useState(false);

    const [erIEksportMode, setErIEksportMode] = useState(false);

    const MINIMUM_ANTALL_DELTAKERE = 3;
    const deltakereSomHarFullført = 1;
    const harNokDeltakere = deltakereSomHarFullført >= MINIMUM_ANTALL_DELTAKERE;
    const spørreundersøkelseStatus = spørreundersøkelse.status;

    const { iaSak, brukerRolle, samarbeid, kanEndreSpørreundersøkelser } =
        useSpørreundersøkelse();

    const { mutate: hentBehovsvurderingPåNytt } = useHentSpørreundersøkelser(
        iaSak.orgnr,
        iaSak.saksnummer,
        samarbeid.id,
        "BEHOVSVURDERING",
    );

    const { henterBehovsvurderingPånytt, forsøkPåÅHenteBehovsvurdering } =
        usePollingAvBehovsvurderingVedAvsluttetStatus(
            spørreundersøkelseStatus,
            spørreundersøkelse,
            hentBehovsvurderingPåNytt,
        );

    const { mutate: oppdaterSaksStatus } = useHentIASaksStatus(
        iaSak.orgnr,
        iaSak.saksnummer,
    );

    const flyttTilValgtSamarbeid = (samarbeidId: number) => {
        flyttSpørreundersøkelse(
            iaSak.orgnr,
            iaSak.saksnummer,
            samarbeidId,
            spørreundersøkelse.id,
        ).then(() => hentBehovsvurderingPåNytt?.());
    };

    const startSpørreundersøkelsen = () => {
        startSpørreundersøkelse(
            iaSak.orgnr,
            iaSak.saksnummer,
            spørreundersøkelse.id,
        ).then(() => {
            hentBehovsvurderingPåNytt();
        });
    };

    const slettSpørreundersøkelsen = () => {
        slettSpørreundersøkelse(
            iaSak.orgnr,
            iaSak.saksnummer,
            spørreundersøkelse.id,
        ).then(() => {
            hentBehovsvurderingPåNytt();
            oppdaterSaksStatus();
            setSlettSpørreundersøkelseModalÅpen(false);
        });
    };

    const fullførSpørreundersøkelse = () => {
        avsluttSpørreundersøkelse(
            iaSak.orgnr,
            iaSak.saksnummer,
            spørreundersøkelse.id,
        ).then(() => {
            hentBehovsvurderingPåNytt();
            oppdaterSaksStatus();
        });
    };

    if (spørreundersøkelseStatus === "SLETTET") {
        return null;
    }

    if (spørreundersøkelseStatus === "AVSLUTTET") {
        if (!spørreundersøkelse.harMinstEttResultat) {
            return (
                <>
                    <ForFåSvarRad spørreundersøkelse={spørreundersøkelse} dato={dato} setSlettSpørreundersøkelseModalÅpen={setSlettSpørreundersøkelseModalÅpen} />
                    <SlettSpørreundersøkelseModal
                        spørreundersøkelse={spørreundersøkelse}
                        erModalÅpen={slettSpørreundersøkelseModalÅpen}
                        lukkModal={() =>
                            setSlettSpørreundersøkelseModalÅpen(false)
                        }
                        slettSpørreundersøkelsen={slettSpørreundersøkelsen}
                    />
                </>
            );
        }
        return (
            <ExpansionCard.Header className={styles.styledExpansionCardHeader}>
                <ExpansionCard.Title>Behovsvurdering</ExpansionCard.Title>
                <span className={styles.headerRightContent}>
                    <ActionButtonsHvisSamarbeidIkkeFullført>
                        {kanEndreSpørreundersøkelser && (
                            <>
                                {spørreundersøkelse.publiseringStatus ===
                                    "IKKE_PUBLISERT" && (
                                        <FlyttTilAnnenProsess
                                            gjeldendeSamarbeid={samarbeid}
                                            iaSak={iaSak}
                                            flyttTilValgtSamarbeid={
                                                flyttTilValgtSamarbeid
                                            }
                                            dropdownSize="small"
                                        />
                                    )}
                                <PubliserSpørreundersøkelse
                                    spørreundersøkelse={spørreundersøkelse}
                                    hentBehovsvurderingPåNytt={
                                        hentBehovsvurderingPåNytt
                                    }
                                    pollerPåStatus={
                                        henterBehovsvurderingPånytt ||
                                        forsøkPåÅHenteBehovsvurdering < 10
                                    }
                                />
                            </>
                        )}
                        <ResultatEksportVisning
                            iaSak={iaSak}
                            spørreundersøkelse={spørreundersøkelse}
                            erIEksportMode={erIEksportMode}
                            setErIEksportMode={setErIEksportMode}
                        />
                    </ActionButtonsHvisSamarbeidIkkeFullført>
                    <div className={styles.behovsvurderingStatusWrapper}>
                        <SpørreundersøkelseStatusBadge
                            status={spørreundersøkelse.status}
                        />
                    </div>
                    <span className={styles.behovsvurderingDato}>{dato}</span>
                </span>
            </ExpansionCard.Header>
        );
    }

    if (spørreundersøkelseStatus === "OPPRETTET") {
        return (
            <div className={styles.styledEmptyCardHeader}>
                <ActionButtonsHvisSamarbeidIkkeFullført>
                    {(iaSak.status === "KARTLEGGES" ||
                        iaSak.status === "VI_BISTÅR") &&
                        brukerRolle !== "Lesetilgang" && (
                            <>
                                <Button
                                    onClick={() =>
                                        setBekreftStartBehovsvurderingModalÅpen(
                                            true,
                                        )
                                    }
                                >
                                    Start
                                </Button>
                                <Button
                                    variant="secondary"
                                    onClick={() =>
                                        setForhåndsvisModalÅpen(true)
                                    }
                                >
                                    Forhåndsvis
                                </Button>
                                {kanEndreSpørreundersøkelser && (
                                    <Button
                                        variant="secondary-neutral"
                                        onClick={() =>
                                            setSlettSpørreundersøkelseModalÅpen(
                                                true,
                                            )
                                        }
                                        icon={<TrashIcon aria-hidden />}
                                        aria-label="Slett behovsvurdering"
                                    />
                                )}
                            </>
                        )}
                    <StartSpørreundersøkelseModal
                        spørreundersøkelse={spørreundersøkelse}
                        erModalÅpen={bekreftStartBehovsvurderingModalÅpen}
                        lukkModal={() =>
                            setBekreftStartBehovsvurderingModalÅpen(false)
                        }
                        startSpørreundersøkelsen={startSpørreundersøkelsen}
                    />
                    <SpørreundersøkelseMedInnholdVisning
                        spørreundersøkelse={spørreundersøkelse}
                        erModalÅpen={forhåndsvisModalÅpen}
                        spørreundersøkelseid={spørreundersøkelse.id}
                        lukkModal={() => setForhåndsvisModalÅpen(false)}
                    />
                    {brukerRolle && (
                        <SlettSpørreundersøkelseModal
                            spørreundersøkelse={spørreundersøkelse}
                            erModalÅpen={slettSpørreundersøkelseModalÅpen}
                            lukkModal={() =>
                                setSlettSpørreundersøkelseModalÅpen(false)
                            }
                            slettSpørreundersøkelsen={slettSpørreundersøkelsen}
                        />
                    )}
                </ActionButtonsHvisSamarbeidIkkeFullført>
                <span className={styles.headerRightContent}>
                    <div className={styles.behovsvurderingStatusWrapper}>
                        <SpørreundersøkelseStatusBadge
                            status={spørreundersøkelse.status}
                        />
                    </div>
                    <span className={styles.behovsvurderingDato}>{dato}</span>
                </span>
            </div>
        );
    }

    if (spørreundersøkelseStatus === "PÅBEGYNT") {
        return (
            <div className={styles.styledEmptyCardHeader}>
                <ActionButtonsHvisSamarbeidIkkeFullført>
                    {(iaSak.status === "KARTLEGGES" ||
                        iaSak.status === "VI_BISTÅR") &&
                        brukerRolle !== "Lesetilgang" && (
                            <>
                                <Button
                                    variant="primary"
                                    onClick={() =>
                                        åpneSpørreundersøkelseINyFane(
                                            spørreundersøkelse.id,
                                            "PÅBEGYNT",
                                        )
                                    }
                                >
                                    Fortsett
                                </Button>
                                {kanEndreSpørreundersøkelser && (
                                    <>
                                        <Button
                                            variant="secondary"
                                            onClick={() =>
                                                setBekreftFullførBehovsvurderingModalÅpen(
                                                    true,
                                                )
                                            }
                                        >
                                            Fullfør
                                        </Button>
                                        <Button
                                            variant="secondary-neutral"
                                            onClick={() =>
                                                setSlettSpørreundersøkelseModalÅpen(
                                                    true,
                                                )
                                            }
                                            icon={<TrashIcon aria-hidden />}
                                            aria-label="Slett behovsvurdering"
                                        />
                                    </>
                                )}
                                <FullførSpørreundersøkelseModal
                                    harNokDeltakere={harNokDeltakere}
                                    erModalÅpen={
                                        bekreftFullførBehovsvurderingModalÅpen
                                    }
                                    lukkModal={() =>
                                        setBekreftFullførBehovsvurderingModalÅpen(
                                            false,
                                        )
                                    }
                                    fullførSpørreundersøkelse={
                                        fullførSpørreundersøkelse
                                    }
                                />
                            </>
                        )}
                    {brukerRolle && (
                        <SlettSpørreundersøkelseModal
                            spørreundersøkelse={spørreundersøkelse}
                            erModalÅpen={slettSpørreundersøkelseModalÅpen}
                            lukkModal={() =>
                                setSlettSpørreundersøkelseModalÅpen(false)
                            }
                            slettSpørreundersøkelsen={slettSpørreundersøkelsen}
                        />
                    )}
                </ActionButtonsHvisSamarbeidIkkeFullført>
                <span className={styles.headerRightContent}>
                    <div className={styles.behovsvurderingStatusWrapper}>
                        <SpørreundersøkelseStatusBadge
                            status={spørreundersøkelse.status}
                        />
                    </div>
                    <span className={styles.behovsvurderingDato}>{dato}</span>
                </span>
            </div>
        );
    }
};


function ForFåSvarRad({ spørreundersøkelse, dato, setSlettSpørreundersøkelseModalÅpen }: CardHeaderProps & { setSlettSpørreundersøkelseModalÅpen: React.Dispatch<React.SetStateAction<boolean>> }) {
    return (
        <div className={styles.styledEmptyCardHeader}>
            <span className={styles.headerLeftContent}>
                <ExpansionCard.Title>Behovsvurdering</ExpansionCard.Title>
                <InformationSquareIcon fontSize="1.5rem" aria-hidden />
                <BodyShort>Behovsvurderingen har for få besvarelser til å vise svarresultater.</BodyShort>
            </span>
            <span className={styles.headerRightContent}>
                <ActionButtonsHvisSamarbeidIkkeFullført>
                    <Button
                        variant="secondary"
                        size="small"
                        iconPosition="right"
                        onClick={() => setSlettSpørreundersøkelseModalÅpen(true)}
                        icon={<TrashIcon aria-hidden />}
                    >
                        Slett
                    </Button>
                </ActionButtonsHvisSamarbeidIkkeFullført>
                <div className={styles.behovsvurderingStatusWrapper}>
                    <SpørreundersøkelseStatusBadge
                        status={spørreundersøkelse.status}
                    />
                </div>
                <span className={styles.behovsvurderingDato}>{dato}</span>
            </span>
        </div>
    );
}
