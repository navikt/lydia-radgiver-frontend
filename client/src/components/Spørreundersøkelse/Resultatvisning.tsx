import React from "react";
import { SpørreundersøkelseResultat } from "@features/kartlegging/types/spørreundersøkelseResultat";
import styles from "./spørreundersøkelse.module.scss";
import { TemaResultat } from "./TemaResultat";

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
