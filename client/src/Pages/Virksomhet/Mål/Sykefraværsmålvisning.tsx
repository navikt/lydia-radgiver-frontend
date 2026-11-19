import {
    BodyShort,
    Heading,
    HelpText,
    HStack,
    Label,
    VStack,
} from "@navikt/ds-react";
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
