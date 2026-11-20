import { BodyLong, HGrid } from "@navikt/ds-react";
import { Samarbeidsmål } from "./målskjema";
import { Måltypekort } from "./Måloversikt";
import { Målkortramme } from "./Målkort";
import styles from "./mål.module.scss";

export function Samarbeidsmåloversikt({
    samarbeidsmål,
    onÅpneDialog,
    deaktivert,
}: {
    samarbeidsmål: Samarbeidsmål[];
    onÅpneDialog?: () => void;
    deaktivert: boolean;
}) {
    return (
        <Måltypekort
            tittel="Mål for samarbeidet"
            beskrivelse="Beskriv hva dere skal oppnå i samarbeidet"
            leggTilTekst="Legg til mål for samarbeidet"
            harMål={samarbeidsmål.length > 0}
            onÅpneDialog={onÅpneDialog}
            deaktivert={deaktivert}
        >
            <HGrid
                as="ul"
                aria-label="Mål for samarbeidet"
                columns={{ xs: 1, md: 2 }}
                gap="space-16"
                className={styles.kortliste}
            >
                {samarbeidsmål.map((m) => (
                    <li key={m.id ?? m.mål}>
                        <Målkortramme>
                            <BodyLong
                                size="large"
                                className={styles.samarbeidsmaal}
                            >
                                {m.mål}
                            </BodyLong>
                        </Målkortramme>
                    </li>
                ))}
            </HGrid>
        </Måltypekort>
    );
}
