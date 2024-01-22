import useSWR, { SWRConfiguration } from "swr";
import { z, ZodError, ZodType } from "zod";
import { isoDato } from "../util/dato";
import { dispatchFeilmelding } from "../components/Banner/FeilmeldingBanner";
import { FiltervisningState } from "../Pages/Prioritering/Filter/filtervisning-reducer";
import {
    Brukerinformasjon,
    brukerinformasjonSchema,
} from "../domenetyper/brukerinformasjon";
import {
    GyldigNesteHendelse,
    IANySakshendelseDto,
    IASak,
    iaSakSchema,
    ValgtÅrsakDto,
} from "../domenetyper/domenetyper";
import {
    Filterverdier,
    filterverdierSchema,
} from "../domenetyper/filterverdier";
import {
    IATjeneste,
    iaTjenesteSchema,
    Leveranse,
    LeveranseOppdateringDTO,
    LeveranserPerIATjeneste,
    leveranserPerIATjenesteSchema,
    leveranseSchema,
    LeveranseStatusEnum,
    MineIATjenester,
    mineIATjenesterSchema,
    Modul,
    modulSchema,
    NyLeveranseDTO,
} from "../domenetyper/leveranse";
import { statusoversiktListeResponsSchema } from "../domenetyper/statusoversikt";
import {
    Sakshistorikk,
    sakshistorikkSchema,
} from "../domenetyper/sakshistorikk";
import {
    Næring,
    Virksomhet,
    virksomhetsSchema,
} from "../domenetyper/virksomhet";
import { virksomhetsoversiktListeResponsSchema } from "../domenetyper/virksomhetsoversikt";
import {
    VirkomshetsstatistikkSisteKvartal,
    virksomhetsstatistikkSisteKvartalSchema,
} from "../domenetyper/virksomhetsstatistikkSisteKvartal";
import {
    VirksomhetsstatistikkSiste4Kvartaler,
    virksomhetsstatistikkSiste4KvartalerSchema,
} from "../domenetyper/virksomhetsstatistikkSiste4Kvartaler";
import {
    Publiseringsinfo,
    publiseringsinfoSchema,
} from "../domenetyper/publiseringsinfo";
import {
    Bransjestatistikk,
    bransjestatistikkSchema,
    Næringsstatistikk,
    næringsstatistikkSchema,
} from "../domenetyper/bransjestatistikk";
import {
    HistoriskStatistikk,
    historiskStatistikkSchema,
} from "../domenetyper/historiskstatistikk";
import {
    SalesforceUrl,
    salesforceUrlSchema,
} from "../domenetyper/salesforceUrl";
import { IASakKartlegging } from "../Pages/Virksomhet/Kartlegging/IASakKartlegging";

const basePath = "/api";
export const sykefraværsstatistikkPath = `${basePath}/sykefravarsstatistikk`;
export const sykefraværsstatistikkAntallTreffPath = `${sykefraværsstatistikkPath}/antallTreff`;
export const filterverdierPath = `${sykefraværsstatistikkPath}/filterverdier`;
export const virksomhetsPath = `${basePath}/virksomhet`;
export const innloggetAnsattPath = `/innloggetAnsatt`;
export const iaSakPath = `${basePath}/iasak/radgiver`;
export const iaSakPostNyHendelsePath = `${iaSakPath}/hendelse`;
export const iaSakHistorikkPath = `${iaSakPath}/historikk`;
export const virksomhetAutocompletePath = `${virksomhetsPath}/finn`;
export const siste4kvartalerPath = "siste4kvartaler";
export const sistekvartalPath = "sistetilgjengeligekvartal";
export const næringPath = "naring";
export const bransjePath = "bransje";
export const publiseringsinfoPath = "publiseringsinfo";
export const leveransePath = `${iaSakPath}/leveranse`;
export const mineIATjenesterPath = `${basePath}/iatjenesteoversikt/mine-iatjenester`;
export const tjenesterPath = `${leveransePath}/tjenester`;
export const modulerPath = `${leveransePath}/moduler`;
export const statusoversiktPath = `${basePath}/statusoversikt`;
export const historiskStatistikkPath = "historiskstatistikk";
export const salesforceUrlPath = `${virksomhetsPath}/salesforce`;
export const kartleggingPath = `${iaSakPath}/kartlegging`;

const defaultSwrConfiguration: SWRConfiguration = {
    revalidateOnFocus: false,
    revalidateOnReconnect: false,
};

const csrfFetcher = async () =>
    fetch("/csrf-token", {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
        },
    })
        .then((res) => res.json())
        .then((csrfJson) => csrfJson.csrfToken);

const defaultFetcher = (...args: [url: string, options?: RequestInit]) =>
    fetch(...args).then(async (res) => {
        if (!res.ok) {
            throw await res
                .text()
                .then((innhold) => {
                    try {
                        return JSON.parse(innhold);
                    } catch (e) {
                        return {
                            message: innhold,
                        };
                    }
                })
                .catch(() => {
                    return {
                        message:
                            "Noe har gått galt. Prøv å laste inn siden på nytt.",
                    };
                });
        }
        return res.status == 204 ? undefined : res.json();
    });

const fetchNative =
    (method: "POST" | "DELETE" | "PUT") =>
    <T>(url: string, schema: ZodType<T>, body?: unknown): Promise<T> =>
        csrfFetcher()
            .then((csrfToken) =>
                fetch(url, {
                    method,
                    body: body ? JSON.stringify(body) : undefined,
                    headers: {
                        "Content-Type": "application/json",
                        "x-csrf-token": csrfToken,
                    },
                }),
            )
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
const put = <T>(url: string, schema: ZodType<T>, body?: unknown): Promise<T> =>
    fetchNative("PUT")(url, schema, body);
const httpDelete = <T>(url: string, schema: ZodType<T>): Promise<T> =>
    fetchNative("DELETE")(url, schema);

const useSwrTemplate = <T>(
    path: string | (() => string | null) | null,
    schema: ZodType<T>,
    config: SWRConfiguration = defaultSwrConfiguration,
    visFeilmelding: boolean = true,
) => {
    const {
        data,
        error: fetchError,
        mutate,
        isLoading,
        isValidating,
    } = useSWR<T>(path, defaultFetcher, {
        ...defaultSwrConfiguration,
        ...config,
        onErrorRetry: () => {
            /* Do nothing */
        },
    });

    if (!data && !fetchError) {
        return {
            data,
            mutate,
            error: undefined,
            loading: isLoading,
            validating: isValidating,
        };
    }
    if (fetchError) {
        visFeilmelding &&
            dispatchFeilmelding({ feilmelding: fetchError.message });
        return {
            data,
            mutate,
            error: fetchError,
            loading: isLoading,
            validating: isValidating,
        };
    }
    const safeParseResultat = schema.safeParse(data);

    if (!safeParseResultat.success) {
        console.error(
            "Feil i parsing av data fra server",
            safeParseResultat.error,
        );
        return {
            data,
            mutate,
            error: safeParseResultat.error,
            loading: isLoading,
            validating: isValidating,
        };
    }
    return {
        data: safeParseResultat.data,
        mutate,
        error: undefined,
        loading: isLoading,
        validating: isValidating,
    };
};

const getSykefraværsstatistikkUrl = (søkeverdier: FiltervisningState) =>
    `${sykefraværsstatistikkPath}?${søkeverdierTilUrlSearchParams(
        søkeverdier,
    ).toString()}`;

const getStatusoversiktUrl = (søkeverdier: FiltervisningState) =>
    `${statusoversiktPath}?${søkeverdierTilUrlSearchParams(
        søkeverdier,
    ).toString()}`;

const getSykefraværsstatistikkAntallTreffUrl = (
    søkeverdier: FiltervisningState,
) =>
    `${sykefraværsstatistikkAntallTreffPath}?${søkeverdierTilUrlSearchParams(
        søkeverdier,
    ).toString()}`;

export const useFilterverdier = () =>
    useSwrTemplate<Filterverdier>(filterverdierPath, filterverdierSchema);

export const useMineIATjenester = () =>
    useSwrTemplate<MineIATjenester[]>(
        mineIATjenesterPath,
        mineIATjenesterSchema.array(),
    );

interface SøkeProps {
    filterstate: FiltervisningState;
    initierSøk?: boolean;
}

export function useHentAntallTreff({
    filterstate,
    initierSøk = true,
}: SøkeProps) {
    const antallTreffUrl = getSykefraværsstatistikkAntallTreffUrl(filterstate);
    return useSwrTemplate(initierSøk ? antallTreffUrl : null, z.number());
}

export const useHentStatusoversikt = ({
    filterstate,
    initierSøk = true,
}: SøkeProps) => {
    const statusoversiktUrl = getStatusoversiktUrl(filterstate);
    return useSwrTemplate(
        initierSøk ? statusoversiktUrl : null,
        statusoversiktListeResponsSchema,
    );
};

export const useHentVirksomhetsoversiktListe = ({
    filterstate,
    initierSøk = true,
}: SøkeProps) => {
    const sykefraværUrl = getSykefraværsstatistikkUrl(filterstate); // Funfact: Endepunktet for virksomhetsoversikt heter "sykefravær"
    return useSwrTemplate(
        initierSøk ? sykefraværUrl : null,
        virksomhetsoversiktListeResponsSchema,
    );
};

export const useHentVirksomhetsstatistikkSiste4Kvartaler = (
    orgnummer?: string,
) => {
    return useSwrTemplate<VirksomhetsstatistikkSiste4Kvartaler>(
        orgnummer
            ? `${sykefraværsstatistikkPath}/${orgnummer}/${siste4kvartalerPath}`
            : null,
        virksomhetsstatistikkSiste4KvartalerSchema,
        {
            revalidateOnFocus: true,
        },
    );
};

export const useHentPubliseringsinfo = () => {
    return useSwrTemplate<Publiseringsinfo>(
        `${sykefraværsstatistikkPath}/${publiseringsinfoPath}`,
        publiseringsinfoSchema,
        {
            revalidateOnFocus: false,
        },
    );
};

export const useHentSykefraværsstatistikkForVirksomhetSisteKvartal = (
    orgnummer?: string,
) => {
    return useSwrTemplate<VirkomshetsstatistikkSisteKvartal>(
        orgnummer
            ? `${sykefraværsstatistikkPath}/${orgnummer}/${sistekvartalPath}`
            : null,
        virksomhetsstatistikkSisteKvartalSchema,
        {
            revalidateOnFocus: true,
        },
    );
};

export const useHentBransjestatistikk = (bransje: string | null) => {
    return useSwrTemplate<Bransjestatistikk>(
        bransje
            ? `${sykefraværsstatistikkPath}/${bransjePath}/${bransje}`
            : null,
        bransjestatistikkSchema,
        {
            revalidateOnFocus: false,
        },
    );
};

export const useHentNæringsstatistikk = (næring: Næring) => {
    return useSwrTemplate<Næringsstatistikk>(
        `${sykefraværsstatistikkPath}/${næringPath}/${næring.kode}`,
        næringsstatistikkSchema,
        {
            revalidateOnFocus: false,
        },
    );
};

export const useHentVirksomhetsinformasjon = (orgnummer?: string) => {
    return useSwrTemplate<Virksomhet>(
        orgnummer ? `${virksomhetsPath}/${orgnummer}` : null,
        virksomhetsSchema,
        {
            revalidateOnFocus: true,
        },
    );
};

export const useHentBrukerinformasjon = () =>
    useSwrTemplate<Brukerinformasjon>(
        innloggetAnsattPath,
        brukerinformasjonSchema,
    );

export const useHentAktivSakForVirksomhet = (orgnummer?: string) => {
    const iasakUrl = `${iaSakPath}/${orgnummer}/aktiv`;
    return useSwrTemplate<IASak | undefined>(iasakUrl, iaSakSchema.optional(), {
        revalidateOnFocus: true,
    });
};

export const useHentSamarbeidshistorikk = (orgnummer?: string) => {
    return useSwrTemplate<Sakshistorikk[]>(
        () => (orgnummer ? `${iaSakHistorikkPath}/${orgnummer}` : null),
        sakshistorikkSchema.array(),
        {
            revalidateOnFocus: true,
        },
    );
};

export const useHentHistoriskstatistikk = (orgnummer?: string) => {
    const historiskStatistikkUrl = `${sykefraværsstatistikkPath}/${orgnummer}/${historiskStatistikkPath}`;
    return useSwrTemplate<HistoriskStatistikk>(
        historiskStatistikkUrl,
        historiskStatistikkSchema,
        {
            revalidateOnFocus: false,
        },
    );
};

export const opprettSak = (orgnummer: string): Promise<IASak> =>
    post(`${iaSakPath}/${orgnummer}`, iaSakSchema);

export const nyHendelsePåSak = (
    sak: IASak,
    hendelse: GyldigNesteHendelse,
    valgtÅrsak: ValgtÅrsakDto | null = null,
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

export const appendIfNotDefaultValue = <T>(
    key: string,
    value: T | undefined,
    defaultValue: T,
    mapper: (value: T) => string,
    params: URLSearchParams,
    skjulDefaultParametreIUrl: boolean,
) => {
    const faktiskVerdi = value || value === 0 ? value : defaultValue;

    if (faktiskVerdi === defaultValue && skjulDefaultParametreIUrl) return;

    const valueToAdd = mapper(faktiskVerdi);
    if (valueToAdd.length === 0) return;

    params.append(key, valueToAdd);
    return;
};

const appendIfPresent = <T>(
    key: string,
    value: T | undefined,
    mapper: (value: T) => string,
    params: URLSearchParams,
) => {
    if (!value) return;
    const valueToAdd = mapper(value);
    if (valueToAdd.length === 0) return;
    return params.append(key, valueToAdd);
};

export const søkeverdierTilUrlSearchParams = (
    {
        kommuner,
        valgteFylker,
        næringsgrupper,
        sykefraværsprosent,
        valgtSnittfilter,
        antallArbeidsforhold,
        sorteringsretning,
        sorteringsnokkel,
        iaStatus,
        side,
        bransjeprogram,
        eiere,
        sektor,
    }: FiltervisningState,
    skjulDefaultParametreIUrl: boolean = false,
) => {
    const params = new URLSearchParams();
    appendIfPresent(
        "kommuner",
        kommuner,
        (k) => k.map(({ nummer }) => nummer).join(","),
        params,
    );
    appendIfPresent(
        "fylker",
        valgteFylker,
        (fylker) => fylker.map(({ fylke }) => fylke.nummer).join(","),
        params,
    );
    appendIfPresent(
        "naringsgrupper",
        næringsgrupper,
        (grupper) => grupper.map(({ kode }) => kode).join(","),
        params,
    );

    appendIfNotDefaultValue(
        "sykefravarsprosentFra",
        sykefraværsprosent.fra,
        0,
        (fra) => (isNaN(fra) ? "" : fra.toFixed(2)),
        params,
        skjulDefaultParametreIUrl,
    );
    appendIfNotDefaultValue(
        "sykefravarsprosentTil",
        sykefraværsprosent.til,
        100,
        (til) => (isNaN(til) ? "" : til.toFixed(2)),
        params,
        skjulDefaultParametreIUrl,
    );
    appendIfPresent("snittfilter", valgtSnittfilter, (verdi) => verdi, params);
    appendIfNotDefaultValue(
        "ansatteFra",
        antallArbeidsforhold.fra,
        5,
        (fra) => (Number.isNaN(fra) ? "" : `${fra}`),
        params,
        skjulDefaultParametreIUrl,
    );
    appendIfPresent(
        "ansatteTil",
        antallArbeidsforhold.til,
        (til) => (Number.isNaN(til) ? "" : `${til}`),
        params,
    );

    appendIfPresent(
        "bransjeprogram",
        bransjeprogram,
        (bp) => bp.join(","),
        params,
    );
    appendIfPresent(
        "eiere",
        eiere,
        (e) => e.map(({ navIdent }) => navIdent).join(","),
        params,
    );
    appendIfPresent("iaStatus", iaStatus, (status) => status, params);
    appendIfPresent("sektor", sektor, (sektor) => sektor, params);
    appendIfPresent(
        "sorteringsnokkel",
        sorteringsnokkel,
        (nøkkel) => nøkkel,
        params,
    );
    appendIfPresent(
        "sorteringsretning",
        sorteringsretning,
        (retning) => retning,
        params,
    );

    appendIfNotDefaultValue(
        "side",
        side,
        1,
        (side) => "" + side,
        params,
        skjulDefaultParametreIUrl,
    );
    return params;
};

export const nyLeveransePåSak = (
    orgnummer: string,
    saksnummer: string,
    modulId: number,
    frist: Date,
): Promise<Leveranse> => {
    const nyLeveranseDTO: NyLeveranseDTO = {
        saksnummer: saksnummer,
        modulId: modulId,
        frist: isoDato(frist),
    };
    return post(
        `${leveransePath}/${orgnummer}/${saksnummer}`,
        leveranseSchema,
        nyLeveranseDTO,
    );
};

export const merkLeveranseSomLevert = (
    orgnummer: string,
    saksnummer: string,
    leveranseId: number,
): Promise<Leveranse> => {
    const oppdaterLeveranseDTO: LeveranseOppdateringDTO = {
        status: LeveranseStatusEnum.enum.LEVERT,
    };
    return put(
        `${leveransePath}/${orgnummer}/${saksnummer}/${leveranseId}`,
        leveranseSchema,
        oppdaterLeveranseDTO,
    );
};

export const slettLeveranse = (
    orgnummer: string,
    saksnummer: string,
    leveranseId: number,
): Promise<number> => {
    return httpDelete(
        `${leveransePath}/${orgnummer}/${saksnummer}/${leveranseId}`,
        z.number(),
    );
};

export const useHentLeveranser = (orgnummer: string, saksnummer: string) => {
    return useSwrTemplate<LeveranserPerIATjeneste[]>(
        orgnummer ? `${leveransePath}/${orgnummer}/${saksnummer}` : null,
        leveranserPerIATjenesteSchema.array(),
        {
            revalidateOnFocus: true,
        },
    );
};

export const useHentIATjenester = () => {
    return useSwrTemplate<IATjeneste[]>(
        tjenesterPath,
        iaTjenesteSchema.array(),
    );
};
export const useHentModuler = () => {
    return useSwrTemplate<Modul[]>(modulerPath, modulSchema.array());
};

export const useHentSalesforceUrl = (orgnr: string) => {
    return useSwrTemplate<SalesforceUrl>(
        `${salesforceUrlPath}/${orgnr}`,
        salesforceUrlSchema,
        defaultSwrConfiguration,
        false,
    );
};

export const nyKartleggingPåSak = (
    orgnummer: string,
    saksnummer: string,
): Promise<IASakKartlegging> => {
    return post(
        `${kartleggingPath}/${orgnummer}/${saksnummer}/opprett`,
        leveranseSchema,
    );
};
