import { ExpansionCard } from "@navikt/ds-react";
import React from "react";
import { spørreundersøkelseStatusEnum } from "@/domenetyper/domenetyper";
import { SlettSpørreundersøkelseModal } from "@/Pages/Virksomhet/Kartlegging/SlettSpørreundersøkelseModal";
import { useSamarbeidContext } from "@/Pages/Virksomhet/Samarbeid/SamarbeidContext";
import { erIFortid } from "@/util/dato";
import { Spørreundersøkelse } from "@features/kartlegging/types/spørreundersøkelse";
import { slettKartleggingNyFlyt } from "@features/sak/api/nyFlyt";
import { useHentIASaksStatus } from "@features/sak/api/sak";
import { useSpørreundersøkelse } from "../SpørreundersøkelseContext";
import ForFåSvarRad from "./ForFåSvarRad";
import FullførtSpørreundersøkelseRad from "./FullførtSpørreundersøkelseRad";
import IkkeGjennomførtFørFristRad from "./IkkeGjennomførtFørFristRad";
import OpprettetRad from "./OpprettetRad";
import PåbegyntRad from "./PåbegyntRad";
import styles from "./spørreundersøkelsesliste.module.scss";
import { formaterSpørreundersøkelsetype } from "./utils";

export default function SpørreundersøkelseRad({
    spørreundersøkelse,
    dato,
    defaultOpen = false,
    avstandFraSiste,
}: {
    spørreundersøkelse: Spørreundersøkelse;
    dato: string;
    defaultOpen?: boolean;
    avstandFraSiste: number;
}) {
    const [erÅpen, setErÅpen] = React.useState(defaultOpen);
    const [
        slettSpørreundersøkelseModalÅpen,
        setSlettSpørreundersøkelseModalÅpen,
    ] = React.useState(false);
    const {
        brukerRolle,
        kanEndreSpørreundersøkelser,
        iaSak,
        hentSpørreundersøkelserPåNytt,
    } = useSpørreundersøkelse();
    const [sletterSpørreundersøkelse, setSletterSpørreundersøkelse] =
        React.useState(false);
    const { mutate: oppdaterSaksStatus } = useHentIASaksStatus(
        iaSak.orgnr,
        iaSak.saksnummer,
    );
    const { id: samarbeidsId } = useSamarbeidContext();

    const slettSpørreundersøkelsen = () => {
        if (sletterSpørreundersøkelse) return;
        setSletterSpørreundersøkelse(true);
        slettKartleggingNyFlyt(
            iaSak.orgnr,
            samarbeidsId,
            spørreundersøkelse.id,
        ).then(() => {
            hentSpørreundersøkelserPåNytt?.();
            oppdaterSaksStatus();
            setSlettSpørreundersøkelseModalÅpen(false);
            setSletterSpørreundersøkelse(false);
        });
    };

    switch (spørreundersøkelse.status) {
        case spørreundersøkelseStatusEnum.enum.OPPRETTET:
            return (
                <ExpansionCard
                    aria-label={`${formaterSpørreundersøkelsetype(spørreundersøkelse.type)} ${dato}`}
                    open={erÅpen}
                    onToggle={(open: boolean) => {
                        setErÅpen(open);
                    }}
                    className={styles.spørreundersøkelserad}
                    style={
                        {
                            "--avstand-fra-siste": avstandFraSiste,
                        } as React.CSSProperties
                    }
                >
                    <OpprettetRad
                        spørreundersøkelse={spørreundersøkelse}
                        dato={dato}
                    />
                </ExpansionCard>
            );

        case spørreundersøkelseStatusEnum.enum.PÅBEGYNT:
            if (erIFortid(spørreundersøkelse.gyldigTilTidspunkt)) {
                return (
                    <ExpansionCard
                        aria-label={`${formaterSpørreundersøkelsetype(spørreundersøkelse.type)} ${dato}`}
                        open={erÅpen}
                        onToggle={(open: boolean) => {
                            setErÅpen(open);
                        }}
                        className={styles.spørreundersøkelserad}
                        style={
                            {
                                "--avstand-fra-siste": avstandFraSiste,
                            } as React.CSSProperties
                        }
                    >
                        <IkkeGjennomførtFørFristRad
                            spørreundersøkelse={spørreundersøkelse}
                            kanEndreSpørreundersøkelser={
                                kanEndreSpørreundersøkelser
                            }
                            setSlettSpørreundersøkelseModalÅpen={
                                setSlettSpørreundersøkelseModalÅpen
                            }
                            slettSpørreundersøkelseModalÅpen={
                                slettSpørreundersøkelseModalÅpen
                            }
                            slettSpørreundersøkelsen={slettSpørreundersøkelsen}
                            laster={false}
                            dato={dato}
                        />
                    </ExpansionCard>
                );
            }

            return (
                <ExpansionCard
                    aria-label={`${formaterSpørreundersøkelsetype(spørreundersøkelse.type)} ${dato}`}
                    open={erÅpen}
                    onToggle={(open: boolean) => {
                        setErÅpen(open);
                    }}
                    className={styles.spørreundersøkelserad}
                    style={
                        {
                            "--avstand-fra-siste": avstandFraSiste,
                        } as React.CSSProperties
                    }
                >
                    <PåbegyntRad
                        spørreundersøkelse={spørreundersøkelse}
                        dato={dato}
                    />
                </ExpansionCard>
            );

        case spørreundersøkelseStatusEnum.enum.AVSLUTTET:
            if (!spørreundersøkelse.harMinstEttResultat) {
                return (
                    <ExpansionCard
                        aria-label={`${formaterSpørreundersøkelsetype(spørreundersøkelse.type)} ${dato}`}
                        open={erÅpen}
                        onToggle={(open: boolean) => {
                            setErÅpen(open);
                        }}
                        className={styles.spørreundersøkelserad}
                        style={
                            {
                                "--avstand-fra-siste": avstandFraSiste,
                            } as React.CSSProperties
                        }
                    >
                        <ForFåSvarRad
                            spørreundersøkelse={spørreundersøkelse}
                            kanEndreSpørreundersøkelser={
                                kanEndreSpørreundersøkelser
                            }
                            dato={dato}
                            erLesebruker={brukerRolle === "Lesetilgang"}
                            setSlettSpørreundersøkelseModalÅpen={
                                setSlettSpørreundersøkelseModalÅpen
                            }
                        />
                        <SlettSpørreundersøkelseModal
                            spørreundersøkelse={spørreundersøkelse}
                            erModalÅpen={slettSpørreundersøkelseModalÅpen}
                            lukkModal={() =>
                                setSlettSpørreundersøkelseModalÅpen(false)
                            }
                            slettSpørreundersøkelsen={slettSpørreundersøkelsen}
                        />
                    </ExpansionCard>
                );
            }
            return (
                <ExpansionCard
                    aria-label={`${formaterSpørreundersøkelsetype(spørreundersøkelse.type)} ${dato}`}
                    open={erÅpen}
                    onToggle={(open: boolean) => {
                        setErÅpen(open);
                    }}
                    className={styles.spørreundersøkelserad}
                    style={
                        {
                            "--avstand-fra-siste": avstandFraSiste,
                        } as React.CSSProperties
                    }
                >
                    <FullførtSpørreundersøkelseRad
                        spørreundersøkelse={spørreundersøkelse}
                        erÅpen={erÅpen}
                        setErÅpen={setErÅpen}
                        dato={dato}
                    />
                </ExpansionCard>
            );
        case spørreundersøkelseStatusEnum.enum.SLETTET:
            return null;
    }
}
