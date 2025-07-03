import { Virksomhet } from "../../../domenetyper/virksomhet";
import { Heading } from "@navikt/ds-react";
import { Sykefraværsstatistikk } from "./Sykefraværsstatistikk";
import { Historiskstatistikk } from "./Graf/Historiskstatistikk";
import styles from "./statistikk.module.scss";

interface Props {
    virksomhet: Virksomhet;
}

export const SykefraværsstatistikkFane = ({ virksomhet }: Props) => {
    return (
        <div className={styles.statistikkFaneContainer}>
            <Heading level="3" size="large" spacing={true}>
                Sykefraværsstatistikk
            </Heading>
            <Sykefraværsstatistikk
                orgnummer={virksomhet.orgnr}
                bransje={virksomhet.bransje}
                næring={virksomhet.næring}
            />
            <Historiskstatistikk orgnr={virksomhet.orgnr} />
        </div>
    );
};
