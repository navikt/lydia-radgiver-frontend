import { BodyShort, Detail, HelpText } from "@navikt/ds-react";
import styles from "./statistikk.module.scss";

interface VerdiSisteKvartal {
    verdi: string;
    år: number;
    kvartal: number;
}

interface Props {
    tittel: string;
    helpTekst: string;
    verdi: string;
    verdiSisteKvartal?: VerdiSisteKvartal;
}

export const Statistikkboks = ({
    tittel,
    helpTekst,
    verdi,
    verdiSisteKvartal,
}: Props) => {
    return (
        <div className={styles.statistikkboksContainer}>
            <div className={styles.tittelMedHelpTextContainer}>
                <BodyShort className={styles.tittel} as="dt">
                    {tittel}
                </BodyShort>
                <HelpText title="Hvor kommer dette fra?">{helpTekst}</HelpText>
            </div>

            <BodyShort className={styles.verdi} as="dd">
                {verdi}
            </BodyShort>
            <Detail
                className={`${styles.verdiSisteKvartal} ${verdiSisteKvartal ? "" : styles.hidden}`}
                as="dd"
            >
                {`${verdiSisteKvartal?.verdi} i ${verdiSisteKvartal?.kvartal}. kvartal ${verdiSisteKvartal?.år}`}
            </Detail>
        </div>
    );
};
