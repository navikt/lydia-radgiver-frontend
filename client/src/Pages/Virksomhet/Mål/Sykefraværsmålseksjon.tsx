import React from "react";
import { BodyShort, Box, Heading, HGrid, VStack } from "@navikt/ds-react";
import { Feiloppsummering } from "./Feiloppsummering";
import { Lagringsfeil } from "./Lagringsfeil";
import {
    FEILMELDINGER,
    FELTREKKEFØLGE,
    harInnholdISykefraværsutkast,
    lagIdPrefiks,
    nyttSykefraværsmålPrefiks,
    oppdaterSykefraværsmålIListe,
    opptatteTyper,
    redigerKnappId,
    Seksjonshandlinger,
    skjemaId,
    sykefraværskortPrefiks,
    Sykefraværsmål,
    SykefraværsmålIListe,
    Sykefraværsmålutkast,
    tilFeillenke,
    tilSykefraværsmålIListe,
    tilUtkast,
    tomtUtkast,
    validerSykefraværsmål,
} from "./målskjema";
import { NyttSykefraværsmålSkjema } from "./NyttSykefraværsmålSkjema";
import { Status, Statusmelding } from "./Statusmelding";
import { Sykefraværsmålkort } from "./Sykefraværsmålkort";

export function Sykefraværsmålseksjon({
    ref,
    lagret,
    onLagre,
}: {
    ref: React.Ref<Seksjonshandlinger>;
    lagret: Sykefraværsmål[];
    onLagre: (liste: Sykefraværsmål[]) => Promise<Sykefraværsmål[]>;
}) {
    const idPrefiks = lagIdPrefiks(React.useId());
    const nyttSykefraværsprefiks = nyttSykefraværsmålPrefiks(idPrefiks);
    const sykefraværsmålListeRef = React.useRef<HTMLHeadingElement>(null);

    const [sykefraværsmål, setSykefraværsmål] = React.useState<
        SykefraværsmålIListe[]
    >(() => lagret.map(tilSykefraværsmålIListe));
    const [nyttUtkast, setNyttUtkast] = React.useState(tomtUtkast);
    const [ulagretNyttSykefraværsmål, setUlagretNyttSykefraværsmål] =
        React.useState(false);
    const [sykefraværskort, setSykefraværskort] = React.useState<{
        utkast: Sykefraværsmålutkast;
        visFeil: boolean;
        ulagret: boolean;
    }>();

    const [statusmelding, setStatusmelding] = React.useState<Status>();
    const [fokusmål, setFokusmål] = React.useState<{ id: string }>();
    const [fokusteller, setFokusteller] = React.useState(0);
    const [fokuserListe, setFokuserListe] = React.useState(0);
    const [lagringFeilet, setLagringFeilet] = React.useState(false);
    const lagrer = React.useRef(false);

    React.useEffect(() => {
        if (fokuserListe > 0) sykefraværsmålListeRef.current?.focus();
    }, [fokuserListe]);

    React.useEffect(() => {
        if (fokusmål) document.getElementById(fokusmål.id)?.focus();
    }, [fokusmål]);

    const sykefraværskortresultat = sykefraværskort
        ? validerSykefraværsmål(
              sykefraværskort.utkast,
              opptatteTyper(sykefraværsmål, sykefraværskort.utkast.id),
          )
        : undefined;
    const ulagretFeil = {
        nyttSykefraværsmål: ulagretNyttSykefraværsmål
            ? FEILMELDINGER.ulagretNyttSykefraværsmål
            : undefined,
        sykefraværskort: sykefraværskort?.ulagret
            ? FEILMELDINGER.ulagretEndringSykefraværsmål
            : undefined,
    };
    const feillenker = [
        ...tilFeillenke(
            skjemaId(nyttSykefraværsprefiks, "type"),
            ulagretFeil.nyttSykefraværsmål,
        ),
        ...(sykefraværskort
            ? tilFeillenke(
                  skjemaId(
                      sykefraværskortPrefiks(
                          idPrefiks,
                          sykefraværskort.utkast.id,
                      ),
                      "nåværende",
                  ),
                  ulagretFeil.sykefraværskort,
              )
            : []),
    ];

    React.useImperativeHandle(ref, () => ({
        visUlagrede: (fokuser) => {
            const harUlagretNyttSykefraværsmål =
                harInnholdISykefraværsutkast(nyttUtkast);
            if (harUlagretNyttSykefraværsmål) {
                setUlagretNyttSykefraværsmål(true);
            }
            const harUlagretSykefraværskort = sykefraværskort !== undefined;
            if (harUlagretSykefraværskort) {
                setSykefraværskort((k) => k && { ...k, ulagret: true });
            }
            const harUlagret =
                harUlagretNyttSykefraværsmål || harUlagretSykefraværskort;
            if (harUlagret && fokuser) setFokusteller((n) => n + 1);
            return harUlagret;
        },
    }));

    // Én lagring om gangen, så et dobbeltklikk ikke lagrer samme mål to ganger.
    const lagreEnOmGangen = async (lagre: () => Promise<void>) => {
        if (lagrer.current) return false;
        lagrer.current = true;
        try {
            await lagre();
            setLagringFeilet(false);
            return true;
        } catch {
            setLagringFeilet(true);
            setStatusmelding(undefined);
            return false;
        } finally {
            lagrer.current = false;
        }
    };

    const lagreSykefraværsmål = (liste: SykefraværsmålIListe[]) =>
        lagreEnOmGangen(async () => {
            const svar = await onLagre(liste.map((r) => r.mål));
            setSykefraværsmål(oppdaterSykefraværsmålIListe(liste, svar));
        });

    const leggTilSykefraværsmål = async (mål: Sykefraværsmål) => {
        const lagret = await lagreSykefraværsmål([
            ...sykefraværsmål,
            { id: nyttUtkast.id, mål },
        ]);
        if (!lagret) return;
        setNyttUtkast(tomtUtkast());
        setUlagretNyttSykefraværsmål(false);
        setStatusmelding("Lagret");
        setFokuserListe((n) => n + 1);
    };

    const slettSykefraværsmål = async (id: string) => {
        const gjenstår = sykefraværsmål.filter((r) => r.id !== id);
        if (!(await lagreSykefraværsmål(gjenstår))) return;
        setSykefraværskort((k) => (k?.utkast.id === id ? undefined : k));
        setStatusmelding("Slettet");
        if (gjenstår.length === 0) {
            setFokusmål({ id: skjemaId(nyttSykefraværsprefiks, "type") });
        } else {
            sykefraværsmålListeRef.current?.focus();
        }
    };

    const startSykefraværsredigering = (id: string) => {
        const valgt = sykefraværsmål.find((r) => r.id === id);
        if (!valgt) return;
        setSykefraværskort({
            utkast: { ...tilUtkast(valgt.mål), id: valgt.id },
            visFeil: false,
            ulagret: false,
        });
        setFokusmål({
            id: skjemaId(sykefraværskortPrefiks(idPrefiks, id), "nåværende"),
        });
    };

    const avsluttSykefraværsredigering = (id: string) => {
        setSykefraværskort(undefined);
        setFokusmål({
            id: redigerKnappId(sykefraværskortPrefiks(idPrefiks, id)),
        });
    };

    const endreSykefraværskort = (endring: Partial<Sykefraværsmålutkast>) =>
        setSykefraværskort(
            (k) =>
                k && {
                    ...k,
                    utkast: { ...k.utkast, ...endring },
                    ulagret: false,
                },
        );

    const lagreRedigertSykefraværsmål = async () => {
        if (!sykefraværskort || !sykefraværskortresultat) return;
        const id = sykefraværskort.utkast.id;
        if (!sykefraværskortresultat.ok) {
            setSykefraværskort((k) => k && { ...k, visFeil: true });
            const førsteFeil = FELTREKKEFØLGE.find(
                (felt) => sykefraværskortresultat.feil[felt],
            );
            if (førsteFeil) {
                setFokusmål({
                    id: skjemaId(
                        sykefraværskortPrefiks(idPrefiks, id),
                        førsteFeil,
                    ),
                });
            }
            return;
        }
        const mål = sykefraværskortresultat.mål;
        const lagret = await lagreSykefraværsmål(
            sykefraværsmål.map((r) =>
                r.id === id ? { id: r.id, mål: { ...mål, id: r.mål.id } } : r,
            ),
        );
        if (!lagret) return;
        setStatusmelding("Lagret");
        avsluttSykefraværsredigering(id);
    };

    const kort = sykefraværskort && {
        utkast: sykefraværskort.utkast,
        feil:
            sykefraværskort.visFeil &&
            sykefraværskortresultat &&
            !sykefraværskortresultat.ok
                ? sykefraværskortresultat.feil
                : {},
        ulagretFeil: ulagretFeil.sykefraværskort,
    };

    return (
        <>
            <Feiloppsummering feil={feillenker} fokusteller={fokusteller} />
            <VStack gap="space-16">
                <NyttSykefraværsmålSkjema
                    key={nyttUtkast.id}
                    opptatte={opptatteTyper(sykefraværsmål)}
                    utkast={nyttUtkast}
                    oppdater={(endring) => {
                        setNyttUtkast((forrige) => ({
                            ...forrige,
                            ...endring,
                        }));
                        setUlagretNyttSykefraværsmål(false);
                    }}
                    idPrefiks={nyttSykefraværsprefiks}
                    ulagretFeil={ulagretFeil.nyttSykefraværsmål}
                    onLagre={leggTilSykefraværsmål}
                />
                <Statusmelding status={statusmelding} />
            </VStack>

            {sykefraværsmål.length > 0 && (
                <Box
                    borderWidth="2 0 0 0"
                    borderColor="accent"
                    paddingBlock="space-24 space-0"
                >
                    <VStack gap="space-16">
                        <Heading
                            level="3"
                            size="small"
                            ref={sykefraværsmålListeRef}
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
                            {sykefraværsmål.map((r) => (
                                <Sykefraværsmålkort
                                    key={r.id}
                                    idPrefiks={sykefraværskortPrefiks(
                                        idPrefiks,
                                        r.id,
                                    )}
                                    mål={r.mål}
                                    onRediger={() =>
                                        startSykefraværsredigering(r.id)
                                    }
                                    onSlett={() => slettSykefraværsmål(r.id)}
                                    redigering={
                                        kort?.utkast.id === r.id
                                            ? {
                                                  ...kort,
                                                  opptatte: opptatteTyper(
                                                      sykefraværsmål,
                                                      r.id,
                                                  ),
                                                  oppdater:
                                                      endreSykefraværskort,
                                                  onLagre:
                                                      lagreRedigertSykefraværsmål,
                                                  onAvbryt: () =>
                                                      avsluttSykefraværsredigering(
                                                          r.id,
                                                      ),
                                              }
                                            : undefined
                                    }
                                />
                            ))}
                        </HGrid>
                    </VStack>
                </Box>
            )}
            {lagringFeilet && <Lagringsfeil />}
        </>
    );
}
