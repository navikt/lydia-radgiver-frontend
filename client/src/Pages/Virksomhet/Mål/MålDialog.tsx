import React from "react";
import {
    BodyLong,
    Box,
    Button,
    Dialog,
    ErrorMessage,
    Heading,
    HGrid,
    HStack,
    InlineMessage,
    LocalAlert,
    Textarea,
    VStack,
} from "@navikt/ds-react";
import { PencilIcon, TrashIcon } from "@navikt/aksel-icons";
import {
    PersonopplysningssjekkResultat,
    sjekkPersonopplysninger,
} from "../../../api/lydia-api/personopplysningssjekk";
import { IASak } from "../../../domenetyper/domenetyper";
import { Feiloppsummering } from "./Feiloppsummering";
import {
    erEndretSamarbeidsmål,
    FEILMELDINGER,
    lagIdPrefiks,
    MAKS_ANTALL_TEGN_I_MÅL,
    opptatteTyper,
    Samarbeidsmålutkast,
    Mål,
    Sykefraværsmål,
    SykefraværsmålIListe,
    Sykefraværsmåltype,
    Sykefraværsmålutkast,
    skjemaId,
    tilSamarbeidsmål,
    tilSamarbeidsmålutkast,
    tilSykefraværsmålIListe,
    tilUtkast,
    tomtSamarbeidsmål,
    tomtUtkast,
    harInnholdISykefraværsutkast,
    validerSykefraværsmål,
    Valideringsfeil,
} from "./målskjema";
import { NyttSykefraværsmålSkjema } from "./NyttSykefraværsmålSkjema";
import { Personopplysningsadvarsel } from "./Personopplysningsadvarsel";
import { SykefraværsmålFelter } from "./SykefraværsmålFelter";
import styles from "./mål.module.scss";
import {
    SykefraværsmåltypeOverskrift,
    Målverdier,
} from "./Sykefraværsmålvisning";

const samarbeidsmålFeltId = (idPrefiks: string, nøkkel: string) =>
    `${idPrefiks}-samarbeidsmal-${nøkkel}`;

export function MålDialog({
    open,
    onOpenChange,
    lagret,
    onLagre,
    iaSak,
}: {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    lagret: Mål;
    onLagre: (mål: Mål) => Promise<void>;
    iaSak: IASak;
}) {
    const idPrefiks = lagIdPrefiks(React.useId());
    const redigerOverskriftRef = React.useRef<HTMLHeadingElement>(null);
    const samarbeidsmålListeRef = React.useRef<HTMLHeadingElement>(null);

    const [sykefraværsmål, setSykefraværsmål] = React.useState<
        SykefraværsmålIListe[]
    >(() => lagret.sykefraværsmål.map(tilSykefraværsmålIListe));
    const [samarbeidsmål, setSamarbeidsmål] = React.useState<
        Samarbeidsmålutkast[]
    >(() => lagret.samarbeidsmål.map(tilSamarbeidsmålutkast));
    const [nyttSamarbeidsmål, setNyttSamarbeidsmål] = React.useState("");
    const [samarbeidsmålfeil, setSamarbeidsmålfeil] = React.useState<string>();
    const [samarbeidsmålstatus, setSamarbeidsmålstatus] = React.useState("");
    const nyttSamarbeidsmålRef = React.useRef<HTMLTextAreaElement>(null);
    const nyttSamarbeidsmålId = `${idPrefiks}-nytt-samarbeidsmal`;
    const samarbeidsmålListeOverskriftId = `${idPrefiks}-samarbeidsmal-liste`;
    const [samarbeidsfritekstkort, setSamarbeidsfritekstkort] =
        React.useState<{ nøkkel: string; tekst: string; feil?: string }>();
    const [fokusmål, setFokusmål] = React.useState<{ id: string }>();
    const [sykefraværskort, setSykefraværskort] = React.useState<{
        utkast: Sykefraværsmålutkast;
        visFeil: boolean;
        ulagret: boolean;
    }>();
    const [skjemaversjon, setSkjemaversjon] = React.useState(0);
    const [nyttUtkast, setNyttUtkast] = React.useState(tomtUtkast);
    const [ulagretNyttSykefraværsmål, setUlagretNyttSykefraværsmål] =
        React.useState(false);
    const nyttSykefraværsmålPrefiks = `${idPrefiks}-nytt-sykefravaersmal`;
    const [statusmelding, setStatusmelding] = React.useState("");
    const [fokusteller, setFokusteller] = React.useState(0);
    const [lagrer, setLagrer] = React.useState(false);
    const [funn, setFunn] = React.useState<
        Record<string, PersonopplysningssjekkResultat>
    >({});
    const [sjekkFeilet, setSjekkFeilet] = React.useState(false);
    const [lagringFeilet, setLagringFeilet] = React.useState(false);
    const [fokuserListe, setFokuserListe] = React.useState(0);

    React.useEffect(() => {
        if (fokuserListe > 0) redigerOverskriftRef.current?.focus();
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
    const feillenker = [
        ...(ulagretNyttSykefraværsmål
            ? [
                  {
                      href: `#${skjemaId(nyttSykefraværsmålPrefiks, "type")}`,
                      melding: FEILMELDINGER.ulagretNyttSykefraværsmål,
                  },
              ]
            : []),
        ...(sykefraværskort?.ulagret
            ? [
                  {
                      href: `#${skjemaId(`${idPrefiks}-${sykefraværskort.utkast.id}`, "type")}`,
                      melding: FEILMELDINGER.ulagretEndringSykefraværsmål,
                  },
              ]
            : []),
        ...(samarbeidsmålfeil === FEILMELDINGER.ulagretSamarbeidsmål
            ? [{ href: `#${nyttSamarbeidsmålId}`, melding: samarbeidsmålfeil }]
            : []),
        ...(samarbeidsfritekstkort?.feil ===
        FEILMELDINGER.ulagretEndringSamarbeidsmål
            ? [
                  {
                      href: `#${samarbeidsmålFeltId(idPrefiks, samarbeidsfritekstkort.nøkkel)}`,
                      melding: samarbeidsfritekstkort.feil,
                  },
              ]
            : []),
    ];

    const lagreFraSkjema = (mål: Sykefraværsmål) => {
        setSykefraværsmål((forrige) => [
            ...forrige,
            { id: nyttUtkast.id, mål },
        ]);
        setNyttUtkast(tomtUtkast());
        setUlagretNyttSykefraværsmål(false);
        setStatusmelding("Lagret");
        setSamarbeidsmålstatus("");
        setSkjemaversjon((n) => n + 1);
        setFokuserListe((n) => n + 1);
    };

    const slett = (id: string) => {
        const slettet = sykefraværsmål.find((r) => r.id === id);
        setSykefraværsmål((forrige) => forrige.filter((r) => r.id !== id));
        if (sykefraværskort?.utkast.id === id) {
            setSykefraværskort(undefined);
        }
        if (slettet) {
            setStatusmelding("Slettet");
            setSamarbeidsmålstatus("");
        }
        if (sykefraværsmål.length === 1 && slettet) {
            setFokusmål({ id: skjemaId(nyttSykefraværsmålPrefiks, "type") });
        } else {
            redigerOverskriftRef.current?.focus();
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
        setFokusmål({ id: skjemaId(`${idPrefiks}-${id}`, "type") });
    };

    const avsluttSykefraværsredigering = (id: string) => {
        setSykefraværskort(undefined);
        setFokusmål({ id: `${idPrefiks}-${id}-rediger` });
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

    const lagreSykefraværskort = () => {
        if (!sykefraværskort || !sykefraværskortresultat) return;
        const id = sykefraværskort.utkast.id;
        if (!sykefraværskortresultat.ok) {
            setSykefraværskort((k) => k && { ...k, visFeil: true });
            const førsteFeil = (
                ["type", "nåværende", "mål", "frist"] as const
            ).find((felt) => sykefraværskortresultat.feil[felt]);
            if (førsteFeil) {
                setFokusmål({
                    id: skjemaId(`${idPrefiks}-${id}`, førsteFeil),
                });
            }
            return;
        }
        const mål = sykefraværskortresultat.mål;
        setSykefraværsmål((forrige) =>
            forrige.map((r) => (r.id === id ? { id: r.id, mål } : r)),
        );
        setStatusmelding("Lagret");
        setSamarbeidsmålstatus("");
        avsluttSykefraværsredigering(id);
    };

    const nullstillSjekk = () => {
        setFunn({});
        setSjekkFeilet(false);
        setLagringFeilet(false);
    };

    const startKortredigering = (nøkkel: string) => {
        const mål = samarbeidsmål.find((m) => m.nøkkel === nøkkel);
        if (!mål) return;
        setSamarbeidsfritekstkort({ nøkkel, tekst: mål.mål });
        setFokusmål({ id: samarbeidsmålFeltId(idPrefiks, nøkkel) });
    };

    const avsluttKortredigering = (nøkkel: string) => {
        setSamarbeidsfritekstkort(undefined);
        setFokusmål({
            id: `${samarbeidsmålFeltId(idPrefiks, nøkkel)}-rediger`,
        });
    };

    const endreSamarbeidsfritekst = (tekst: string) =>
        setSamarbeidsfritekstkort((k) => k && { ...k, tekst, feil: undefined });

    const lagreKortendring = (nøkkel: string) => {
        if (!samarbeidsfritekstkort) return;
        const tekst = samarbeidsfritekstkort.tekst.trim();
        if (tekst === "") {
            setSamarbeidsfritekstkort(
                (k) => k && { ...k, feil: FEILMELDINGER.tomtSamarbeidsmål },
            );
            setFokusmål({ id: samarbeidsmålFeltId(idPrefiks, nøkkel) });
            return;
        }
        setSamarbeidsmål((forrige) =>
            forrige.map((m) =>
                m.nøkkel === nøkkel ? { ...m, mål: tekst } : m,
            ),
        );
        setSamarbeidsmålstatus("Lagret");
        setStatusmelding("");
        nullstillSjekk();
        avsluttKortredigering(nøkkel);
    };

    const leggTilSamarbeidsmål = () => {
        const tekst = nyttSamarbeidsmål.trim();
        if (tekst === "") {
            setSamarbeidsmålfeil(FEILMELDINGER.tomtSamarbeidsmål);
            nyttSamarbeidsmålRef.current?.focus();
            return;
        }
        setSamarbeidsmål((forrige) => [
            ...forrige,
            { ...tomtSamarbeidsmål(), mål: tekst },
        ]);
        setSamarbeidsmålstatus("Lagret");
        setNyttSamarbeidsmål("");
        setSamarbeidsmålfeil(undefined);
        setStatusmelding("");
        nullstillSjekk();
    };

    const slettSamarbeidsmål = (nøkkel: string) => {
        setSamarbeidsmål((forrige) =>
            forrige.filter((m) => m.nøkkel !== nøkkel),
        );
        if (samarbeidsfritekstkort?.nøkkel === nøkkel) {
            setSamarbeidsfritekstkort(undefined);
        }
        nullstillSjekk();
        setStatusmelding("");
        setSamarbeidsmålstatus("Slettet");
        if (samarbeidsmål.length === 1) {
            nyttSamarbeidsmålRef.current?.focus();
        } else {
            samarbeidsmålListeRef.current?.focus();
        }
    };

    const send = async (nyeMål: Mål) => {
        try {
            await onLagre(nyeMål);
            onOpenChange(false);
        } catch {
            setLagringFeilet(true);
        }
    };

    const lagre = async (lagreLikevel = false) => {
        const harUlagretNyttSykefraværsmål =
            harInnholdISykefraværsutkast(nyttUtkast);
        if (harUlagretNyttSykefraværsmål) {
            setUlagretNyttSykefraværsmål(true);
        }
        const harUlagretSamarbeidsmål = nyttSamarbeidsmål.trim() !== "";
        if (harUlagretSamarbeidsmål) {
            setSamarbeidsmålfeil(FEILMELDINGER.ulagretSamarbeidsmål);
        }
        const harUlagretKortendring = samarbeidsfritekstkort !== undefined;
        if (harUlagretKortendring) {
            setSamarbeidsfritekstkort(
                (k) =>
                    k && {
                        ...k,
                        feil: FEILMELDINGER.ulagretEndringSamarbeidsmål,
                    },
            );
        }
        const harUlagretSykefraværskort = sykefraværskort !== undefined;
        if (harUlagretSykefraværskort) {
            setSykefraværskort((k) => k && { ...k, ulagret: true });
        }
        if (
            harUlagretNyttSykefraværsmål ||
            harUlagretSamarbeidsmål ||
            harUlagretKortendring ||
            harUlagretSykefraværskort
        ) {
            setFokusteller((n) => n + 1);
            return;
        }

        const tilSjekk = lagreLikevel
            ? []
            : samarbeidsmål.filter((m) =>
                  erEndretSamarbeidsmål(m, lagret.samarbeidsmål),
              );

        setLagrer(true);
        setSjekkFeilet(false);
        setLagringFeilet(false);
        try {
            const resultater = await Promise.all(
                tilSjekk.map(async (m) => {
                    const resultat = await sjekkPersonopplysninger(
                        iaSak.orgnr,
                        iaSak.saksnummer,
                        m.mål,
                    );
                    return [m.nøkkel, resultat] as const;
                }),
            ).catch(() => null);

            if (resultater === null) {
                setSjekkFeilet(true);
                return;
            }

            const nyeFunn = Object.fromEntries(
                resultater.filter(
                    ([, resultat]) => resultat.kanInneholdePersonopplysninger,
                ),
            );
            if (Object.keys(nyeFunn).length > 0) {
                setFunn(nyeFunn);
                return;
            }

            await send({
                sykefraværsmål: sykefraværsmål.map((r) => r.mål),
                samarbeidsmål: samarbeidsmål.map((m) =>
                    tilSamarbeidsmål(
                        m,
                        lagret.samarbeidsmål,
                        lagreLikevel && funn[m.nøkkel] !== undefined,
                    ),
                ),
            });
        } finally {
            setLagrer(false);
        }
    };

    const harLagredeMål =
        lagret.sykefraværsmål.length > 0 || lagret.samarbeidsmål.length > 0;
    const tilbyLagreLikevel = Object.keys(funn).length > 0 || sjekkFeilet;
    const samarbeidsmålOverskriftId = `${idPrefiks}-samarbeidsmal`;
    const listeOverskriftId = `${idPrefiks}-liste`;

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <Dialog.Popup width="large">
                <Dialog.Header>
                    <Dialog.Title>
                        {harLagredeMål ? "Rediger mål" : "Mål"}
                    </Dialog.Title>
                    <Dialog.Description>
                        Legg til mål for sykefraværet og samarbeidet.
                    </Dialog.Description>
                </Dialog.Header>
                <Dialog.Body>
                    <VStack gap="space-32">
                        <Feiloppsummering
                            feil={feillenker}
                            fokusteller={fokusteller}
                        />
                        <div>
                            <VStack gap="space-16">
                                <NyttSykefraværsmålSkjema
                                    key={`nytt-${skjemaversjon}`}
                                    opptatte={opptatteTyper(sykefraværsmål)}
                                    utkast={nyttUtkast}
                                    oppdater={(endring) => {
                                        setNyttUtkast((forrige) => ({
                                            ...forrige,
                                            ...endring,
                                        }));
                                        setUlagretNyttSykefraværsmål(false);
                                    }}
                                    idPrefiks={nyttSykefraværsmålPrefiks}
                                    ulagretFeil={
                                        ulagretNyttSykefraværsmål
                                            ? FEILMELDINGER.ulagretNyttSykefraværsmål
                                            : undefined
                                    }
                                    onLagre={lagreFraSkjema}
                                />
                                <div role="status">
                                    {statusmelding && (
                                        <InlineMessage
                                            status="success"
                                            size="small"
                                        >
                                            {statusmelding}
                                        </InlineMessage>
                                    )}
                                </div>
                            </VStack>
                        </div>

                        {sykefraværsmål.length > 0 && (
                            <Box
                                borderWidth="2 0 0 0"
                                borderColor="accent"
                                paddingBlock="space-24 space-0"
                            >
                                <VStack gap="space-16">
                                    <div>
                                        <Heading
                                            level="3"
                                            size="small"
                                            id={listeOverskriftId}
                                            ref={redigerOverskriftRef}
                                            tabIndex={-1}
                                        >
                                            Mål for sykefraværet
                                        </Heading>
                                    </div>
                                    <HGrid
                                        columns={{ xs: 1, lg: 2 }}
                                        gap="space-16"
                                    >
                                        {sykefraværsmål.map((r) => (
                                            <Sykefraværsmålkort
                                                key={r.id}
                                                idPrefiks={`${idPrefiks}-${r.id}`}
                                                mål={r.mål}
                                                onRediger={() =>
                                                    startSykefraværsredigering(
                                                        r.id,
                                                    )
                                                }
                                                onSlett={() => slett(r.id)}
                                                redigering={
                                                    sykefraværskort?.utkast
                                                        .id === r.id
                                                        ? {
                                                              utkast: sykefraværskort.utkast,
                                                              opptatte:
                                                                  opptatteTyper(
                                                                      sykefraværsmål,
                                                                      r.id,
                                                                  ),
                                                              feil:
                                                                  sykefraværskort.visFeil &&
                                                                  sykefraværskortresultat &&
                                                                  !sykefraværskortresultat.ok
                                                                      ? sykefraværskortresultat.feil
                                                                      : {},
                                                              ulagretFeil:
                                                                  sykefraværskort.ulagret
                                                                      ? FEILMELDINGER.ulagretEndringSykefraværsmål
                                                                      : undefined,
                                                              oppdater:
                                                                  endreSykefraværskort,
                                                              onLagre:
                                                                  lagreSykefraværskort,
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

                        <Box
                            borderWidth="1 0 0 0"
                            borderColor="neutral-subtle"
                            paddingBlock="space-24 space-0"
                        >
                            <VStack gap="space-16">
                                <Box
                                    background="neutral-soft"
                                    borderRadius="12"
                                    padding={{ xs: "space-16", md: "space-24" }}
                                >
                                    <VStack gap="space-16">
                                        <Heading
                                            level="2"
                                            size="small"
                                            id={samarbeidsmålOverskriftId}
                                        >
                                            Mål for samarbeidet
                                        </Heading>
                                        <Textarea
                                            ref={nyttSamarbeidsmålRef}
                                            id={nyttSamarbeidsmålId}
                                            label="Legg til mål"
                                            description="Husk ingen personopplysninger."
                                            maxLength={MAKS_ANTALL_TEGN_I_MÅL}
                                            value={nyttSamarbeidsmål}
                                            error={samarbeidsmålfeil}
                                            onChange={(e) => {
                                                setNyttSamarbeidsmål(
                                                    e.target.value,
                                                );
                                                setSamarbeidsmålfeil(
                                                    undefined,
                                                );
                                            }}
                                        />
                                        <HStack gap="space-8" wrap>
                                            <Button
                                                type="button"
                                                onClick={leggTilSamarbeidsmål}
                                                aria-describedby={
                                                    samarbeidsmålOverskriftId
                                                }
                                            >
                                                Lagre
                                            </Button>
                                        </HStack>
                                    </VStack>
                                </Box>
                                <div role="status">
                                    {samarbeidsmålstatus && (
                                        <InlineMessage
                                            status="success"
                                            size="small"
                                        >
                                            {samarbeidsmålstatus}
                                        </InlineMessage>
                                    )}
                                </div>
                                {samarbeidsmål.length > 0 && (
                                    <Box
                                        borderWidth="2 0 0 0"
                                        borderColor="accent"
                                        paddingBlock="space-24 space-0"
                                    >
                                        <VStack gap="space-16">
                                            <div>
                                                <Heading
                                                    level="3"
                                                    size="small"
                                                    id={
                                                        samarbeidsmålListeOverskriftId
                                                    }
                                                    ref={samarbeidsmålListeRef}
                                                    tabIndex={-1}
                                                >
                                                    Mål for samarbeidet
                                                </Heading>
                                            </div>
                                            <VStack gap="space-12">
                                                {samarbeidsmål.map((m) => (
                                                    <Samarbeidsmålkort
                                                        key={m.nøkkel}
                                                        feltId={samarbeidsmålFeltId(
                                                            idPrefiks,
                                                            m.nøkkel,
                                                        )}
                                                        mål={m.mål}
                                                        funn={funn[m.nøkkel]}
                                                        onRediger={() =>
                                                            startKortredigering(
                                                                m.nøkkel,
                                                            )
                                                        }
                                                        onSlett={() =>
                                                            slettSamarbeidsmål(
                                                                m.nøkkel,
                                                            )
                                                        }
                                                        redigering={
                                                            samarbeidsfritekstkort?.nøkkel ===
                                                            m.nøkkel
                                                                ? {
                                                                      tekst: samarbeidsfritekstkort.tekst,
                                                                      feil: samarbeidsfritekstkort.feil,
                                                                      onEndre:
                                                                          endreSamarbeidsfritekst,
                                                                      onLagre: () =>
                                                                          lagreKortendring(
                                                                              m.nøkkel,
                                                                          ),
                                                                      onAvbryt: () =>
                                                                          avsluttKortredigering(
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
                                {sjekkFeilet && (
                                    <LocalAlert status="error">
                                        <LocalAlert.Header>
                                            <LocalAlert.Title as="h3">
                                                Kunne ikke sjekke teksten
                                            </LocalAlert.Title>
                                        </LocalAlert.Header>
                                        <LocalAlert.Content>
                                            Vi fikk ikke sjekket om teksten
                                            inneholder personopplysninger. Prøv
                                            igjen, eller lagre likevel hvis du
                                            er sikker på at teksten er i orden.
                                        </LocalAlert.Content>
                                    </LocalAlert>
                                )}
                                {lagringFeilet && (
                                    <LocalAlert status="error">
                                        <LocalAlert.Header>
                                            <LocalAlert.Title as="h3">
                                                Kunne ikke lagre målene
                                            </LocalAlert.Title>
                                        </LocalAlert.Header>
                                        <LocalAlert.Content>
                                            Endringene er ikke lagret. Prøv
                                            igjen.
                                        </LocalAlert.Content>
                                    </LocalAlert>
                                )}
                            </VStack>
                        </Box>
                    </VStack>
                </Dialog.Body>
                <Dialog.Footer>
                    <Button
                        type="button"
                        onClick={() => lagre()}
                        loading={lagrer}
                    >
                        Lagre
                    </Button>
                    {tilbyLagreLikevel && (
                        <Button
                            type="button"
                            variant="secondary"
                            onClick={() => lagre(true)}
                            disabled={lagrer}
                        >
                            Lagre likevel
                        </Button>
                    )}
                    <Dialog.CloseTrigger>
                        <Button type="button" variant="secondary">
                            Avbryt
                        </Button>
                    </Dialog.CloseTrigger>
                </Dialog.Footer>
            </Dialog.Popup>
        </Dialog>
    );
}

function Målkortramme({ children }: { children: React.ReactNode }) {
    return (
        <Box
            background="default"
            borderColor="neutral-subtle"
            borderWidth="1"
            borderRadius="12"
            padding="space-16"
        >
            <VStack gap="space-12">{children}</VStack>
        </Box>
    );
}

function Målkortknapper({
    redigerId,
    beskrevetAv,
    onRediger,
    onSlett,
}: {
    redigerId: string;
    beskrevetAv: string;
    onRediger: () => void;
    onSlett: () => void;
}) {
    return (
        <HStack gap="space-8" justify="end">
            <Button
                id={redigerId}
                type="button"
                variant="tertiary"
                data-color="neutral"
                size="small"
                icon={<PencilIcon aria-hidden />}
                aria-describedby={beskrevetAv}
                onClick={onRediger}
            >
                Rediger
            </Button>
            <Button
                type="button"
                variant="tertiary"
                data-color="danger"
                size="small"
                icon={<TrashIcon aria-hidden />}
                aria-describedby={beskrevetAv}
                onClick={onSlett}
            >
                Slett
            </Button>
        </HStack>
    );
}

function Sykefraværsmålkort({
    idPrefiks,
    mål,
    onRediger,
    onSlett,
    redigering,
}: {
    idPrefiks: string;
    mål: Sykefraværsmål;
    onRediger: () => void;
    onSlett: () => void;
    redigering?: {
        utkast: Sykefraværsmålutkast;
        opptatte: Sykefraværsmåltype[];
        feil: Valideringsfeil;
        ulagretFeil?: string;
        oppdater: (endring: Partial<Sykefraværsmålutkast>) => void;
        onLagre: () => void;
        onAvbryt: () => void;
    };
}) {
    const overskriftId = `${idPrefiks}-overskrift`;
    const type = redigering ? redigering.utkast.type : mål.type;
    return (
        <Målkortramme>
            {type ? (
                <SykefraværsmåltypeOverskrift
                    type={type}
                    level="4"
                    id={overskriftId}
                />
            ) : (
                <Heading level="4" size="small" id={overskriftId}>
                    Sykefraværsmål
                </Heading>
            )}
            {redigering ? (
                <>
                    <SykefraværsmålFelter
                        utkast={redigering.utkast}
                        oppdater={redigering.oppdater}
                        feil={redigering.feil}
                        idPrefiks={idPrefiks}
                        opptatte={redigering.opptatte}
                        kompakt
                    />
                    <HStack gap="space-8" wrap>
                        <Button
                            type="button"
                            variant="secondary"
                            size="small"
                            aria-describedby={overskriftId}
                            onClick={redigering.onLagre}
                        >
                            Lagre
                        </Button>
                        <Button
                            type="button"
                            variant="tertiary"
                            size="small"
                            aria-describedby={overskriftId}
                            onClick={redigering.onAvbryt}
                        >
                            Avbryt
                        </Button>
                    </HStack>
                    {redigering.ulagretFeil && (
                        <ErrorMessage>{redigering.ulagretFeil}</ErrorMessage>
                    )}
                </>
            ) : (
                <>
                    <Målverdier mål={mål} />
                    <Målkortknapper
                        redigerId={`${idPrefiks}-rediger`}
                        beskrevetAv={overskriftId}
                        onRediger={onRediger}
                        onSlett={onSlett}
                    />
                </>
            )}
        </Målkortramme>
    );
}

function Samarbeidsmålkort({
    feltId,
    mål,
    funn,
    onRediger,
    onSlett,
    redigering,
}: {
    feltId: string;
    mål: string;
    funn?: PersonopplysningssjekkResultat;
    onRediger: () => void;
    onSlett: () => void;
    redigering?: {
        tekst: string;
        feil?: string;
        onEndre: (tekst: string) => void;
        onLagre: () => void;
        onAvbryt: () => void;
    };
}) {
    const tekstId = `${feltId}-tekst`;
    return (
        <Målkortramme>
            {redigering ? (
                <>
                    <Textarea
                        id={feltId}
                        label="Endre mål"
                        description="Husk ingen personopplysninger."
                        maxLength={MAKS_ANTALL_TEGN_I_MÅL}
                        value={redigering.tekst}
                        error={redigering.feil}
                        onChange={(e) => redigering.onEndre(e.target.value)}
                    />
                    <HStack gap="space-8" wrap>
                        <Button
                            type="button"
                            variant="secondary"
                            size="small"
                            onClick={redigering.onLagre}
                        >
                            Lagre
                        </Button>
                        <Button
                            type="button"
                            variant="tertiary"
                            size="small"
                            onClick={redigering.onAvbryt}
                        >
                            Avbryt
                        </Button>
                    </HStack>
                </>
            ) : (
                <BodyLong id={tekstId} className={styles.samarbeidsmaal}>
                    {mål}
                </BodyLong>
            )}
            {funn && <Personopplysningsadvarsel resultat={funn} />}
            {!redigering && (
                <Målkortknapper
                    redigerId={`${feltId}-rediger`}
                    beskrevetAv={tekstId}
                    onRediger={onRediger}
                    onSlett={onSlett}
                />
            )}
        </Målkortramme>
    );
}
