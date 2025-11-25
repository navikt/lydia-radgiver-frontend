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
                            kanEndreSpørreundersøkelser={true} {...{} /* TODO: noe her */}
                            setSlettSpørreundersøkelseModalÅpen={setSlettSpørreundersøkelseModalÅpen}
                            slettSpørreundersøkelseModalÅpen={slettSpørreundersøkelseModalÅpen}
                            slettSpørreundersøkelsen={() => console.log("TODO: slett")}
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
                        <ForFåSvarRad spørreundersøkelse={spørreundersøkelse} dato={dato} setSlettSpørreundersøkelseModalÅpen={setSlettSpørreundersøkelseModalÅpen} />
                        <SlettSpørreundersøkelseModal
                            spørreundersøkelse={spørreundersøkelse}
                            erModalÅpen={slettSpørreundersøkelseModalÅpen}
                            lukkModal={() =>
                                setSlettSpørreundersøkelseModalÅpen(false)
                            }
                            slettSpørreundersøkelsen={() => console.log("TODO: slett")}
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



