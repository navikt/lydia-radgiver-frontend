import { BodyShort, Heading } from "@navikt/ds-react";
import NAVLogo from "../../img/NAV_logo_rød.jpg";
import { useVirksomhetContext } from "../../Pages/Virksomhet/VirksomhetContext";
import { IaSakProsess } from "../../domenetyper/iaSakProsess";
import { lokalDato } from "../../util/dato";

import styles from './pdfeksport.module.scss';

export default function VirksomhetsEksportHeader({
    type,
    dato,
    visDato = true,
    samarbeid,
}: {
    type: string;
    dato?: Date | null;
    visDato?: boolean;
    samarbeid?: IaSakProsess;
}) {
    const vistDato = lokalDato(dato ?? new Date());
    const virksomhetsdata = useVirksomhetContext();

    return (
        <div className={styles.pdfeksport}>
            <div className={styles.imageContainer}>
                {/* className="nav-logo" er her for pdf-eksporten */}
                <img className={`nav-logo ${styles.image}`} src={NAVLogo} alt="NAV-logo" />
                {visDato && <BodyShort>{vistDato}</BodyShort>}
            </div>
            <BodyShort className={styles.body}>{virksomhetsdata?.virksomhet?.navn}</BodyShort>
            {samarbeid?.navn && samarbeid?.navn !== virksomhetsdata?.virksomhet?.navn ? (<BodyShort className={styles.body}>{samarbeid?.navn}</BodyShort>) : undefined}
            <Heading level="1" size="xlarge" spacing={true}>
                {type} {visDato ? vistDato : ""}
            </Heading>
        </div>
    );
}
