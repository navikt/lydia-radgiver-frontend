import React from "react";
import { BodyShort, Box, Heading, HGrid, VStack } from "@navikt/ds-react";
import {
    nyttSykefraværsmålPrefiks,
    opptatteTyper,
    Sykefraværsmål,
    SykefraværsmålIListe,
    sykefraværskortPrefiks,
    Sykefraværsmålutkast,
    Valideringsfeil,
} from "./målskjema";
import { NyttSykefraværsmålSkjema } from "./NyttSykefraværsmålSkjema";
import { Status, Statusmelding } from "./Statusmelding";
import { Sykefraværsmålkort } from "./Sykefraværsmålkort";

export function Sykefraværsmålseksjon({
    idPrefiks,
    mål,
    nyttUtkast,
    nyttUlagretFeil,
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
}: {
    idPrefiks: string;
    mål: SykefraværsmålIListe[];
    nyttUtkast: Sykefraværsmålutkast;
    nyttUlagretFeil?: string;
    onEndreNytt: (endring: Partial<Sykefraværsmålutkast>) => void;
    onLeggTil: (mål: Sykefraværsmål) => void;
    kort?: {
        utkast: Sykefraværsmålutkast;
        feil: Valideringsfeil;
        ulagretFeil?: string;
    };
    onStartRedigering: (id: string) => void;
    onEndreKort: (endring: Partial<Sykefraværsmålutkast>) => void;
    onLagreKort: () => void;
    onAvbrytKort: (id: string) => void;
    onSlett: (id: string) => void;
    statusmelding?: Status;
    listeRef: React.Ref<HTMLHeadingElement>;
}) {
    return (
        <>
            <VStack gap="space-16">
                <NyttSykefraværsmålSkjema
                    key={nyttUtkast.id}
                    opptatte={opptatteTyper(mål)}
                    utkast={nyttUtkast}
                    oppdater={onEndreNytt}
                    idPrefiks={nyttSykefraværsmålPrefiks(idPrefiks)}
                    ulagretFeil={nyttUlagretFeil}
                    onLagre={onLeggTil}
                />
                <Statusmelding status={statusmelding} gjelder="sykefravær" />
            </VStack>

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
                            Mål for sykefraværet
                            <BodyShort as="span" visuallyHidden>
                                mål som er lagt til
                            </BodyShort>
                        </Heading>
                        <HGrid
                            columns={{ xs: 1, lg: 2 }}
                            gap="space-16"
                            align={kort ? "start" : undefined}
                        >
                            {mål.map((r) => (
                                <Sykefraværsmålkort
                                    key={r.id}
                                    idPrefiks={sykefraværskortPrefiks(
                                        idPrefiks,
                                        r.id,
                                    )}
                                    mål={r.mål}
                                    onRediger={() => onStartRedigering(r.id)}
                                    onSlett={() => onSlett(r.id)}
                                    redigering={
                                        kort?.utkast.id === r.id
                                            ? {
                                                  ...kort,
                                                  opptatte: opptatteTyper(
                                                      mål,
                                                      r.id,
                                                  ),
                                                  oppdater: onEndreKort,
                                                  onLagre: onLagreKort,
                                                  onAvbryt: () =>
                                                      onAvbrytKort(r.id),
                                              }
                                            : undefined
                                    }
                                />
                            ))}
                        </HGrid>
                    </VStack>
                </Box>
            )}
        </>
    );
}
