import React from "react";
import { BodyShort, Box, Heading, VStack } from "@navikt/ds-react";
import {
    nyttSamarbeidsmålFeltId,
    samarbeidsmålFeltId,
    Samarbeidsmålutkast,
    Sjekk,
} from "./målskjema";
import { NyttSamarbeidsmålSkjema } from "./NyttSamarbeidsmålSkjema";
import { Samarbeidsmålkort } from "./Samarbeidsmålkort";
import { Status, Statusmelding } from "./Statusmelding";

export function Samarbeidsmålseksjon({
    idPrefiks,
    mål,
    nyttTekst,
    nyttFeil,
    nyttSjekk,
    nyttTekstfeltRef,
    onEndreNytt,
    onLeggTil,
    kort,
    onStartRedigering,
    onEndreKort,
    onLagreKort,
    onAvbrytKort,
    onSlett,
    statusmelding,
    listeRef,
    children,
}: {
    idPrefiks: string;
    mål: Samarbeidsmålutkast[];
    nyttTekst: string;
    nyttFeil?: string;
    nyttSjekk?: Sjekk;
    nyttTekstfeltRef: React.Ref<HTMLTextAreaElement>;
    onEndreNytt: (tekst: string) => void;
    onLeggTil: (likevel?: boolean) => void;
    kort?: {
        nøkkel: string;
        tekst: string;
        feil?: string;
        sjekk?: Sjekk;
    };
    onStartRedigering: (nøkkel: string) => void;
    onEndreKort: (tekst: string) => void;
    onLagreKort: (nøkkel: string, likevel?: boolean) => void;
    onAvbrytKort: (nøkkel: string) => void;
    onSlett: (nøkkel: string) => void;
    statusmelding?: Status;
    listeRef: React.Ref<HTMLHeadingElement>;
    children?: React.ReactNode;
}) {
    return (
        <Box
            borderWidth="1 0 0 0"
            borderColor="neutral-subtle"
            paddingBlock="space-24 space-0"
        >
            <VStack gap="space-16">
                <NyttSamarbeidsmålSkjema
                    feltId={nyttSamarbeidsmålFeltId(idPrefiks)}
                    tekstfeltRef={nyttTekstfeltRef}
                    tekst={nyttTekst}
                    feil={nyttFeil}
                    sjekk={nyttSjekk}
                    onEndre={onEndreNytt}
                    onLagre={() => onLeggTil()}
                    onLagreLikevel={() => onLeggTil(true)}
                />
                <Statusmelding status={statusmelding} gjelder="samarbeid" />
                {mål.length > 0 && (
                    <Box
                        borderWidth="2 0 0 0"
                        borderColor="accent"
                        paddingBlock="space-24 space-0"
                    >
                        <VStack gap="space-16">
                            <Heading
                                level="3"
                                size="small"
                                ref={listeRef}
                                tabIndex={-1}
                            >
                                Mål for samarbeidet
                                <BodyShort as="span" visuallyHidden>
                                    mål som er lagt til
                                </BodyShort>
                            </Heading>
                            <VStack gap="space-12">
                                {mål.map((m) => (
                                    <Samarbeidsmålkort
                                        key={m.nøkkel}
                                        feltId={samarbeidsmålFeltId(
                                            idPrefiks,
                                            m.nøkkel,
                                        )}
                                        mål={m.mål}
                                        flagget={m.lagretMedKiAdvarsel}
                                        funn={m.funn}
                                        onRediger={() =>
                                            onStartRedigering(m.nøkkel)
                                        }
                                        onSlett={() => onSlett(m.nøkkel)}
                                        redigering={
                                            kort?.nøkkel === m.nøkkel
                                                ? {
                                                      ...kort,
                                                      onEndre: onEndreKort,
                                                      onLagre: () =>
                                                          onLagreKort(m.nøkkel),
                                                      onLagreLikevel: () =>
                                                          onLagreKort(
                                                              m.nøkkel,
                                                              true,
                                                          ),
                                                      onAvbryt: () =>
                                                          onAvbrytKort(
                                                              m.nøkkel,
                                                          ),
                                                  }
                                                : undefined
                                        }
                                    />
                                ))}
                            </VStack>
                        </VStack>
                    </Box>
                )}
                {children}
            </VStack>
        </Box>
    );
}
