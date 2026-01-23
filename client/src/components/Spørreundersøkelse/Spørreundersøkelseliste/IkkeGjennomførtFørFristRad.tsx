import React from "react";
import { Button, ExpansionCard, HStack, VStack } from "@navikt/ds-react";
import { Spørreundersøkelse } from "../../../domenetyper/spørreundersøkelse";
import styles from "./spørreundersøkelsesliste.module.scss";
import { SpørreundersøkelseStatusBadge } from "../../Badge/SpørreundersøkelseStatusBadge";
import { SlettSpørreundersøkelseModal } from "../../../Pages/Virksomhet/Kartlegging/SlettSpørreundersøkelseModal";
import ActionButtonsHvisSamarbeidIkkeFullført from "../../../Pages/Virksomhet/Kartlegging/ActionButtonHvisSamarbeidIkkeFullført";
import { ExclamationmarkTriangleIcon, TrashIcon } from "@navikt/aksel-icons";
import { FormatertSpørreundersøkelseType } from "./utils";

export default function IkkeGjennomførtFørFristRad({
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
    setSlettSpørreundersøkelseModalÅpen: React.Dispatch<
        React.SetStateAction<boolean>
    >;
    slettSpørreundersøkelseModalÅpen: boolean;
    slettSpørreundersøkelsen: () => void;
    laster: boolean;
    dato?: string;
}) {
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
                <span className={styles.headerLeftContent}>
                    <ExpansionCard.Title className={styles.tittelUtenTopMargin}>
                        <FormatertSpørreundersøkelseType
                            type={spørreundersøkelse.type}
                        />
                    </ExpansionCard.Title>
                </span>
                <span className={styles.headerRightContent}>
                    <ActionButtonsHvisSamarbeidIkkeFullført>
                        {kanEndreSpørreundersøkelser && (
                            <Button
                                iconPosition="right"
                                variant="secondary"
                                size="small"
                                icon={<TrashIcon aria-hidden />}
                                onClick={() =>
                                    setSlettSpørreundersøkelseModalÅpen(true)
                                }
                                loading={laster}
                            >
                                Slett
                            </Button>
                        )}
                    </ActionButtonsHvisSamarbeidIkkeFullført>
                    <span className={styles.datovisning}>{dato}</span>
                    <div className={styles.kartleggingStatusWrapper}>
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
                </span>
            </HStack>
            <span className={styles.infolinje}>
                <ExclamationmarkTriangleIcon aria-hidden fontSize="1.5rem" />{" "}
                <FormatertSpørreundersøkelseType
                    type={spørreundersøkelse.type}
                />
                en ble ikke gjennomført innen 24 timer
            </span>
        </VStack>
    );
}
