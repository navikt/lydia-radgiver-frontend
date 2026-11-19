import { BodyLong, HGrid } from "@navikt/ds-react";
import { Samarbeidsmål } from "./målskjema";
import { Måloversiktdel } from "./Måloversikt";
import { Målkortramme } from "./Målkort";
import styles from "./mål.module.scss";

export function Samarbeidsmåloversikt({
    samarbeidsmål,
    onRediger,
}: {
    samarbeidsmål: Samarbeidsmål[];
    onRediger?: () => void;
}) {
    return (
        <Måloversiktdel
            tittel="Mål for samarbeidet"
            overskriftId="samarbeidsmaal-overskrift"
            onRediger={onRediger}
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
        </Måloversiktdel>
    );
}
