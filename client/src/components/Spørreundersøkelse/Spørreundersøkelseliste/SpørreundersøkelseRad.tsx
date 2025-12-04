import { ExpansionCard } from "@navikt/ds-react";
import { Spørreundersøkelse } from "../../../domenetyper/spørreundersøkelse";
import React from "react";
import styles from './spørreundersøkelsesliste.module.scss';
import { formaterSpørreundersøkelsetype } from "./utils";
import { spørreundersøkelseStatusEnum } from "../../../domenetyper/domenetyper";
import { erIFortid } from "../../../util/dato";
import ForFåSvarRad from "./ForFåSvarRad";
import { SlettSpørreundersøkelseModal } from "../../../Pages/Virksomhet/Kartlegging/SlettSpørreundersøkelseModal";
import IkkeGjennomførtFørFristRad from "./IkkeGjennomførtFørFristRad";
import FullførtSpørreundersøkelseRad from "./FullførtSpørreundersøkelseRad";
import PåbegyntRad from "./PåbegyntRad";
import OpprettetRad from "./OpprettetRad";
import { useSpørreundersøkelse } from "../SpørreundersøkelseContext";
import { slettSpørreundersøkelse } from "../../../api/lydia-api/spørreundersøkelse";
import { useHentIASaksStatus } from "../../../api/lydia-api/sak";

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
    const [slettSpørreundersøkelseModalÅpen, setSlettSpørreundersøkelseModalÅpen] = React.useState(false);
    const { brukerRolle, kanEndreSpørreundersøkelser, iaSak, hentSpørreundersøkelserPåNytt } = useSpørreundersøkelse();
    const [sletterSpørreundersøkelse, setSletterSpørreundersøkelse] = React.useState(false);
    const {
        mutate: oppdaterSaksStatus,
    } = useHentIASaksStatus(iaSak.orgnr, iaSak.saksnummer);

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
                    style={{
                        "--avstand-fra-siste": avstandFraSiste,
                    } as React.CSSProperties}
                >
                    <OpprettetRad spørreundersøkelse={spørreundersøkelse} dato={dato} />
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
                        style={{
                            "--avstand-fra-siste": avstandFraSiste,
                        } as React.CSSProperties}
                    >
                        <IkkeGjennomførtFørFristRad
                            spørreundersøkelse={spørreundersøkelse}
                            kanEndreSpørreundersøkelser={kanEndreSpørreundersøkelser}
                            setSlettSpørreundersøkelseModalÅpen={setSlettSpørreundersøkelseModalÅpen}
                            slettSpørreundersøkelseModalÅpen={slettSpørreundersøkelseModalÅpen}
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
                    style={{
                        "--avstand-fra-siste": avstandFraSiste,
                    } as React.CSSProperties}
                >
                    <PåbegyntRad spørreundersøkelse={spørreundersøkelse} dato={dato} />
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
                        style={{
                            "--avstand-fra-siste": avstandFraSiste,
                        } as React.CSSProperties}
                    >
                        <ForFåSvarRad
                            spørreundersøkelse={spørreundersøkelse}
                            kanEndreSpørreundersøkelser={kanEndreSpørreundersøkelser}
                            dato={dato}
                            erLesebruker={brukerRolle === "Lesetilgang"}
                            setSlettSpørreundersøkelseModalÅpen={setSlettSpørreundersøkelseModalÅpen} />
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
                    style={{
                        "--avstand-fra-siste": avstandFraSiste,
                    } as React.CSSProperties}
                >
                    <FullførtSpørreundersøkelseRad spørreundersøkelse={spørreundersøkelse} erÅpen={erÅpen} dato={dato} />
                </ExpansionCard>
            );
        case spørreundersøkelseStatusEnum.enum.SLETTET:
            return null;
    }
}



