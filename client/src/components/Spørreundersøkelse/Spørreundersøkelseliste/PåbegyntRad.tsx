import React from "react";
import { Button, ExpansionCard, HStack, VStack } from "@navikt/ds-react";
import { Spørreundersøkelse } from "../../../domenetyper/spørreundersøkelse";
import ActionButtonsHvisSamarbeidIkkeFullført from "../../../Pages/Virksomhet/Kartlegging/ActionButtonHvisSamarbeidIkkeFullført";
import { erIFortid } from "../../../util/dato";
import { åpneSpørreundersøkelseINyFane } from "../../../util/navigasjon";
import styles from "./spørreundersøkelsesliste.module.scss";
import { useSpørreundersøkelse } from "../SpørreundersøkelseContext";
import { TrashIcon } from "@navikt/aksel-icons";
import { FullførSpørreundersøkelseModal } from "../../../Pages/Virksomhet/Kartlegging/FullførSpørreundersøkelseModal";
import { GyldigTilTidspunkt } from "./Felles";
import { SpørreundersøkelseStatusBadge } from "../../Badge/SpørreundersøkelseStatusBadge";
import { SlettSpørreundersøkelseModal } from "../../../Pages/Virksomhet/Kartlegging/SlettSpørreundersøkelseModal";
import {
    avsluttSpørreundersøkelse,
    slettSpørreundersøkelse,
} from "../../../api/lydia-api/spørreundersøkelse";
import { useHentIASaksStatus } from "../../../api/lydia-api/sak";
import { FormatertSpørreundersøkelseType } from "./utils";

export default function PåbegyntRad({
    spørreundersøkelse,
    dato,
}: {
    spørreundersøkelse: Spørreundersøkelse;
    dato: string;
}) {
    const [
        bekreftFullførBehovsvurderingModalÅpen,
        setBekreftFullførBehovsvurderingModalÅpen,
    ] = React.useState(false);
    const [
        slettSpørreundersøkelseModalÅpen,
        setSlettSpørreundersøkelseModalÅpen,
    ] = React.useState(false);
    const [sletterSpørreundersøkelse, setSletterSpørreundersøkelse] =
        React.useState(false);

    const {
        iaSak,
        brukerRolle,
        kanEndreSpørreundersøkelser,
        hentSpørreundersøkelserPåNytt,
    } = useSpørreundersøkelse();
    const { mutate: oppdaterSaksStatus } = useHentIASaksStatus(
        iaSak.orgnr,
        iaSak.saksnummer,
    );

    const MINIMUM_ANTALL_DELTAKERE = 3;
    const deltakereSomHarFullført = 1; // TODO: Hent faktisk antall deltakere som har fullført fra spørreundersøkelsen
    const harNokDeltakere = deltakereSomHarFullført >= MINIMUM_ANTALL_DELTAKERE;

    const fullførSpørreundersøkelse = () => {
        avsluttSpørreundersøkelse(
            iaSak.orgnr,
            iaSak.saksnummer,
            spørreundersøkelse.id,
        ).then(() => {
            hentSpørreundersøkelserPåNytt?.();
            oppdaterSaksStatus();
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
            hentSpørreundersøkelserPåNytt?.();
            oppdaterSaksStatus();
            setSlettSpørreundersøkelseModalÅpen(false);
            setSletterSpørreundersøkelse(false);
        });
    };

    return (
        <VStack
            className={styles.styledEmptyCardHeader}
            justify="center"
            align="start"
        >
            <HStack
                justify="space-between"
                align="center"
                style={{ width: "100%" }}
            >
                <div className={styles.headerLeftContent}>
                    <ExpansionCard.Title>
                        <FormatertSpørreundersøkelseType
                            type={spørreundersøkelse.type}
                        />
                    </ExpansionCard.Title>
                    <ActionButtonsHvisSamarbeidIkkeFullført>
                        {(iaSak.status === "KARTLEGGES" ||
                            iaSak.status === "VI_BISTÅR") &&
                        brukerRolle !== "Lesetilgang" ? (
                            <>
                                <Button
                                    variant="primary"
                                    size="small"
                                    onClick={() =>
                                        åpneSpørreundersøkelseINyFane(
                                            spørreundersøkelse.id,
                                            "PÅBEGYNT",
                                        )
                                    }
                                    disabled={erIFortid(
                                        spørreundersøkelse.gyldigTilTidspunkt,
                                    )}
                                >
                                    Fortsett
                                </Button>
                                {kanEndreSpørreundersøkelser && (
                                    <>
                                        <Button
                                            variant="secondary"
                                            size="small"
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
                                            size="small"
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
                        ) : (
                            <ExpansionCard.Title
                                className={styles.tittelUtenTopMargin}
                            >
                                Behovsvurdering
                            </ExpansionCard.Title>
                        )}
                        {brukerRolle && brukerRolle !== "Lesetilgang" && (
                            <SlettSpørreundersøkelseModal
                                spørreundersøkelse={spørreundersøkelse}
                                erModalÅpen={slettSpørreundersøkelseModalÅpen}
                                lukkModal={() =>
                                    setSlettSpørreundersøkelseModalÅpen(false)
                                }
                                slettSpørreundersøkelsen={
                                    slettSpørreundersøkelsen
                                }
                            />
                        )}
                    </ActionButtonsHvisSamarbeidIkkeFullført>
                </div>
                <span className={styles.headerRightContent}>
                    <span className={styles.datovisning}>{dato}</span>
                    <SpørreundersøkelseStatusBadge
                        status={spørreundersøkelse.status}
                    />
                </span>
            </HStack>
            <GyldigTilTidspunkt input={spørreundersøkelse.gyldigTilTidspunkt} />
        </VStack>
    );
}
