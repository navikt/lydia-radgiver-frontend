import { ExpansionCard } from "@navikt/ds-react";
import React from "react";
import { flyttSpørreundersøkelse } from "@/api/lydia-api/spørreundersøkelse";
import { SpørreundersøkelseStatusBadge } from "@/components/Badge/SpørreundersøkelseStatusBadge";
import { Spørreundersøkelse } from "@/domenetyper/spørreundersøkelse";
import ActionButtonsHvisSamarbeidIkkeFullført from "@/Pages/Virksomhet/Kartlegging/ActionButtonHvisSamarbeidIkkeFullført";
import { FlyttTilAnnenProsess } from "@/Pages/Virksomhet/Kartlegging/FlyttTilAnnenProsess";
import { PubliserSpørreundersøkelse } from "@/Pages/Virksomhet/Kartlegging/PubliserSpørreundersøkelse";
import ResultatEksportVisning from "@/Pages/Virksomhet/Kartlegging/ResultatEksportVisning";
import { SpørreundersøkelseResultat } from "@/Pages/Virksomhet/Kartlegging/SpørreundersøkelseResultat";
import { usePollingAvKartleggingVedAvsluttetStatus } from "@/util/usePollingAvKartleggingVedAvsluttetStatus";
import { useSpørreundersøkelse } from "../SpørreundersøkelseContext";
import styles from "./spørreundersøkelsesliste.module.scss";
import { FormatertSpørreundersøkelseType } from "./utils";

export default function FullførtSpørreundersøkelseRad({
    spørreundersøkelse,
    erÅpen,
    dato,
    setErÅpen,
}: {
    spørreundersøkelse: Spørreundersøkelse;
    erÅpen: boolean;
    dato: string;
    setErÅpen: (åpen: boolean) => void;
}) {
    return (
        <>
            <SpørreundersøkelseHeader
                spørreundersøkelse={spørreundersøkelse}
                dato={dato}
                onClick={() => setErÅpen(!erÅpen)}
            />
            {erÅpen && (
                <SpørreundersøkelseRadInnhold
                    spørreundersøkelse={spørreundersøkelse}
                />
            )}
        </>
    );
}

function SpørreundersøkelseHeader({
    spørreundersøkelse,
    dato,
    onClick,
}: {
    spørreundersøkelse: Spørreundersøkelse;
    dato: string;
    onClick: () => void;
}) {
    const {
        iaSak,
        samarbeid,
        hentSpørreundersøkelserPåNytt,
        kanEndreSpørreundersøkelser,
    } = useSpørreundersøkelse();
    const flyttTilValgtSamarbeid = (samarbeidId: number) => {
        flyttSpørreundersøkelse(
            iaSak.orgnr,
            iaSak.saksnummer,
            samarbeidId,
            spørreundersøkelse.id,
        ).then(() => hentSpørreundersøkelserPåNytt?.());
    };
    const { henterKartleggingPånytt, forsøkPåÅHenteKartlegging } =
        usePollingAvKartleggingVedAvsluttetStatus(
            spørreundersøkelse.status,
            spørreundersøkelse,
            () => hentSpørreundersøkelserPåNytt?.(),
        );

    return (
        <ExpansionCard.Header
            className={styles.styledExpansionCardHeader}
            onClick={onClick}
        >
            <ExpansionCard.Title>
                <FormatertSpørreundersøkelseType
                    type={spørreundersøkelse.type}
                />
            </ExpansionCard.Title>
            <span className={styles.headerRightContent}>
                {kanEndreSpørreundersøkelser && (
                    <ActionButtonsHvisSamarbeidIkkeFullført
                        onClick={(e) => e.stopPropagation()}
                    >
                        <ResultatEksportVisning
                            spørreundersøkelse={spørreundersøkelse}
                            iaSak={iaSak}
                        />
                        {spørreundersøkelse.publiseringStatus ===
                            "IKKE_PUBLISERT" &&
                            spørreundersøkelse.type === "BEHOVSVURDERING" && (
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
                            type={spørreundersøkelse.type}
                            spørreundersøkelse={spørreundersøkelse}
                            hentBehovsvurderingPåNytt={() =>
                                hentSpørreundersøkelserPåNytt?.()
                            }
                            pollerPåStatus={
                                henterKartleggingPånytt ||
                                forsøkPåÅHenteKartlegging < 10
                            }
                        />
                    </ActionButtonsHvisSamarbeidIkkeFullført>
                )}
                <span className={styles.datovisning}>{dato}</span>
                <SpørreundersøkelseStatusBadge
                    status={spørreundersøkelse.status}
                />
            </span>
        </ExpansionCard.Header>
    );
}

function SpørreundersøkelseRadInnhold({
    spørreundersøkelse,
}: {
    spørreundersøkelse: Spørreundersøkelse;
}) {
    const spørreundersøkelseStatus = spørreundersøkelse.status;
    const { iaSak } = useSpørreundersøkelse();

    if (iaSak !== undefined) {
        if (
            spørreundersøkelseStatus === "AVSLUTTET" &&
            spørreundersøkelse.harMinstEttResultat
        ) {
            return (
                <ExpansionCard.Content>
                    <SpørreundersøkelseResultat
                        iaSak={iaSak}
                        spørreundersøkelseId={spørreundersøkelse.id}
                    />
                </ExpansionCard.Content>
            );
        }
    }

    return null;
}
