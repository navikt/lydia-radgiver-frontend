import React from "react";
import { BodyShort, Box, Heading, VStack } from "@navikt/ds-react";
import { IASak } from "../../../domenetyper/domenetyper";
import { Feiloppsummering } from "./Feiloppsummering";
import { Lagringsfeil } from "./Lagringsfeil";
import {
    FEILMELDINGER,
    kiAdvarsel,
    lagIdPrefiks,
    lagreLikevelId,
    nyttSamarbeidsmålFeltId,
    oppdaterSamarbeidsmålutkast,
    redigerKnappId,
    Samarbeidsmål,
    samarbeidsmålFeltId,
    Samarbeidsmålutkast,
    Seksjonshandlinger,
    Sjekk,
    tilFeillenke,
    tilSamarbeidsmål,
    tilSamarbeidsmålutkast,
    tomtSamarbeidsmål,
    ulagretSamarbeidskortfeil,
    ulagretSamarbeidsmålfeil,
} from "./målskjema";
import { NyttSamarbeidsmålSkjema } from "./NyttSamarbeidsmålSkjema";
import { Samarbeidsmålkort } from "./Samarbeidsmålkort";
import { Status, Statusmelding } from "./Statusmelding";
import { sjekkTekst } from "./tekstsjekk";

export function Samarbeidsmålseksjon({
    ref,
    lagret,
    onLagre,
    iaSak,
}: {
    ref: React.Ref<Seksjonshandlinger>;
    lagret: Samarbeidsmål[];
    onLagre: (liste: Samarbeidsmål[]) => Promise<Samarbeidsmål[]>;
    iaSak: IASak;
}) {
    const idPrefiks = lagIdPrefiks(React.useId());
    const nyttSamarbeidsmålId = nyttSamarbeidsmålFeltId(idPrefiks);
    const samarbeidsmålListeRef = React.useRef<HTMLHeadingElement>(null);
    const nyttSamarbeidsmålRef = React.useRef<HTMLTextAreaElement>(null);

    const [samarbeidsmål, setSamarbeidsmål] = React.useState<
        Samarbeidsmålutkast[]
    >(() => lagret.map(tilSamarbeidsmålutkast));
    const [nyttSamarbeidsmål, setNyttSamarbeidsmål] = React.useState("");
    const [nyttSamarbeidsmålfeil, setNyttSamarbeidsmålfeil] =
        React.useState<string>();
    const [nyttSjekk, setNyttSjekk] = React.useState<Sjekk>();
    const [ulagretNyttSamarbeidsmål, setUlagretNyttSamarbeidsmål] =
        React.useState(false);
    const [samarbeidskort, setSamarbeidskort] = React.useState<{
        nøkkel: string;
        tekst: string;
        feil?: string;
        sjekk?: Sjekk;
        ulagret: boolean;
    }>();

    const [statusmelding, setStatusmelding] = React.useState<Status>();
    const [fokusmål, setFokusmål] = React.useState<{ id: string }>();
    const [fokusteller, setFokusteller] = React.useState(0);
    const [lagringFeilet, setLagringFeilet] = React.useState(false);
    const lagrer = React.useRef(false);

    React.useEffect(() => {
        if (fokusmål) document.getElementById(fokusmål.id)?.focus();
    }, [fokusmål]);

    const ulagretFeil = {
        nyttSamarbeidsmål: ulagretNyttSamarbeidsmål
            ? ulagretSamarbeidsmålfeil(nyttSjekk)
            : undefined,
        samarbeidskort: samarbeidskort?.ulagret
            ? ulagretSamarbeidskortfeil(samarbeidskort.sjekk)
            : undefined,
    };
    const feillenker = [
        ...tilFeillenke(nyttSamarbeidsmålId, ulagretFeil.nyttSamarbeidsmål),
        ...(samarbeidskort
            ? tilFeillenke(
                  samarbeidsmålFeltId(idPrefiks, samarbeidskort.nøkkel),
                  ulagretFeil.samarbeidskort,
              )
            : []),
    ];

    React.useImperativeHandle(ref, () => ({
        visUlagrede: (fokuser) => {
            const harUlagretSamarbeidsmål = nyttSamarbeidsmål.trim() !== "";
            if (harUlagretSamarbeidsmål) {
                setUlagretNyttSamarbeidsmål(true);
            }
            const harUlagretKortendring = samarbeidskort !== undefined;
            if (harUlagretKortendring) {
                setSamarbeidskort((k) => k && { ...k, ulagret: true });
            }
            const harUlagret = harUlagretSamarbeidsmål || harUlagretKortendring;
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

    const lagreSamarbeidsmål = (liste: Samarbeidsmålutkast[]) =>
        lagreEnOmGangen(async () => {
            const svar = await onLagre(liste.map(tilSamarbeidsmål));
            setSamarbeidsmål(oppdaterSamarbeidsmålutkast(liste, svar));
        });

    const startSamarbeidsredigering = (nøkkel: string) => {
        const mål = samarbeidsmål.find((m) => m.nøkkel === nøkkel);
        if (!mål) return;
        setSamarbeidskort({ nøkkel, tekst: mål.mål, ulagret: false });
        setFokusmål({ id: samarbeidsmålFeltId(idPrefiks, nøkkel) });
    };

    const avsluttSamarbeidsredigering = (nøkkel: string) => {
        setSamarbeidskort(undefined);
        setFokusmål({
            id: redigerKnappId(samarbeidsmålFeltId(idPrefiks, nøkkel)),
        });
    };

    const endreSamarbeidskort = (tekst: string) =>
        setSamarbeidskort(
            (k) =>
                k && {
                    ...k,
                    tekst,
                    feil: undefined,
                    sjekk: undefined,
                    ulagret: false,
                },
        );

    const lagreRedigertSamarbeidsmål = async (
        nøkkel: string,
        likevel = false,
    ) => {
        if (!samarbeidskort) return;
        const tekst = samarbeidskort.tekst.trim();
        if (tekst === "") {
            setSamarbeidskort(
                (k) =>
                    k && {
                        ...k,
                        feil: FEILMELDINGER.tomtSamarbeidsmål,
                        ulagret: false,
                    },
            );
            setFokusmål({ id: samarbeidsmålFeltId(idPrefiks, nøkkel) });
            return;
        }
        const uendret =
            samarbeidsmål.find((m) => m.nøkkel === nøkkel)?.mål === tekst;
        if (!uendret) {
            if (!likevel) {
                setSamarbeidskort(
                    (k) => k && { ...k, sjekk: { status: "sjekker" } },
                );
                const sjekk = await sjekkTekst(iaSak, tekst);
                setSamarbeidskort((k) => k && { ...k, sjekk });
                if (sjekk?.status === "funn") {
                    setFokusmål({
                        id: lagreLikevelId(
                            samarbeidsmålFeltId(idPrefiks, nøkkel),
                        ),
                    });
                }
                if (sjekk) return;
            }
            const advarsel = kiAdvarsel(
                likevel ? samarbeidskort.sjekk : undefined,
            );
            const lagret = await lagreSamarbeidsmål(
                samarbeidsmål.map((m) =>
                    m.nøkkel === nøkkel ? { ...m, mål: tekst, ...advarsel } : m,
                ),
            );
            if (!lagret) return;
        }
        setStatusmelding("Lagret");
        avsluttSamarbeidsredigering(nøkkel);
    };

    const leggTilSamarbeidsmål = async (likevel = false) => {
        const tekst = nyttSamarbeidsmål.trim();
        if (tekst === "") {
            setNyttSamarbeidsmålfeil(FEILMELDINGER.tomtSamarbeidsmål);
            nyttSamarbeidsmålRef.current?.focus();
            return;
        }
        if (!likevel) {
            setNyttSjekk({ status: "sjekker" });
            const sjekk = await sjekkTekst(iaSak, tekst);
            setNyttSjekk(sjekk);
            if (sjekk?.status === "funn") {
                setFokusmål({ id: lagreLikevelId(nyttSamarbeidsmålId) });
            }
            if (sjekk) return;
        }
        const lagret = await lagreSamarbeidsmål([
            ...samarbeidsmål,
            {
                ...tomtSamarbeidsmål(),
                mål: tekst,
                ...kiAdvarsel(likevel ? nyttSjekk : undefined),
            },
        ]);
        if (!lagret) return;
        setStatusmelding("Lagret");
        setNyttSamarbeidsmål("");
        setNyttSjekk(undefined);
        setNyttSamarbeidsmålfeil(undefined);
        setUlagretNyttSamarbeidsmål(false);
    };

    const slettSamarbeidsmål = async (nøkkel: string) => {
        const gjenstår = samarbeidsmål.filter((m) => m.nøkkel !== nøkkel);
        if (!(await lagreSamarbeidsmål(gjenstår))) return;
        setSamarbeidskort((k) => (k?.nøkkel === nøkkel ? undefined : k));
        setStatusmelding("Slettet");
        if (gjenstår.length === 0) {
            nyttSamarbeidsmålRef.current?.focus();
        } else {
            samarbeidsmålListeRef.current?.focus();
        }
    };

    const kort = samarbeidskort && {
        nøkkel: samarbeidskort.nøkkel,
        tekst: samarbeidskort.tekst,
        feil: ulagretFeil.samarbeidskort ?? samarbeidskort.feil,
        sjekk: samarbeidskort.sjekk,
    };

    return (
        <Box
            borderWidth="1 0 0 0"
            borderColor="neutral-subtle"
            paddingBlock="space-24 space-0"
        >
            <VStack gap="space-16">
                <Feiloppsummering feil={feillenker} fokusteller={fokusteller} />
                <NyttSamarbeidsmålSkjema
                    feltId={nyttSamarbeidsmålId}
                    tekstfeltRef={nyttSamarbeidsmålRef}
                    tekst={nyttSamarbeidsmål}
                    feil={ulagretFeil.nyttSamarbeidsmål ?? nyttSamarbeidsmålfeil}
                    sjekk={nyttSjekk}
                    onEndre={(tekst) => {
                        setNyttSamarbeidsmål(tekst);
                        setNyttSamarbeidsmålfeil(undefined);
                        setNyttSjekk(undefined);
                        setUlagretNyttSamarbeidsmål(false);
                    }}
                    onLagre={() => leggTilSamarbeidsmål()}
                    onLagreLikevel={() => leggTilSamarbeidsmål(true)}
                />
                <Statusmelding status={statusmelding} />
                {samarbeidsmål.length > 0 && (
                    <Box
                        borderWidth="2 0 0 0"
                        borderColor="accent"
                        paddingBlock="space-24 space-0"
                    >
                        <VStack gap="space-16">
                            <Heading
                                level="3"
                                size="small"
                                ref={samarbeidsmålListeRef}
                                tabIndex={-1}
                            >
                                Mål for samarbeidet
                                <BodyShort as="span" visuallyHidden>
                                    mål som er lagt til
                                </BodyShort>
                            </Heading>
                            <VStack gap="space-12">
                                {samarbeidsmål.map((m) => (
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
                                            startSamarbeidsredigering(m.nøkkel)
                                        }
                                        onSlett={() =>
                                            slettSamarbeidsmål(m.nøkkel)
                                        }
                                        redigering={
                                            kort?.nøkkel === m.nøkkel
                                                ? {
                                                      ...kort,
                                                      onEndre:
                                                          endreSamarbeidskort,
                                                      onLagre: () =>
                                                          lagreRedigertSamarbeidsmål(
                                                              m.nøkkel,
                                                          ),
                                                      onLagreLikevel: () =>
                                                          lagreRedigertSamarbeidsmål(
                                                              m.nøkkel,
                                                              true,
                                                          ),
                                                      onAvbryt: () =>
                                                          avsluttSamarbeidsredigering(
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
                {lagringFeilet && <Lagringsfeil />}
            </VStack>
        </Box>
    );
}
