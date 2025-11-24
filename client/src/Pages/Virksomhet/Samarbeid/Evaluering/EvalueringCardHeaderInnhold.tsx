import { Button, ExpansionCard } from "@navikt/ds-react";
import React, { useState } from "react";
import { åpneSpørreundersøkelseINyFane } from "../../../../util/navigasjon";
import { SlettSpørreundersøkelseModal } from "../../Kartlegging/SlettSpørreundersøkelseModal";
import { StartSpørreundersøkelseModal } from "../../Kartlegging/StartSpørreundersøkelseModal";
import { FullførSpørreundersøkelseModal } from "../../Kartlegging/FullførSpørreundersøkelseModal";
import ResultatEksportVisning from "../../Kartlegging/ResultatEksportVisning";
import { SpørreundersøkelseStatusBadge } from "../../../../components/Badge/SpørreundersøkelseStatusBadge";
import { TrashIcon } from "@navikt/aksel-icons";
import {
    CardHeaderProps,
    useSpørreundersøkelse,
} from "../../../../components/Spørreundersøkelse/SpørreundersøkelseContext";
import { useHentIASaksStatus } from "../../../../api/lydia-api/sak";
import {
    avsluttSpørreundersøkelse,
    slettSpørreundersøkelse,
    startSpørreundersøkelse,
    useHentSpørreundersøkelser,
} from "../../../../api/lydia-api/spørreundersøkelse";
import { SpørreundersøkelseMedInnholdVisning } from "../../Kartlegging/SpørreundersøkelseForhåndsvisningModal";
import { VisHvisSamarbeidErÅpent } from "../SamarbeidContext";
import styles from "./evaluering.module.scss";
import ForFåSvarRad from "../../../../components/Spørreundersøkelse/Spørreundersøkelseliste/ForFåSvarRad";
import { ErIFortidRad, GyldigTilTidspunkt } from "../../Kartlegging/BehovsvurderingCardHeaderInnhold";
import { erIFortid } from "../../../../util/dato";
import { PubliserSpørreundersøkelse } from "../../Kartlegging/PubliserSpørreundersøkelse";
import { usePollingAvKartleggingVedAvsluttetStatus } from "../../../../util/usePollingAvKartleggingVedAvsluttetStatus";

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

export const EvalueringCardHeaderInnhold = ({
    spørreundersøkelse,
    dato,
}: CardHeaderProps) => {
    const [
        bekreftFullførKartleggingModalÅpen,
        setBekreftFullførKartleggingModalÅpen,
    ] = useState(false);
    const [sletterSpørreundersøkelse, setSletterSpørreundersøkelse] = useState(false);

    const [forhåndsvisModalÅpen, setForhåndsvisModalÅpen] = useState(false);
    const [
        slettSpørreundersøkelseModalÅpen,
        setSlettSpørreundersøkelseModalÅpen,
    ] = useState(false);
    const [
        bekreftStartKartleggingModalÅpen,
        setBekreftStartKartleggingModalÅpen,
    ] = useState(false);

    const [erIEksportMode, setErIEksportMode] = useState(false);

    const MINIMUM_ANTALL_DELTAKERE = 3;
    const deltakereSomHarFullført = 1;
    const harNokDeltakere = deltakereSomHarFullført >= MINIMUM_ANTALL_DELTAKERE;
    const spørreundersøkelseStatus = spørreundersøkelse.status;

    const { iaSak, brukerRolle, samarbeid, kanEndreSpørreundersøkelser } =
        useSpørreundersøkelse();
    const { mutate: muterEvalueringer, loading: lasterSpørreundersøkelser, validating: validererSpørreundersøkelser } = useHentSpørreundersøkelser(
        iaSak.orgnr,
        iaSak.saksnummer,
        samarbeid.id,
        "EVALUERING",
    );


    const { henterKartleggingPånytt, forsøkPåÅHenteKartlegging } =
        usePollingAvKartleggingVedAvsluttetStatus(
            spørreundersøkelseStatus,
            spørreundersøkelse,
            muterEvalueringer,
        );

    const { mutate: oppdaterSaksStatus, loading: lasterIaSakStatus, validating: validererIaSakStatus } = useHentIASaksStatus(
        iaSak.orgnr,
        iaSak.saksnummer,
    );

    const startEvaluering = () => {
        startSpørreundersøkelse(
            iaSak.orgnr,
            iaSak.saksnummer,
            spørreundersøkelse.id,
        ).then(() => {
            muterEvalueringer();
        });
    };

    const slettEvaluering = () => {
        if (sletterSpørreundersøkelse) return;
        setSletterSpørreundersøkelse(true);
        slettSpørreundersøkelse(
            iaSak.orgnr,
            iaSak.saksnummer,
            spørreundersøkelse.id,
        ).then(() => {
            muterEvalueringer();
            oppdaterSaksStatus();
            setSlettSpørreundersøkelseModalÅpen(false);
            setSletterSpørreundersøkelse(false);
        });
    };

    const avsluttEvaluering = () => {
        avsluttSpørreundersøkelse(
            iaSak.orgnr,
            iaSak.saksnummer,
            spørreundersøkelse.id,
        ).then(() => {
            muterEvalueringer();
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
                        slettSpørreundersøkelsen={slettEvaluering}
                    />
                </>
            );
        }
        return (
            <ExpansionCard.Header
                className={styles.avsluttetEvalueringCardHeader}
            >
                <ExpansionCard.Title>Evaluering</ExpansionCard.Title>
                <span className={styles.avsluttetEvalueringHeaderRightContent}>
                    <ActionButtonsHvisSamarbeidIkkeFullført>
                        {kanEndreSpørreundersøkelser && (
                            <PubliserSpørreundersøkelse
                                type="EVALUERING"
                                spørreundersøkelse={spørreundersøkelse}
                                hentBehovsvurderingPåNytt={
                                    muterEvalueringer
                                }
                                pollerPåStatus={
                                    henterKartleggingPånytt ||
                                    forsøkPåÅHenteKartlegging < 10
                                }
                            />
                        )}
                        <ResultatEksportVisning
                            iaSak={iaSak}
                            spørreundersøkelse={spørreundersøkelse}
                            erIEksportMode={erIEksportMode}
                            setErIEksportMode={setErIEksportMode}
                        />
                    </ActionButtonsHvisSamarbeidIkkeFullført>
                    <div className={styles.kartleggingStatusWrapper}>
                        <SpørreundersøkelseStatusBadge
                            status={spørreundersøkelse.status}
                        />
                    </div>
                    <span className={styles.kartleggingDato}>{dato}</span>
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
                slettSpørreundersøkelsen={slettEvaluering}
                laster={sletterSpørreundersøkelse || lasterSpørreundersøkelser || validererSpørreundersøkelser || lasterIaSakStatus || validererIaSakStatus}
                dato={dato}
            />
        );
    }

    if (spørreundersøkelseStatus === "OPPRETTET") {
        return (
            <div className={styles.evalueringCardHeader}>
                <ActionButtonsHvisSamarbeidIkkeFullført>
                    {(iaSak.status === "KARTLEGGES" ||
                        iaSak.status === "VI_BISTÅR") &&
                        brukerRolle !== "Lesetilgang" ? (
                        <>
                            <Button
                                variant="primary"
                                onClick={() =>
                                    setBekreftStartKartleggingModalÅpen(
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
                                    loading={sletterSpørreundersøkelse || lasterSpørreundersøkelser || validererSpørreundersøkelser || lasterIaSakStatus || validererIaSakStatus}
                                />
                            )}
                            <GyldigTilTidspunkt input={spørreundersøkelse.gyldigTilTidspunkt} />
                        </>
                    ) : <ExpansionCard.Title className={styles.tittelUtenTopMargin}>Evaluering</ExpansionCard.Title>}
                    <StartSpørreundersøkelseModal
                        spørreundersøkelse={spørreundersøkelse}
                        erModalÅpen={bekreftStartKartleggingModalÅpen}
                        lukkModal={() =>
                            setBekreftStartKartleggingModalÅpen(false)
                        }
                        startSpørreundersøkelsen={startEvaluering}
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
                            slettSpørreundersøkelsen={slettEvaluering}
                        />
                    )}
                </ActionButtonsHvisSamarbeidIkkeFullført>
                <span className={styles.evalueringHeaderRightContent}>
                    <div className={styles.kartleggingStatusWrapper}>
                        <SpørreundersøkelseStatusBadge
                            status={spørreundersøkelse.status}
                        />
                    </div>
                    <span className={styles.kartleggingDato}>{dato}</span>
                </span>
            </div>
        );
    }

    if (spørreundersøkelseStatus === "PÅBEGYNT") {
        return (
            <div className={styles.evalueringCardHeader}>
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
                            >
                                Fortsett
                            </Button>
                            {kanEndreSpørreundersøkelser && (
                                <>
                                    <Button
                                        variant="secondary"
                                        onClick={() =>
                                            setBekreftFullførKartleggingModalÅpen(
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
                                    bekreftFullførKartleggingModalÅpen
                                }
                                lukkModal={() =>
                                    setBekreftFullførKartleggingModalÅpen(
                                        false,
                                    )
                                }
                                fullførSpørreundersøkelse={
                                    avsluttEvaluering
                                }
                            />
                        </>
                    ) : <ExpansionCard.Title className={styles.tittelUtenTopMargin}>Evaluering</ExpansionCard.Title>}
                    <GyldigTilTidspunkt input={spørreundersøkelse.gyldigTilTidspunkt} />
                    {brukerRolle && (
                        <SlettSpørreundersøkelseModal
                            spørreundersøkelse={spørreundersøkelse}
                            erModalÅpen={slettSpørreundersøkelseModalÅpen}
                            lukkModal={() =>
                                setSlettSpørreundersøkelseModalÅpen(false)
                            }
                            slettSpørreundersøkelsen={slettEvaluering}
                        />
                    )}
                </ActionButtonsHvisSamarbeidIkkeFullført>
                <span className={styles.evalueringHeaderRightContent}>
                    <div className={styles.kartleggingStatusWrapper}>
                        <SpørreundersøkelseStatusBadge
                            status={spørreundersøkelse.status}
                        />
                    </div>
                    <span className={styles.kartleggingDato}>{dato}</span>
                </span>
            </div>
        );
    }
};
