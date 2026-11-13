import {
    BodyShort,
    Heading,
    HelpText,
    HStack,
    Label,
    VStack,
} from "@navikt/ds-react";
import { ArrowRightIcon } from "@navikt/aksel-icons";
import {
    formaterFrist,
    formaterMålverdi,
    SYKEFRAVÆRSMÅLTYPE_HJELPETEKST,
    SYKEFRAVÆRSMÅLTYPE_NAVN,
    Sykefraværsmåltype,
    Sykefraværsmål,
} from "./målskjema";
import styles from "./mål.module.scss";

export function SykefraværsmåltypeOverskrift({
    type,
    id,
}: {
    type: Sykefraværsmåltype;
    id?: string;
}) {
    const navn = SYKEFRAVÆRSMÅLTYPE_NAVN[type];
    return (
        <HStack gap="space-8" align="center" wrap={false}>
            <Heading level="4" size="small" id={id}>
                {navn}
            </Heading>
            <HelpText title={`Hva er ${navn.toLowerCase()}?`}>
                {SYKEFRAVÆRSMÅLTYPE_HJELPETEKST[type]}
            </HelpText>
        </HStack>
    );
}

export function Målverdier({ mål }: { mål: Sykefraværsmål }) {
    return (
        <HStack wrap gap="space-16">
            <VStack gap="space-4" className={styles.maalverdikolonne}>
                <Label as="p" size="small">
                    Nåværende
                </Label>
                <BodyShort size="large" className={styles.naavaerende}>
                    {formaterMålverdi(mål.nåværende, mål.type)}
                </BodyShort>
            </VStack>
            <VStack gap="space-4" className={styles.maalverdikolonne}>
                <Label as="p" size="small">
                    Mål
                </Label>
                <BodyShort size="large" className={styles.maalverdi}>
                    {formaterMålverdi(mål.mål, mål.type)}
                </BodyShort>
            </VStack>
            <VStack gap="space-4" className={styles.maalverdikolonne}>
                <Label as="p" size="small">
                    Måldato
                </Label>
                <BodyShort size="large">{formaterFrist(mål.frist)}</BodyShort>
            </VStack>
        </HStack>
    );
}

export function Målverdioversikt({ mål }: { mål: Sykefraværsmål }) {
    return (
        <HStack justify="space-between" align="center" gap="space-16" wrap>
            <HStack gap="space-16" align="start" wrap>
                <div className={styles.maalverdiblokk}>
                    <BodyShort className={styles.naavaerendefarge}>
                        Nåværende
                    </BodyShort>
                    <BodyShort
                        className={`${styles.stortall} ${styles.naavaerendefarge}`}
                    >
                        {formaterMålverdi(mål.nåværende, mål.type)}
                    </BodyShort>
                </div>
                <div className={styles.maalpil}>
                    <ArrowRightIcon aria-hidden />
                </div>
                <div className={styles.maalverdiblokk}>
                    <BodyShort className={styles.maalfarge}>Mål</BodyShort>
                    <BodyShort
                        className={`${styles.stortall} ${styles.maalfarge}`}
                    >
                        {formaterMålverdi(mål.mål, mål.type)}
                    </BodyShort>
                </div>
            </HStack>
            <VStack gap="space-4" align="end">
                <Label as="p">Måldato</Label>
                <BodyShort>{formaterFrist(mål.frist)}</BodyShort>
            </VStack>
        </HStack>
    );
}
