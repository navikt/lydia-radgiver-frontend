import React from "react";
import {
    Button,
    ExpansionCard,
    Heading,
    HStack,
    VStack,
} from "@navikt/ds-react";
import { PencilIcon, PlusIcon } from "@navikt/aksel-icons";
import styles from "./mål.module.scss";

export function Måloversikt({ children }: { children: React.ReactNode }) {
    return (
        <VStack gap="space-16">
            <Heading level="2" size="medium">
                Mål
            </Heading>
            {children}
        </VStack>
    );
}

// Starter åpent hver gang fanen vises. Uten onÅpneDialog vises ingen knapper.
// «Rediger» ligger i headeren og vises bare når måltypen har mål.
export function Måltypekort({
    tittel,
    beskrivelse,
    leggTilTekst,
    harMål,
    onÅpneDialog,
    deaktivert,
    children,
}: {
    tittel: string;
    beskrivelse: string;
    leggTilTekst: string;
    harMål: boolean;
    onÅpneDialog?: () => void;
    deaktivert: boolean;
    children: React.ReactNode;
}) {
    const tittelId = React.useId();
    return (
        <ExpansionCard aria-label={tittel} defaultOpen>
            <ExpansionCard.Header className={styles.maaltypeheader}>
                <HStack
                    justify="space-between"
                    align="start"
                    gap="space-16"
                    wrap
                >
                    <div>
                        <ExpansionCard.Title as="h3" size="small" id={tittelId}>
                            {tittel}
                        </ExpansionCard.Title>
                        <ExpansionCard.Description>
                            {beskrivelse}
                        </ExpansionCard.Description>
                    </div>
                    {onÅpneDialog && harMål && (
                        <div className={styles.headerknapp}>
                            <Button
                                data-color="accent"
                                variant="primary"
                                size="small"
                                icon={<PencilIcon aria-hidden />}
                                onClick={onÅpneDialog}
                                disabled={deaktivert}
                                aria-haspopup="dialog"
                                aria-describedby={tittelId}
                            >
                                Rediger
                            </Button>
                        </div>
                    )}
                </HStack>
            </ExpansionCard.Header>
            <ExpansionCard.Content>
                {harMål
                    ? children
                    : onÅpneDialog && (
                          <Button
                              data-color="accent"
                              variant="primary"
                              icon={<PlusIcon aria-hidden />}
                              onClick={onÅpneDialog}
                              disabled={deaktivert}
                              aria-haspopup="dialog"
                          >
                              {leggTilTekst}
                          </Button>
                      )}
            </ExpansionCard.Content>
        </ExpansionCard>
    );
}
