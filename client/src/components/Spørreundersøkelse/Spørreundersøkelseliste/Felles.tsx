import React from "react";
import { ClockIcon } from "@navikt/aksel-icons";
import { erIFortid, lokalDatoMedKlokkeslett } from "../../../util/dato";
import styles from "./spørreundersøkelsesliste.module.scss";

export function GyldigTilTidspunkt(props: { input: Date }) {
    const tekst = erIFortid(props.input)
        ? `Stengte ${lokalDatoMedKlokkeslett(props.input)}, men du kan fortsatt fullføre`
        : `Åpen frem til ${lokalDatoMedKlokkeslett(props.input)}`;
    return (
        <span className={styles.infolinje}>
            <ClockIcon title="a11y-title" fontSize="1.5rem" />
            {tekst}
        </span>
    );
}
