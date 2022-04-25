import {
    Filterverdier,
    filterverdierSchema,
    IASak,
    iaSakSchema,
    IASakshendelse,
    iaSakshendelseSchema,
    IASakshendelseType,
    NavAnsatt,
    navAnsattSchema,
    SykefraversstatistikkVirksomhet,
    sykefraversstatistikkVirksomhetListeSchema,
    sykefraværListeResponsSchema,
    SykefraværsstatistikkVirksomhetRespons,
    Søkeverdier,
    Virksomhet,
    virksomhetsSchema,
} from "../domenetyper";
import useSWR, { SWRConfiguration } from "swr";
import { ZodType } from "zod";

const basePath = "/api";
export const sykefraværsstatistikkPath = `${basePath}/sykefraversstatistikk`;
export const filterverdierPath = `${sykefraværsstatistikkPath}/filterverdier`;
const virksomhetsPath = `${basePath}/virksomhet`;
const innloggetAnsattPath = `/innloggetAnsatt`;
export const iaSakPath = `${basePath}/iasak/radgiver`;
export const iaSakHentHendelserPath = `${iaSakPath}/hendelser`;
export const iaSakPostNyHendelsePath = `${iaSakPath}/hendelse`;

const defaultSwrConfiguration: SWRConfiguration = {
    revalidateOnFocus: false,
    revalidateOnReconnect: false,
};

const defaultFetcher = (...args: [url: string, options?: RequestInit]) =>
    fetch(...args).then((res) => res.json());

const post = <T>(url: string, schema: ZodType<T>, body?: any): Promise<T> =>
    fetch(url, {
        method: "POST",
        body: JSON.stringify(body),
        headers: {
            "Content-Type": "application/json",
        },
    })
        .then((res) => (res.ok ? res : Promise.reject(res.statusText)))
        .then((res) => res.json())
        .then((data) => {
            const safeparsed = schema.safeParse(data);
            return safeparsed.success
                ? safeparsed.data
                : Promise.reject(safeparsed.error);
        });

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
            data: undefined,
            error: undefined,
            loading: true,
        };
    }
    if (fetchError) {
        return {
            data: undefined,
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
            data: undefined,
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

const getSykefraværsstatistikkUrl = (søkeverdier: Søkeverdier) =>
    `${sykefraværsstatistikkPath}?${søkeverdierTilUrlSearchParams(
        søkeverdier
    ).toString()}`;

export const useFilterverdier = () =>
    useSwrTemplate<Filterverdier>(filterverdierPath, filterverdierSchema);

export const useSykefraværsstatistikk = ({
    søkeverdier = {},
    initierSøk = true,
}: {
    søkeverdier?: Søkeverdier;
    initierSøk?: boolean;
}) => {
    const sykefraværUrl = getSykefraværsstatistikkUrl(søkeverdier);
    return useSwrTemplate<SykefraværsstatistikkVirksomhetRespons>(
        initierSøk ? sykefraværUrl : null,
        sykefraværListeResponsSchema
    );
};

export const useHentSykefraværsstatistikkForVirksomhet = (
    orgnummer?: string
) => {
    return useSwrTemplate<SykefraversstatistikkVirksomhet[]>(
        orgnummer ? `${sykefraværsstatistikkPath}/${orgnummer}` : null,
        sykefraversstatistikkVirksomhetListeSchema
    );
};

export const useHentVirksomhetsinformasjon = (orgnummer?: string) => {
    return useSwrTemplate<Virksomhet>(
        orgnummer ? `${virksomhetsPath}/${orgnummer}` : null,
        virksomhetsSchema
    );
};

export const useHentBrukerinformasjon = () =>
    useSwrTemplate<NavAnsatt>(innloggetAnsattPath, navAnsattSchema);

export const useHentSakerForVirksomhet = (orgnummer?: string) => {
    const iasakUrl = `${iaSakPath}/${orgnummer}`;
    return useSwrTemplate<IASak[]>(iasakUrl, iaSakSchema.array());
};

export const useHentSakshendelserPåSak = (sak?: IASak) => {
    return useSwrTemplate<IASakshendelse[]>(
        () => (sak ? `${iaSakHentHendelserPath}/${sak.saksnummer}` : null),
        iaSakshendelseSchema.array()
    );
};

export const opprettSak = (orgnummer: string): Promise<IASak> =>
    post(`${iaSakPath}/${orgnummer}`, iaSakSchema);

interface IANySakshendelse {
    orgnummer: string;
    saksnummer: string;
    hendelsesType: string;
    endretAvHendelseId: string;
}

export const nyHendelsePåSak = (
    sak: IASak,
    hendelsesType: IASakshendelseType
): Promise<IASak> => {
    const nyHendelseDto: IANySakshendelse = {
        orgnummer: sak.orgnr,
        saksnummer: sak.saksnummer,
        hendelsesType: hendelsesType,
        endretAvHendelseId: sak.endretAvHendelseId,
    };
    return post(iaSakPostNyHendelsePath, iaSakSchema, nyHendelseDto);
};

const søkeverdierTilUrlSearchParams = (søkeverdier: Søkeverdier) => {
    const params = new URLSearchParams();
    params.append(
        "kommuner",
        søkeverdier.kommuner?.map((kommune) => kommune.nummer).join(",") ?? ""
    );
    params.append(
        "fylker",
        søkeverdier.fylker?.map((fylke) => fylke.nummer).join(",") ?? ""
    );
    params.append(
        "neringsgrupper",
        søkeverdier.neringsgrupper
            ?.map((næringsgruppe) => næringsgruppe.kode)
            .join(",") ?? ""
    );
    params.append(
        "sykefraversprosentFra",
        søkeverdier.sykefraversprosentRange?.fra.toFixed(2) ?? ""
    );
    params.append(
        "sykefraversprosentTil",
        søkeverdier.sykefraversprosentRange?.til.toFixed(2) ?? ""
    );
    params.append("ansatteFra", `${søkeverdier.antallAnsatteRange?.fra || ""}`);
    params.append("ansatteTil", `${søkeverdier.antallAnsatteRange?.til || ""}`);
    params.append("sorteringsnokkel", søkeverdier.sorteringsnokkel ?? "");
    params.append("iaStatus", søkeverdier.iastatus ?? "");
    params.append("side", `${søkeverdier.side}`);
    return params;
};
