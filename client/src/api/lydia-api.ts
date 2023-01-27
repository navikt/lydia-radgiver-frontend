import {
    Brukerinformasjon,
    brukerinfoSchema,
    Filterverdier,
    filterverdierSchema,
    GyldigNesteHendelse,
    IANySakshendelseDto,
    IASak,
    iaSakSchema,
    KvartalFraTil,
    kvartalFraTilSchema,
    Sakshistorikk,
    sakshistorikkSchema,
    virksomhetsoversiktListeResponsSchema,
    VirksomhetsoversiktListeRespons,
    ValgtÅrsakDto,
    VirkomshetsstatistikkSisteKvartal,
    Virksomhet,
    virksomhetsSchema,
    VirksomhetsstatistikkSiste4Kvartaler,
    virksomhetsstatistikkSiste4KvartalerSchema,
    virksomhetsstatistikkSisteKvartalSchema,
} from "../domenetyper";
import useSWR, { SWRConfiguration } from "swr";
import { z, ZodError, ZodType } from "zod";
import { useEffect, useState } from "react";
import { dispatchFeilmelding } from "../Pages/FeilmeldingBanner";
import { FiltervisningState } from "../Pages/Prioritering/Filter/filtervisning-reducer";

const basePath = "/api";
export const sykefraværsstatistikkPath = `${basePath}/sykefraversstatistikk`;
export const sykefraværsstatistikkAntallTreffPath = `${sykefraværsstatistikkPath}/antallTreff`;
export const filterverdierPath = `${sykefraværsstatistikkPath}/filterverdier`;
export const virksomhetsPath = `${basePath}/virksomhet`;
export const innloggetAnsattPath = `/innloggetAnsatt`;
export const iaSakPath = `${basePath}/iasak/radgiver`;
export const iaSakPostNyHendelsePath = `${iaSakPath}/hendelse`;
export const iaSakHistorikkPath = `${iaSakPath}/historikk`;
export const virksomhetAutocompletePath = `${virksomhetsPath}/finn`;
export const siste4kvartalerPath = "siste4kvartaler";
export const gjeldendePeriodePath = "gjeldendeperiodesiste4kvartaler"

const defaultSwrConfiguration: SWRConfiguration = {
    revalidateOnFocus: false,
    revalidateOnReconnect: false,
};

const defaultFetcher = (...args: [url: string, options?: RequestInit]) =>
    fetch(...args).then((res) => res.json());

const fetchNative =
    (method: "GET" | "POST" | "DELETE" | "PUT") =>
        <T>(url: string, schema: ZodType<T>, body?: unknown): Promise<T> =>
            fetch(url, {
                method,
                body: body ? JSON.stringify(body) : undefined,
                headers: {
                    "Content-Type": "application/json",
                },
            })
                .then((res) => (res.ok ? res : Promise.reject(res.text())))
                .then((res) => res.json())
                .catch((e: Promise<string | ZodError>) => {
                    e.then((reason) => {
                        if (reason instanceof ZodError) {
                            console.error(reason);
                            return;
                        }
                        dispatchFeilmelding({
                            feilmelding: reason,
                        });
                    });
                })
                .then((data) => {
                    const safeparsed = schema.safeParse(data);
                    return safeparsed.success
                        ? safeparsed.data
                        : Promise.reject(safeparsed.error);
                });

const post = <T>(url: string, schema: ZodType<T>, body?: unknown): Promise<T> =>
    fetchNative("POST")(url, schema, body);
const get = <T>(url: string, schema: ZodType<T>): Promise<T> =>
    fetchNative("GET")(url, schema);

const useSwrTemplate = <T>(
    path: string | (() => string | null) | null,
    schema: ZodType<T>,
    config: SWRConfiguration = defaultSwrConfiguration
) => {
    const {
        data,
        error: fetchError,
        mutate,
    } = useSWR<T>(path, defaultFetcher, {
        ...defaultSwrConfiguration,
        ...config,
    });
    if (!data && !fetchError) {
        return {
            data,
            mutate,
            error: undefined,
            loading: true,
        };
    }
    if (fetchError) {
        dispatchFeilmelding({ feilmelding: fetchError?.message });
        return {
            data,
            mutate,
            error: fetchError,
            loading: false,
        };
    }
    const safeParseResultat = schema.safeParse(data);
    if (!safeParseResultat.success) {
        console.error(
            "Feil i parsing av data fra server",
            safeParseResultat.error
        );
        return {
            data,
            mutate,
            error: safeParseResultat.error,
            loading: false,
        };
    }
    return {
        data: safeParseResultat.data,
        mutate,
        error: undefined,
        loading: false,
    };
};

const getSykefraværsstatistikkUrl = (søkeverdier: FiltervisningState) =>
    `${sykefraværsstatistikkPath}?${søkeverdierTilUrlSearchParams(
        søkeverdier
    ).toString()}`;

const getSykefraværsstatistikkAntallTreffUrl = (
    søkeverdier: FiltervisningState
) =>
    `${sykefraværsstatistikkAntallTreffPath}?${søkeverdierTilUrlSearchParams(
        søkeverdier
    ).toString()}`;

export const useFilterverdier = () =>
    useSwrTemplate<Filterverdier>(filterverdierPath, filterverdierSchema);

function hentAntallTreff(
    søkeverdier: FiltervisningState,
    initierSøk: boolean,
    setError: (value: ((prevState: string) => string) | string) => void
) {
    const [antallTreff, setAntallTreff] = useState<number>();
    const antallTreffUrl = getSykefraværsstatistikkAntallTreffUrl(søkeverdier);

    useEffect(() => {
        if (søkeverdier.side === 1 && initierSøk) {
            setAntallTreff(undefined);
            get(antallTreffUrl, z.number())
                .then((response) => {
                    setError("");
                    setAntallTreff(response);
                })
                .catch((e) => {
                    setError(e.message);
                });
        }
    }, [antallTreffUrl, initierSøk, søkeverdier.side]);
    return antallTreff;
}

export const useHentVirksomhetsoversiktListe = ({
    filterstate,
    initierSøk = true,
}: {
    filterstate: FiltervisningState;
    initierSøk?: boolean;
}) => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [virksomhetsoversiktListe, setVirksomhetsoversiktListe] =
        useState<VirksomhetsoversiktListeRespons>();

    const sykefraværUrl = getSykefraværsstatistikkUrl(filterstate); // Funfact: Endepunktet for virksomhetsoversikt heter "sykefravær"

    useEffect(() => {
        if (initierSøk) {
            setLoading(true);

            get(sykefraværUrl, virksomhetsoversiktListeResponsSchema)
                .then((response) => {
                    setError("");
                    setVirksomhetsoversiktListe(response);
                })
                .catch((e) => {
                    setError(e.message);
                })
                .finally(() => {
                    setLoading(false);
                });
        }
    }, [sykefraværUrl, initierSøk]);

    const antallTreff = hentAntallTreff(filterstate, initierSøk, setError);

    return { error, loading, data: virksomhetsoversiktListe, antallTreff };
};

export const useHentVirksomhetsstatistikkSiste4Kvartaler = (
    orgnummer?: string
) => {
    return useSwrTemplate<VirksomhetsstatistikkSiste4Kvartaler>(
        orgnummer ? `${sykefraværsstatistikkPath}/${orgnummer}/${siste4kvartalerPath}` : null,
        virksomhetsstatistikkSiste4KvartalerSchema,
        {
            revalidateOnFocus: true,
        }
    );
};

export const useHentGjeldendePeriodeForVirksomhetSiste4Kvartal = () => {
    return useSwrTemplate<KvartalFraTil>(
        `${sykefraværsstatistikkPath}/${gjeldendePeriodePath}`,
        kvartalFraTilSchema,
        {
            revalidateOnFocus: true,
        }
    );
};

export const useHentSykefraværsstatistikkForVirksomhetSisteKvartal = (
    orgnummer?: string
) => {
    return useSwrTemplate<VirkomshetsstatistikkSisteKvartal>(
        orgnummer ? `${sykefraværsstatistikkPath}/${orgnummer}/sistetilgjengeligekvartal` : null,
        virksomhetsstatistikkSisteKvartalSchema,
        {
            revalidateOnFocus: true,
        }
    );
};

export const useHentVirksomhetsinformasjon = (orgnummer?: string) => {
    return useSwrTemplate<Virksomhet>(
        orgnummer ? `${virksomhetsPath}/${orgnummer}` : null,
        virksomhetsSchema,
        {
            revalidateOnFocus: true,
        }
    );
};

export const useHentBrukerinformasjon = () =>
    useSwrTemplate<Brukerinformasjon>(innloggetAnsattPath, brukerinfoSchema);

export const useHentSakerForVirksomhet = (orgnummer?: string) => {
    const iasakUrl = `${iaSakPath}/${orgnummer}`;
    return useSwrTemplate<IASak[]>(iasakUrl, iaSakSchema.array(), {
        revalidateOnFocus: true,
    });
};

export const useHentSamarbeidshistorikk = (orgnummer?: string) => {
    return useSwrTemplate<Sakshistorikk[]>(
        () => (orgnummer ? `${iaSakHistorikkPath}/${orgnummer}` : null),
        sakshistorikkSchema.array(),
        {
            revalidateOnFocus: true,
        }
    );
};

export const opprettSak = (orgnummer: string): Promise<IASak> =>
    post(`${iaSakPath}/${orgnummer}`, iaSakSchema);

export const nyHendelsePåSak = (
    sak: IASak,
    hendelse: GyldigNesteHendelse,
    valgtÅrsak: ValgtÅrsakDto | null = null
): Promise<IASak> => {
    const nyHendelseDto: IANySakshendelseDto = {
        orgnummer: sak.orgnr,
        saksnummer: sak.saksnummer,
        hendelsesType: hendelse.saksHendelsestype,
        endretAvHendelseId: sak.endretAvHendelseId,
        ...(valgtÅrsak && { payload: JSON.stringify(valgtÅrsak) }),
    };
    return post(iaSakPostNyHendelsePath, iaSakSchema, nyHendelseDto);
};

const appendIfPresent = <T>(
    key: string,
    value: T | undefined,
    mapper: (value: T) => string,
    params: URLSearchParams
) => {
    if (!value) return;
    const valueToAdd = mapper(value);
    if (valueToAdd.length === 0) return;
    return params.append(key, valueToAdd);
};

export const søkeverdierTilUrlSearchParams = ({
    kommuner,
    valgtFylke: fylkeMedKommune,
    næringsgrupper,
    sykefraværsprosent,
    antallArbeidsforhold,
    sorteringsretning,
    sorteringsnokkel,
    iaStatus,
    side,
    bransjeprogram,
    eiere,
    sektor,
}: FiltervisningState) => {
    const params = new URLSearchParams();
    appendIfPresent(
        "kommuner",
        kommuner,
        (k) => k.map(({ nummer }) => nummer).join(","),
        params
    );
    appendIfPresent(
        "fylker",
        fylkeMedKommune,
        ({ fylke: { nummer } }) => nummer,
        params
    );
    appendIfPresent(
        "neringsgrupper",
        næringsgrupper,
        (grupper) => grupper.map(({ kode }) => kode).join(","),
        params
    );
    appendIfPresent(
        "sykefraversprosentFra",
        sykefraværsprosent,
        ({ fra }) => isNaN(fra) ? "" : fra.toFixed(2),
        params
    );
    appendIfPresent(
        "sykefraversprosentTil",
        sykefraværsprosent,
        ({ til }) => isNaN(til) ? "" : til.toFixed(2),
        params
    );
    appendIfPresent(
        "ansatteFra",
        antallArbeidsforhold,
        ({ fra }) => (!Number.isNaN(fra) ? "" + fra : ""),
        params
    );
    appendIfPresent(
        "ansatteTil",
        antallArbeidsforhold,
        ({ til }) => (!Number.isNaN(til) ? "" + til : ""),
        params
    );

    appendIfPresent(
        "bransjeprogram",
        bransjeprogram,
        (bp) => bp.join(","),
        params
    );
    appendIfPresent(
        "eiere",
        eiere,
        (e) => e.map(({ navIdent }) => navIdent).join(","),
        params
    );
    appendIfPresent("iaStatus", iaStatus, (status) => status, params);
    appendIfPresent("sektor", sektor, (sektor) => sektor, params);
    appendIfPresent(
        "sorteringsnokkel",
        sorteringsnokkel,
        (nøkkel) => nøkkel,
        params
    );
    appendIfPresent(
        "sorteringsretning",
        sorteringsretning,
        (retning) => retning,
        params
    );
    appendIfPresent("side", side, (side) => "" + side, params);
    return params;
};
