import { ExpansionCard } from "@navikt/ds-react";
import { Spørreundersøkelse } from "../../domenetyper/spørreundersøkelse";
import React from "react";
import {
    useSpørreundersøkelseKomponenter,
    useSpørreundersøkelseType,
} from "./SpørreundersøkelseContext";
import styles from './spørreundersøkelse.module.scss';

export default function SpørreundersøkelseRad({
    spørreundersøkelse,
    dato,
    defaultOpen,
    avstandFraSiste,
}: {
    spørreundersøkelse: Spørreundersøkelse;
    dato?: string;
    defaultOpen?: boolean;
    avstandFraSiste: number;
}) {
    const [erÅpen, setErÅpen] = React.useState(defaultOpen);

    const spørreundersøkelseType = useSpørreundersøkelseType();
    const { CardHeader, CardInnhold } = useSpørreundersøkelseKomponenter();

    return (
        <ExpansionCard
            aria-label={spørreundersøkelseType}
            open={erÅpen}
            onToggle={(open: boolean) => {
                setErÅpen(open);
            }}
            className={styles.spørreundersøkelserad}
            style={{
                "--avstand-fra-siste": avstandFraSiste,
            } as React.CSSProperties}
        >
            <CardHeader spørreundersøkelse={spørreundersøkelse} dato={dato} />
            {erÅpen && spørreundersøkelse.status === "AVSLUTTET" && (
                <CardInnhold spørreundersøkelse={spørreundersøkelse} />
            )}
        </ExpansionCard>
    );
}
