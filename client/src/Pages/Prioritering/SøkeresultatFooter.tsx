import React from "react";
import { Detail, Loader } from "@navikt/ds-react";
import { ANTALL_RESULTATER_PER_SIDE } from "./Prioriteringsside";
import { Paginering } from "./Paginering";
import styles from './prioritering.module.scss';


interface Props {
    side: number;
    endreSide: (side: number) => void;
    antallTreffPåSide: number;
    totaltAntallTreff?: number;
}

export const SøkeresultatFooter = ({
    side,
    antallTreffPåSide,
    endreSide,
    totaltAntallTreff,
}: Props) => {
    const sideOffset = (side - 1) * ANTALL_RESULTATER_PER_SIDE;
    const resultatFra = sideOffset + 1;
    const resultatTil = Math.min(
        sideOffset + antallTreffPåSide,
        side * ANTALL_RESULTATER_PER_SIDE,
    );

    return (
        <div className={styles.søkeresultatFooter}>
            <div className={styles.pagineringsContainer}>
                <Paginering
                    side={side}
                    endreSide={endreSide}
                    antallTreffPåSide={antallTreffPåSide}
                />
                <Detail className={styles.resultatInfo} size="small">
                    Viser resultat {resultatFra} - {resultatTil} av{" "}
                    {totaltAntallTreff ?? (
                        <Loader size="xsmall" title="henter antall treff" />
                    )}
                </Detail>
            </div>
        </div>
    );
};
