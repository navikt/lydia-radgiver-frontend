import styles from './spørreundersøkelse.module.scss';
import { TemaResultat } from "./TemaResultat";
import { SpørreundersøkelseResultat } from "../../domenetyper/spørreundersøkelseResultat";

export default function Resultatvisning({
    kartleggingResultat,
}: {
    kartleggingResultat: SpørreundersøkelseResultat;
}) {
    return (
        <div className={styles.resultatvisning}>
            {kartleggingResultat.spørsmålMedSvarPerTema.map((tema) => (
                <TemaResultat
                    key={tema.navn}
                    spørsmålResultat={tema.spørsmålMedSvar}
                    navn={tema.navn}
                />
            ))}
        </div>
    );
}
