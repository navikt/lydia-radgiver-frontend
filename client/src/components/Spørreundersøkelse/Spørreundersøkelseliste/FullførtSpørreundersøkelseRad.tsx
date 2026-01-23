import React from "react";
import { ExpansionCard } from "@navikt/ds-react";
import { Spørreundersøkelse } from "../../../domenetyper/spørreundersøkelse";
import { useSpørreundersøkelse } from "../SpørreundersøkelseContext";
import styles from "./spørreundersøkelsesliste.module.scss";
import { SpørreundersøkelseResultat } from "../../../Pages/Virksomhet/Kartlegging/SpørreundersøkelseResultat";
import { FormatertSpørreundersøkelseType } from "./utils";
import { SpørreundersøkelseStatusBadge } from "../../Badge/SpørreundersøkelseStatusBadge";
import { FlyttTilAnnenProsess } from "../../../Pages/Virksomhet/Kartlegging/FlyttTilAnnenProsess";
import { flyttSpørreundersøkelse } from "../../../api/lydia-api/spørreundersøkelse";
import ActionButtonsHvisSamarbeidIkkeFullført from "../../../Pages/Virksomhet/Kartlegging/ActionButtonHvisSamarbeidIkkeFullført";
import { PubliserSpørreundersøkelse } from "../../../Pages/Virksomhet/Kartlegging/PubliserSpørreundersøkelse";
import { usePollingAvKartleggingVedAvsluttetStatus } from "../../../util/usePollingAvKartleggingVedAvsluttetStatus";
import ResultatEksportVisning from "../../../Pages/Virksomhet/Kartlegging/ResultatEksportVisning";

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
    const [erIEksportMode, setErIEksportMode] = React.useState(false);
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
                            erIEksportMode={erIEksportMode}
                            setErIEksportMode={setErIEksportMode}
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
