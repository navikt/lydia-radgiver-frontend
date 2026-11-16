import React from "react";
import { Button, Dialog, LocalAlert, VStack } from "@navikt/ds-react";
import { IASak } from "../../../domenetyper/domenetyper";
import { Feiloppsummering } from "./Feiloppsummering";
import {
    FEILMELDINGER,
    FELTREKKEFØLGE,
    harInnholdISykefraværsutkast,
    kiAdvarsel,
    lagIdPrefiks,
    lagreLikevelId,
    Mål,
    nyttSamarbeidsmålFeltId,
    nyttSykefraværsmålPrefiks,
    oppdaterSamarbeidsmålutkast,
    oppdaterSykefraværsmålIListe,
    opptatteTyper,
    redigerKnappId,
    Samarbeidsmål,
    samarbeidsmålFeltId,
    Samarbeidsmålutkast,
    Sjekk,
    skjemaId,
    sykefraværskortPrefiks,
    Sykefraværsmål,
    SykefraværsmålIListe,
    Sykefraværsmålutkast,
    tilFeillenke,
    tilSamarbeidsmål,
    tilSamarbeidsmålutkast,
    tilSykefraværsmålIListe,
    tilUtkast,
    tomtSamarbeidsmål,
    tomtUtkast,
    ulagretSamarbeidskortfeil,
    ulagretSamarbeidsmålfeil,
    validerSykefraværsmål,
} from "./målskjema";
import { sjekkTekst } from "./tekstsjekk";
import { Status } from "./Statusmelding";
import { Sykefraværsmålseksjon } from "./Sykefraværsmålseksjon";
import { Samarbeidsmålseksjon } from "./Samarbeidsmålseksjon";

type Måltype = Status["gjelder"];

export function MålDialog({
    open,
    onOpenChange,
    lagret,
    onLagreSykefraværsmål,
    onLagreSamarbeidsmål,
    iaSak,
}: {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    lagret: Mål;
    onLagreSykefraværsmål: (liste: Sykefraværsmål[]) => Promise<Mål>;
    onLagreSamarbeidsmål: (liste: Samarbeidsmål[]) => Promise<Mål>;
    iaSak: IASak;
}) {
    const idPrefiks = lagIdPrefiks(React.useId());
    const nyttSykefraværsprefiks = nyttSykefraværsmålPrefiks(idPrefiks);
    const nyttSamarbeidsmålId = nyttSamarbeidsmålFeltId(idPrefiks);
    const sykefraværsmålListeRef = React.useRef<HTMLHeadingElement>(null);
    const samarbeidsmålListeRef = React.useRef<HTMLHeadingElement>(null);
    const nyttSamarbeidsmålRef = React.useRef<HTMLTextAreaElement>(null);

    const [sykefraværsmål, setSykefraværsmål] = React.useState<
        SykefraværsmålIListe[]
    >(() => lagret.sykefraværsmål.map(tilSykefraværsmålIListe));
    const [nyttUtkast, setNyttUtkast] = React.useState(tomtUtkast);
    const [ulagretNyttSykefraværsmål, setUlagretNyttSykefraværsmål] =
        React.useState(false);
    const [sykefraværskort, setSykefraværskort] = React.useState<{
        utkast: Sykefraværsmålutkast;
        visFeil: boolean;
        ulagret: boolean;
    }>();

    const [samarbeidsmål, setSamarbeidsmål] = React.useState<
        Samarbeidsmålutkast[]
    >(() => lagret.samarbeidsmål.map(tilSamarbeidsmålutkast));
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
    const [fokuserListe, setFokuserListe] = React.useState(0);
    const [lagringFeilet, setLagringFeilet] = React.useState<
        Partial<Record<Måltype, boolean>>
    >({});
    const lagrer = React.useRef<Partial<Record<Måltype, boolean>>>({});
    // Tittelen skal ikke bytte fra «Mål» til «Rediger mål» mens dialogen er åpen.
    const [harLagredeMål] = React.useState(
        () =>
            lagret.sykefraværsmål.length > 0 || lagret.samarbeidsmål.length > 0,
    );

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
        nyttSamarbeidsmål: ulagretNyttSamarbeidsmål
            ? ulagretSamarbeidsmålfeil(nyttSjekk)
            : undefined,
        samarbeidskort: samarbeidskort?.ulagret
            ? ulagretSamarbeidskortfeil(samarbeidskort.sjekk)
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
        ...tilFeillenke(nyttSamarbeidsmålId, ulagretFeil.nyttSamarbeidsmål),
        ...(samarbeidskort
            ? tilFeillenke(
                  samarbeidsmålFeltId(idPrefiks, samarbeidskort.nøkkel),
                  ulagretFeil.samarbeidskort,
              )
            : []),
    ];

    // Én lagring om gangen per måltype, så et dobbeltklikk ikke lagrer samme mål to ganger.
    const lagreMåltype = async (
        måltype: Måltype,
        lagre: () => Promise<void>,
    ) => {
        if (lagrer.current[måltype]) return false;
        lagrer.current[måltype] = true;
        try {
            await lagre();
            setLagringFeilet((f) => ({ ...f, [måltype]: false }));
            return true;
        } catch {
            setLagringFeilet((f) => ({ ...f, [måltype]: true }));
            setStatusmelding(undefined);
            return false;
        } finally {
            lagrer.current[måltype] = false;
        }
    };

    const lagreSykefraværsmål = (liste: SykefraværsmålIListe[]) =>
        lagreMåltype("sykefravær", async () => {
            const svar = await onLagreSykefraværsmål(liste.map((r) => r.mål));
            setSykefraværsmål(
                oppdaterSykefraværsmålIListe(liste, svar.sykefraværsmål),
            );
        });

    const lagreSamarbeidsmål = (liste: Samarbeidsmålutkast[]) =>
        lagreMåltype("samarbeid", async () => {
            const svar = await onLagreSamarbeidsmål(
                liste.map(tilSamarbeidsmål),
            );
            setSamarbeidsmål(
                oppdaterSamarbeidsmålutkast(liste, svar.samarbeidsmål),
            );
        });

    const leggTilSykefraværsmål = async (mål: Sykefraværsmål) => {
        const lagret = await lagreSykefraværsmål([
            ...sykefraværsmål,
            { id: nyttUtkast.id, mål },
        ]);
        if (!lagret) return;
        setNyttUtkast(tomtUtkast());
        setUlagretNyttSykefraværsmål(false);
        setStatusmelding({ gjelder: "sykefravær", tekst: "Lagret" });
        setFokuserListe((n) => n + 1);
    };

    const slettSykefraværsmål = async (id: string) => {
        const gjenstår = sykefraværsmål.filter((r) => r.id !== id);
        if (!(await lagreSykefraværsmål(gjenstår))) return;
        setSykefraværskort((k) => (k?.utkast.id === id ? undefined : k));
        setStatusmelding({ gjelder: "sykefravær", tekst: "Slettet" });
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
        setStatusmelding({ gjelder: "sykefravær", tekst: "Lagret" });
        avsluttSykefraværsredigering(id);
    };

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
        setStatusmelding({ gjelder: "samarbeid", tekst: "Lagret" });
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
        setStatusmelding({ gjelder: "samarbeid", tekst: "Lagret" });
        setNyttSamarbeidsmål("");
        setNyttSjekk(undefined);
        setNyttSamarbeidsmålfeil(undefined);
        setUlagretNyttSamarbeidsmål(false);
    };

    const slettSamarbeidsmål = async (nøkkel: string) => {
        const gjenstår = samarbeidsmål.filter((m) => m.nøkkel !== nøkkel);
        if (!(await lagreSamarbeidsmål(gjenstår))) return;
        setSamarbeidskort((k) => (k?.nøkkel === nøkkel ? undefined : k));
        setStatusmelding({ gjelder: "samarbeid", tekst: "Slettet" });
        if (gjenstår.length === 0) {
            nyttSamarbeidsmålRef.current?.focus();
        } else {
            samarbeidsmålListeRef.current?.focus();
        }
    };

    const lukk = () => {
        const harUlagretNyttSykefraværsmål =
            harInnholdISykefraværsutkast(nyttUtkast);
        if (harUlagretNyttSykefraværsmål) {
            setUlagretNyttSykefraværsmål(true);
        }
        const harUlagretSamarbeidsmål = nyttSamarbeidsmål.trim() !== "";
        if (harUlagretSamarbeidsmål) {
            setUlagretNyttSamarbeidsmål(true);
        }
        const harUlagretKortendring = samarbeidskort !== undefined;
        if (harUlagretKortendring) {
            setSamarbeidskort((k) => k && { ...k, ulagret: true });
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
        onOpenChange(false);
    };

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
                        <Sykefraværsmålseksjon
                            idPrefiks={idPrefiks}
                            mål={sykefraværsmål}
                            nyttUtkast={nyttUtkast}
                            nyttUlagretFeil={ulagretFeil.nyttSykefraværsmål}
                            onEndreNytt={(endring) => {
                                setNyttUtkast((forrige) => ({
                                    ...forrige,
                                    ...endring,
                                }));
                                setUlagretNyttSykefraværsmål(false);
                            }}
                            onLeggTil={leggTilSykefraværsmål}
                            kort={
                                sykefraværskort && {
                                    utkast: sykefraværskort.utkast,
                                    feil:
                                        sykefraværskort.visFeil &&
                                        sykefraværskortresultat &&
                                        !sykefraværskortresultat.ok
                                            ? sykefraværskortresultat.feil
                                            : {},
                                    ulagretFeil: ulagretFeil.sykefraværskort,
                                }
                            }
                            onStartRedigering={startSykefraværsredigering}
                            onEndreKort={endreSykefraværskort}
                            onLagreKort={lagreRedigertSykefraværsmål}
                            onAvbrytKort={avsluttSykefraværsredigering}
                            onSlett={slettSykefraværsmål}
                            statusmelding={statusmelding}
                            listeRef={sykefraværsmålListeRef}
                        >
                            {lagringFeilet.sykefravær && <Lagringsfeil />}
                        </Sykefraværsmålseksjon>
                        <Samarbeidsmålseksjon
                            idPrefiks={idPrefiks}
                            mål={samarbeidsmål}
                            nyttTekst={nyttSamarbeidsmål}
                            nyttFeil={
                                ulagretFeil.nyttSamarbeidsmål ??
                                nyttSamarbeidsmålfeil
                            }
                            nyttSjekk={nyttSjekk}
                            nyttTekstfeltRef={nyttSamarbeidsmålRef}
                            onEndreNytt={(tekst) => {
                                setNyttSamarbeidsmål(tekst);
                                setNyttSamarbeidsmålfeil(undefined);
                                setNyttSjekk(undefined);
                                setUlagretNyttSamarbeidsmål(false);
                            }}
                            onLeggTil={leggTilSamarbeidsmål}
                            kort={
                                samarbeidskort && {
                                    nøkkel: samarbeidskort.nøkkel,
                                    tekst: samarbeidskort.tekst,
                                    feil:
                                        ulagretFeil.samarbeidskort ??
                                        samarbeidskort.feil,
                                    sjekk: samarbeidskort.sjekk,
                                }
                            }
                            onStartRedigering={startSamarbeidsredigering}
                            onEndreKort={endreSamarbeidskort}
                            onLagreKort={lagreRedigertSamarbeidsmål}
                            onAvbrytKort={avsluttSamarbeidsredigering}
                            onSlett={slettSamarbeidsmål}
                            statusmelding={statusmelding}
                            listeRef={samarbeidsmålListeRef}
                        >
                            {lagringFeilet.samarbeid && <Lagringsfeil />}
                        </Samarbeidsmålseksjon>
                    </VStack>
                </Dialog.Body>
                <Dialog.Footer>
                    <Button type="button" onClick={lukk}>
                        Lukk
                    </Button>
                </Dialog.Footer>
            </Dialog.Popup>
        </Dialog>
    );
}

function Lagringsfeil() {
    return (
        <LocalAlert status="error">
            <LocalAlert.Header>
                <LocalAlert.Title as="h3">Kunne ikke lagre målet</LocalAlert.Title>
            </LocalAlert.Header>
            <LocalAlert.Content>
                Endringen er ikke lagret. Prøv igjen.
            </LocalAlert.Content>
        </LocalAlert>
    );
}
