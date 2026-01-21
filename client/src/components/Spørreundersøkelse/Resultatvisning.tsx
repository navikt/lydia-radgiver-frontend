import React from "react";
import styles from "./spørreundersøkelse.module.scss";
import { TemaResultat } from "./TemaResultat";
import { SpørreundersøkelseResultat } from "../../domenetyper/spørreundersøkelseResultat";

export default function Resultatvisning({
    kartleggingResultat,
}: {
    kartleggingResultat: SpørreundersøkelseResultat;
}) {
    const [brukTekstvisning, setBrukTekstvisning] = React.useState(false);

    return (
        <div className={styles.resultatvisning}>
            {kartleggingResultat.spørsmålMedSvarPerTema.map((tema, index) => (
                <TemaResultat
                    key={tema.navn}
                    spørsmålResultat={tema.spørsmålMedSvar}
                    navn={tema.navn}
                    brukTekstvisning={brukTekstvisning}
                    setBrukTekstvisning={setBrukTekstvisning}
                    index={index}
                />
            ))}
        </div>
    );
}
