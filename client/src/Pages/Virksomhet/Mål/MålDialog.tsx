import React from "react";
import {
    BodyShort,
    Box,
    Button,
    Dialog,
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
    lagIdPrefiks,
    MAKS_ANTALL_TEGN_I_MÅL,
    SYKEFRAVÆRSMÅLTYPE_NAVN,
    opptatteTyper,
    Samarbeidsmålutkast,
    Mål,
    Sykefraværsmål,
    Sykefraværsmålutkast,
    tilFeillenker,
    tilSamarbeidsmål,
    tilSamarbeidsmålutkast,
    tilUtkast,
    tomtSamarbeidsmål,
    validerSykefraværsmål,
    Valideringsfeil,
} from "./målskjema";
import { NyttSykefraværsmålSkjema } from "./NyttSykefraværsmålSkjema";
import { Personopplysningsadvarsel } from "./Personopplysningsadvarsel";
import { SykefraværsmålFelter } from "./SykefraværsmålFelter";
import {
    SykefraværsmåltypeOverskrift,
    Målverdier,
} from "./Sykefraværsmålvisning";

export type MålDialogModus = "opprett" | "rediger";

const navnPå = (utkast: Sykefraværsmålutkast) =>
    utkast.type ? SYKEFRAVÆRSMÅLTYPE_NAVN[utkast.type] : "Sykefraværsmål";

const samarbeidsmålFeltId = (idPrefiks: string, nøkkel: string) =>
    `${idPrefiks}-samarbeidsmal-${nøkkel}`;

export function MålDialog({
    modus,
    open,
    onOpenChange,
    lagret,
    onLagre,
    iaSak,
}: {
    modus: MålDialogModus;
    open: boolean;
    onOpenChange: (open: boolean) => void;
    lagret: Mål;
    onLagre: (mål: Mål) => Promise<void>;
    iaSak: IASak;
}) {
    const idPrefiks = lagIdPrefiks(React.useId());
    const førsteFeltRef = React.useRef<HTMLSelectElement>(null);
    const redigerOverskriftRef = React.useRef<HTMLHeadingElement>(null);
    const leggTilSamarbeidsmålRef = React.useRef<HTMLButtonElement>(null);

    const [utkast, setUtkast] = React.useState<Sykefraværsmålutkast[]>(() =>
        lagret.sykefraværsmål.map(tilUtkast),
    );
    const [samarbeidsmål, setSamarbeidsmål] = React.useState<
        Samarbeidsmålutkast[]
    >(() =>
        lagret.samarbeidsmål.length > 0
            ? lagret.samarbeidsmål.map(tilSamarbeidsmålutkast)
            : [tomtSamarbeidsmål()],
    );
    const [fokuserSamarbeidsmål, setFokuserSamarbeidsmål] =
        React.useState<string>();
    const [redigererId, setRedigererId] = React.useState<string>();
    const [skjemaversjon, setSkjemaversjon] = React.useState(0);
    const [fokuserSkjema, setFokuserSkjema] = React.useState(false);
    const [statusmelding, setStatusmelding] = React.useState("");
    const [visFeil, setVisFeil] = React.useState(false);
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
        if (!fokuserSamarbeidsmål) return;
        document
            .getElementById(
                samarbeidsmålFeltId(idPrefiks, fokuserSamarbeidsmål),
            )
            ?.focus();
        setFokuserSamarbeidsmål(undefined);
    }, [fokuserSamarbeidsmål, idPrefiks]);

    const valideringer = utkast.map((u) => ({
        utkast: u,
        resultat: validerSykefraværsmål(u, opptatteTyper(utkast, u.id)),
    }));
    const feillenker = visFeil
        ? valideringer.flatMap(({ utkast: u, resultat }) =>
              resultat.ok
                  ? []
                  : tilFeillenker(
                        resultat.feil,
                        `${idPrefiks}-${u.id}`,
                        navnPå(u),
                    ),
          )
        : [];

    const feilFor = (id: string): Valideringsfeil => {
        if (!visFeil) return {};
        const resultat = valideringer.find((v) => v.utkast.id === id)?.resultat;
        return resultat && !resultat.ok ? resultat.feil : {};
    };

    const nullstillSkjema = (fokus: "skjema" | "liste" = "skjema") => {
        setRedigererId(undefined);
        setSkjemaversjon((n) => n + 1);
        setFokuserSkjema(fokus === "skjema");
        if (fokus === "liste") setFokuserListe((n) => n + 1);
    };

    const lagreFraSkjema = (nytt: Sykefraværsmålutkast) => {
        const finnes = utkast.some((u) => u.id === nytt.id);
        setUtkast((forrige) =>
            finnes
                ? forrige.map((u) => (u.id === nytt.id ? nytt : u))
                : [...forrige, nytt],
        );
        setStatusmelding(
            finnes
                ? `Endringene i ${navnPå(nytt).toLowerCase()} er lagt inn.`
                : `${navnPå(nytt)} er lagt til.`,
        );
        nullstillSkjema("liste");
    };

    const slett = (id: string) => {
        const slettet = utkast.find((u) => u.id === id);
        setUtkast((forrige) => forrige.filter((u) => u.id !== id));
        if (slettet) setStatusmelding(`${navnPå(slettet)} er fjernet.`);
        if (modus === "opprett") {
            nullstillSkjema();
        } else {
            redigerOverskriftRef.current?.focus();
        }
    };

    const oppdaterUtkast = (
        id: string,
        endring: Partial<Sykefraværsmålutkast>,
    ) =>
        setUtkast((forrige) =>
            forrige.map((u) => (u.id === id ? { ...u, ...endring } : u)),
        );

    const nullstillSjekk = () => {
        setFunn({});
        setSjekkFeilet(false);
        setLagringFeilet(false);
    };

    const oppdaterSamarbeidsmål = (nøkkel: string, tekst: string) => {
        setSamarbeidsmål((forrige) =>
            forrige.map((m) =>
                m.nøkkel === nøkkel ? { ...m, mål: tekst } : m,
            ),
        );
        nullstillSjekk();
    };

    const leggTilSamarbeidsmål = () => {
        const nytt = tomtSamarbeidsmål();
        setSamarbeidsmål((forrige) => [...forrige, nytt]);
        setFokuserSamarbeidsmål(nytt.nøkkel);
    };

    const slettSamarbeidsmål = (nøkkel: string, nummer: number) => {
        setSamarbeidsmål((forrige) =>
            forrige.filter((m) => m.nøkkel !== nøkkel),
        );
        nullstillSjekk();
        setStatusmelding(`Mål ${nummer} for samarbeidet er fjernet.`);
        leggTilSamarbeidsmålRef.current?.focus();
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
        const gyldige: Sykefraværsmål[] = valideringer.flatMap(
            ({ resultat }) => (resultat.ok ? [resultat.mål] : []),
        );
        if (gyldige.length !== utkast.length) {
            setVisFeil(true);
            setFokusteller((n) => n + 1);
            return;
        }

        const utfylte = samarbeidsmål.filter((m) => m.mål.trim() !== "");
        const tilSjekk = lagreLikevel
            ? []
            : utfylte.filter((m) =>
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
                        m.mål.trim(),
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
                sykefraværsmål: gyldige,
                samarbeidsmål: utfylte.map((m) =>
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

    const redigerer = utkast.find((u) => u.id === redigererId);
    const harInnhold =
        utkast.length > 0 || samarbeidsmål.some((m) => m.mål.trim() !== "");
    const tilbyLagreLikevel = Object.keys(funn).length > 0 || sjekkFeilet;
    const samarbeidsmålOverskriftId = `${idPrefiks}-samarbeidsmal`;
    const sykefraværsmålOverskriftId = `${idPrefiks}-sykefravaersmal`;
    const listeOverskriftId = `${idPrefiks}-liste`;

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <Dialog.Popup width="large">
                <Dialog.Header>
                    <Dialog.Title>
                        {modus === "opprett" ? "Legg til mål" : "Rediger mål"}
                    </Dialog.Title>
                    <Dialog.Description>
                        {modus === "opprett"
                            ? "Legg til sykefraværsmål og mål for samarbeidet."
                            : "Rediger målene direkte i de utfylte skjemaene."}
                    </Dialog.Description>
                </Dialog.Header>
                <Dialog.Body>
                    <VStack gap="space-32">
                        <Feiloppsummering
                            feil={feillenker}
                            fokusteller={fokusteller}
                        />
                        <section aria-labelledby={sykefraværsmålOverskriftId}>
                            <VStack gap="space-16">
                                <div>
                                    <Heading
                                        level="2"
                                        size="medium"
                                        id={sykefraværsmålOverskriftId}
                                    >
                                        Sykefraværsmål
                                    </Heading>
                                    <BodyShort textColor="subtle">
                                        Legg til mål for fraværet dere vil jobbe
                                        med, ett om gangen.
                                    </BodyShort>
                                </div>
                                <NyttSykefraværsmålSkjema
                                    key={redigererId ?? `nytt-${skjemaversjon}`}
                                    alleUtkast={utkast}
                                    redigerer={redigerer}
                                    onLagre={lagreFraSkjema}
                                    onSlett={slett}
                                    onAvbrytRedigering={() => nullstillSkjema()}
                                    førsteFeltRef={førsteFeltRef}
                                    fokuserVedVisning={fokuserSkjema}
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
                        </section>

                        {utkast.length > 0 && (
                            <Box
                                as="section"
                                aria-labelledby={listeOverskriftId}
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
                                            {modus === "opprett"
                                                ? "Opprettede sykefraværsmål"
                                                : "Rediger opprettede sykefraværsmål"}
                                        </Heading>
                                        <BodyShort textColor="subtle">
                                            {modus === "opprett"
                                                ? "Målene dere har lagt til."
                                                : "Endre eller slett målene som allerede er lagt til."}
                                        </BodyShort>
                                    </div>
                                    {modus === "opprett" ? (
                                        <VStack gap="space-12">
                                            {valideringer.map(
                                                ({ utkast: u, resultat }) =>
                                                    resultat.ok && (
                                                        <OpprettetMålkort
                                                            key={u.id}
                                                            mål={resultat.mål}
                                                            onRediger={() => {
                                                                setRedigererId(
                                                                    u.id,
                                                                );
                                                                setFokuserSkjema(
                                                                    true,
                                                                );
                                                            }}
                                                        />
                                                    ),
                                            )}
                                        </VStack>
                                    ) : (
                                        <HGrid
                                            columns={{ xs: 1, lg: 2 }}
                                            gap="space-16"
                                        >
                                            {utkast.map((u) => (
                                                <RedigerbartMålkort
                                                    key={u.id}
                                                    utkast={u}
                                                    alleUtkast={utkast}
                                                    idPrefiks={`${idPrefiks}-${u.id}`}
                                                    feil={feilFor(u.id)}
                                                    oppdater={(endring) =>
                                                        oppdaterUtkast(
                                                            u.id,
                                                            endring,
                                                        )
                                                    }
                                                    onSlett={() => slett(u.id)}
                                                />
                                            ))}
                                        </HGrid>
                                    )}
                                </VStack>
                            </Box>
                        )}

                        <Box
                            as="section"
                            aria-labelledby={samarbeidsmålOverskriftId}
                            borderWidth="1 0 0 0"
                            borderColor="neutral-subtle"
                            paddingBlock="space-24 space-0"
                        >
                            <VStack gap="space-16">
                                <Heading
                                    level="2"
                                    size="medium"
                                    id={samarbeidsmålOverskriftId}
                                >
                                    Mål for samarbeidet
                                </Heading>
                                {samarbeidsmål.map((m, indeks) => (
                                    <VStack key={m.nøkkel} gap="space-8">
                                        <Textarea
                                            id={samarbeidsmålFeltId(
                                                idPrefiks,
                                                m.nøkkel,
                                            )}
                                            label={`Mål ${indeks + 1}`}
                                            description="Husk ingen personopplysninger."
                                            maxLength={MAKS_ANTALL_TEGN_I_MÅL}
                                            value={m.mål}
                                            onChange={(e) =>
                                                oppdaterSamarbeidsmål(
                                                    m.nøkkel,
                                                    e.target.value,
                                                )
                                            }
                                        />
                                        {funn[m.nøkkel] && (
                                            <Personopplysningsadvarsel
                                                resultat={funn[m.nøkkel]}
                                            />
                                        )}
                                        {(m.mål.trim() !== "" ||
                                            samarbeidsmål.length > 1) && (
                                            <div>
                                                <Button
                                                    type="button"
                                                    variant="secondary"
                                                    data-color="danger"
                                                    size="small"
                                                    icon={
                                                        <TrashIcon
                                                            aria-hidden
                                                        />
                                                    }
                                                    onClick={() =>
                                                        slettSamarbeidsmål(
                                                            m.nøkkel,
                                                            indeks + 1,
                                                        )
                                                    }
                                                >
                                                    Slett mål {indeks + 1}
                                                </Button>
                                            </div>
                                        )}
                                    </VStack>
                                ))}
                                <div>
                                    <Button
                                        ref={leggTilSamarbeidsmålRef}
                                        type="button"
                                        onClick={leggTilSamarbeidsmål}
                                        aria-describedby={
                                            samarbeidsmålOverskriftId
                                        }
                                    >
                                        Legg til mål
                                    </Button>
                                </div>
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
                        disabled={modus === "opprett" && !harInnhold}
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

function OpprettetMålkort({
    mål,
    onRediger,
}: {
    mål: Sykefraværsmål;
    onRediger: () => void;
}) {
    return (
        <Box
            background="default"
            borderColor="neutral-subtle"
            borderWidth="1"
            borderRadius="12"
            padding="space-16"
        >
            <VStack gap="space-12">
                <HStack justify="space-between" align="start" gap="space-8">
                    <SykefraværsmåltypeOverskrift type={mål.type} level="4" />
                    <Button
                        type="button"
                        variant="tertiary"
                        size="xsmall"
                        icon={<PencilIcon aria-hidden />}
                        onClick={onRediger}
                    >
                        Rediger
                    </Button>
                </HStack>
                <Målverdier mål={mål} />
            </VStack>
        </Box>
    );
}

function RedigerbartMålkort({
    utkast,
    alleUtkast,
    idPrefiks,
    feil,
    oppdater,
    onSlett,
}: {
    utkast: Sykefraværsmålutkast;
    alleUtkast: Sykefraværsmålutkast[];
    idPrefiks: string;
    feil: Valideringsfeil;
    oppdater: (endring: Partial<Sykefraværsmålutkast>) => void;
    onSlett: () => void;
}) {
    const overskriftId = `${idPrefiks}-overskrift`;
    return (
        <Box
            as="section"
            aria-labelledby={overskriftId}
            background="default"
            borderColor="neutral-subtle"
            borderWidth="1"
            borderRadius="12"
            padding="space-16"
        >
            <VStack gap="space-12">
                <Heading level="4" size="xsmall" id={overskriftId}>
                    {navnPå(utkast)}
                </Heading>
                <SykefraværsmålFelter
                    utkast={utkast}
                    oppdater={oppdater}
                    feil={feil}
                    idPrefiks={idPrefiks}
                    opptatte={opptatteTyper(alleUtkast, utkast.id)}
                    kompakt
                />
                <HStack gap="space-8" wrap>
                    <Button
                        type="button"
                        variant="secondary"
                        data-color="danger"
                        size="small"
                        icon={<TrashIcon aria-hidden />}
                        onClick={onSlett}
                    >
                        Slett sykefraværsmål
                    </Button>
                </HStack>
            </VStack>
        </Box>
    );
}
