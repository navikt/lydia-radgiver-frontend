import { Button, ExpansionCard } from "@navikt/ds-react";
import React, { useState } from "react";
import { åpneSpørreundersøkelseINyFane } from "../../../util/navigasjon";
import { SlettSpørreundersøkelseModal } from "./SlettSpørreundersøkelseModal";
import { StartSpørreundersøkelseModal } from "./StartSpørreundersøkelseModal";
import { FullførSpørreundersøkelseModal } from "./FullførSpørreundersøkelseModal";
import ResultatEksportVisning from "./ResultatEksportVisning";
import { FlyttTilAnnenProsess } from "./FlyttTilAnnenProsess";
import { SpørreundersøkelseStatusBadge } from "../../../components/Badge/SpørreundersøkelseStatusBadge";
import { ClockIcon, ExclamationmarkTriangleIcon, TrashIcon } from "@navikt/aksel-icons";
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
import { PubliserSpørreundersøkelse } from "./PubliserSpørreundersøkelse";
import { Spørreundersøkelse } from "../../../domenetyper/spørreundersøkelse";

import styles from './behovsvurderingCardHeaderInnhold.module.scss';
import ActionButtonsHvisSamarbeidIkkeFullført from "./ActionButtonHvisSamarbeidIkkeFullført";
import ForFåSvarRad from "./ForFåSvarRad";
import { erIFortid, lokalDatoMedKlokkeslett } from "../../../util/dato";
import { SpørreundersøkelseType } from "../../../domenetyper/spørreundersøkelseMedInnhold";




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
        spørreundersøkelse.publiseringStatus,
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
    const [sletterSpørreundersøkelse, setSletterSpørreundersøkelse] = useState(false);
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

    const { mutate: hentBehovsvurderingPåNytt, loading: lasterSpørreundersøkelser, validating: validererSpørreundersøkelser } = useHentSpørreundersøkelser(
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

    const { mutate: oppdaterSaksStatus, loading: lasterIaSakStatus, validating: validererIaSakStatus } = useHentIASaksStatus(
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
        if (sletterSpørreundersøkelse) return;
        setSletterSpørreundersøkelse(true);
        slettSpørreundersøkelse(
            iaSak.orgnr,
            iaSak.saksnummer,
            spørreundersøkelse.id,
        ).then(() => {
            hentBehovsvurderingPåNytt();
            oppdaterSaksStatus();
            setSlettSpørreundersøkelseModalÅpen(false);
            setSletterSpørreundersøkelse(false);
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
                    <ForFåSvarRad
                        spørreundersøkelse={spørreundersøkelse}
                        dato={dato}
                        setSlettSpørreundersøkelseModalÅpen={setSlettSpørreundersøkelseModalÅpen}
                        erLesebruker={brukerRolle === "Lesetilgang"}
                        loading={sletterSpørreundersøkelse || lasterSpørreundersøkelser || validererSpørreundersøkelser || lasterIaSakStatus || validererIaSakStatus}
                    />
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

    if (erIFortid(spørreundersøkelse.gyldigTilTidspunkt)) {
        return (
            <ErIFortidRad
                spørreundersøkelse={spørreundersøkelse}
                kanEndreSpørreundersøkelser={kanEndreSpørreundersøkelser}
                setSlettSpørreundersøkelseModalÅpen={setSlettSpørreundersøkelseModalÅpen}
                slettSpørreundersøkelseModalÅpen={slettSpørreundersøkelseModalÅpen}
                slettSpørreundersøkelsen={slettSpørreundersøkelsen}
                laster={sletterSpørreundersøkelse || lasterSpørreundersøkelser || validererSpørreundersøkelser || lasterIaSakStatus || validererIaSakStatus}
                dato={dato}
            />
        );
    }

    if (spørreundersøkelseStatus === "OPPRETTET") {
        return (
            <div className={styles.styledEmptyCardHeader}>
                <ActionButtonsHvisSamarbeidIkkeFullført>
                    {(iaSak.status === "KARTLEGGES" ||
                        iaSak.status === "VI_BISTÅR") &&
                        brukerRolle !== "Lesetilgang" ? (
                        <>
                            <Button
                                onClick={() =>
                                    setBekreftStartBehovsvurderingModalÅpen(
                                        true,
                                    )
                                }
                                disabled={erIFortid(spørreundersøkelse.gyldigTilTidspunkt)}
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
                                    loading={sletterSpørreundersøkelse || lasterSpørreundersøkelser || validererSpørreundersøkelser || lasterIaSakStatus || validererIaSakStatus}
                                />
                            )}
                            <GyldigTilTidspunkt input={spørreundersøkelse.gyldigTilTidspunkt} />
                        </>
                    ) : <ExpansionCard.Title className={styles.tittelUtenTopMargin}>Behovsvurdering</ExpansionCard.Title>}
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
                        brukerRolle !== "Lesetilgang" ? (
                        <>
                            <Button
                                variant="primary"
                                onClick={() =>
                                    åpneSpørreundersøkelseINyFane(
                                        spørreundersøkelse.id,
                                        "PÅBEGYNT",
                                    )
                                }
                                disabled={erIFortid(spørreundersøkelse.gyldigTilTidspunkt)}
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
                    ) : <ExpansionCard.Title className={styles.tittelUtenTopMargin}>Behovsvurdering</ExpansionCard.Title>}
                    <GyldigTilTidspunkt input={spørreundersøkelse.gyldigTilTidspunkt} />
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


export function GyldigTilTidspunkt(props: { input: Date }) {
    return <span className={styles.gyldigTilDato}><ClockIcon title="a11y-title" fontSize="1.5rem" /> Åpen frem til {lokalDatoMedKlokkeslett(props.input)}</span>;
}

export function IkkeGjennomførtFørFrist({ type }: { type: SpørreundersøkelseType }) {
    const penskrevetType = `${type.charAt(0).toUpperCase()}${type.slice(1).toLowerCase()}`;
    return (
        <span className={styles.headerLeftContent}>
            <ExpansionCard.Title className={styles.tittelUtenTopMargin}>{penskrevetType}</ExpansionCard.Title>
            <span className={styles.gyldigTilDato}><ExclamationmarkTriangleIcon aria-hidden fontSize="1.5rem" /> {penskrevetType}en ble ikke gjennomført innen 24 timer</span>
        </span>
    );
}

export function ErIFortidRad({
    spørreundersøkelse,
    kanEndreSpørreundersøkelser,
    setSlettSpørreundersøkelseModalÅpen,
    slettSpørreundersøkelseModalÅpen,
    slettSpørreundersøkelsen,
    laster,
    dato,
}: {
    spørreundersøkelse: Spørreundersøkelse;
    kanEndreSpørreundersøkelser: boolean;
    setSlettSpørreundersøkelseModalÅpen: React.Dispatch<React.SetStateAction<boolean>>;
    slettSpørreundersøkelseModalÅpen: boolean;
    slettSpørreundersøkelsen: () => void;
    laster: boolean;
    dato?: string;
}) {
    return (
        <div className={styles.styledEmptyCardHeader}>
            <IkkeGjennomførtFørFrist type={spørreundersøkelse.type} />
            <span className={styles.headerRightContent}>
                <ActionButtonsHvisSamarbeidIkkeFullført>
                    {kanEndreSpørreundersøkelser && (
                        <Button
                            iconPosition="right"
                            variant="secondary"
                            size="small"
                            icon={<TrashIcon aria-hidden />}
                            onClick={() => setSlettSpørreundersøkelseModalÅpen(true)}
                            loading={laster}
                        >
                            Slett
                        </Button>
                    )}
                </ActionButtonsHvisSamarbeidIkkeFullført>
                <div className={styles.behovsvurderingStatusWrapper}>
                    <SpørreundersøkelseStatusBadge
                        status={spørreundersøkelse.status}
                    />
                    <SlettSpørreundersøkelseModal
                        spørreundersøkelse={spørreundersøkelse}
                        erModalÅpen={slettSpørreundersøkelseModalÅpen}
                        lukkModal={() =>
                            setSlettSpørreundersøkelseModalÅpen(false)
                        }
                        slettSpørreundersøkelsen={slettSpørreundersøkelsen}
                    />
                </div>
                <span className={styles.behovsvurderingDato}>{dato}</span>
            </span>
        </div>
    );
};