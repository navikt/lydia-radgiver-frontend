import React from "react";
import {
    BodyShort,
    Button,
    ExpansionCard,
    Heading,
    HStack,
    VStack,
} from "@navikt/ds-react";
import { PencilIcon } from "@navikt/aksel-icons";

// Starter åpent hver gang fanen vises.
export function Måloversikt({
    onLeggTilSykefraværsmål,
    onLeggTilSamarbeidsmål,
    manglerTilgang,
    children,
}: {
    onLeggTilSykefraværsmål?: () => void;
    onLeggTilSamarbeidsmål?: () => void;
    manglerTilgang: boolean;
    children?: React.ReactNode;
}) {
    return (
        <ExpansionCard aria-label="Mål" defaultOpen>
            <ExpansionCard.Header>
                <ExpansionCard.Title as="h2" size="medium">
                    Mål
                </ExpansionCard.Title>
                <ExpansionCard.Description>
                    Legg til mål for sykefraværet og samarbeidet.
                </ExpansionCard.Description>
            </ExpansionCard.Header>
            <ExpansionCard.Content>
                <VStack gap="space-24">
                    {(onLeggTilSykefraværsmål || onLeggTilSamarbeidsmål) && (
                        <HStack gap="space-8">
                            {onLeggTilSykefraværsmål && (
                                <Button
                                    variant="secondary"
                                    onClick={onLeggTilSykefraværsmål}
                                    aria-haspopup="dialog"
                                >
                                    Legg til mål for sykefraværet
                                </Button>
                            )}
                            {onLeggTilSamarbeidsmål && (
                                <Button
                                    variant="secondary"
                                    onClick={onLeggTilSamarbeidsmål}
                                    aria-haspopup="dialog"
                                >
                                    Legg til mål for samarbeidet
                                </Button>
                            )}
                        </HStack>
                    )}
                    {manglerTilgang && (
                        <BodyShort>
                            Du må være eier eller følger for å legge til
                            mål.
                        </BodyShort>
                    )}
                    {children}
                </VStack>
            </ExpansionCard.Content>
        </ExpansionCard>
    );
}

export function Måloversiktdel({
    tittel,
    overskriftId,
    onRediger,
    children,
}: {
    tittel: string;
    overskriftId: string;
    onRediger?: () => void;
    children: React.ReactNode;
}) {
    return (
        <VStack as="section" aria-labelledby={overskriftId} gap="space-16">
            <HStack justify="space-between" align="center" gap="space-8">
                <Heading level="3" size="small" id={overskriftId}>
                    {tittel}
                </Heading>
                {onRediger && (
                    <Button
                        variant="secondary"
                        size="small"
                        icon={<PencilIcon aria-hidden />}
                        onClick={onRediger}
                        aria-haspopup="dialog"
                        aria-describedby={overskriftId}
                    >
                        Rediger
                    </Button>
                )}
            </HStack>
            {children}
        </VStack>
    );
}
