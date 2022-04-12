import {
    Filterverdier,
    filterverdierSchema, IASak, iaSakSchema,
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
import useSWR, {SWRConfiguration} from "swr";
import {ZodType} from "zod";

const basePath = "/api";
const sykefraværsstatistikkPath = `${basePath}/sykefraversstatistikk`;
const filterverdierPath = `${sykefraværsstatistikkPath}/filterverdier`;
const virksomhetsPath = `${basePath}/virksomhet`
const innloggetAnsattPath = `/innloggetAnsatt`;
const iasakPath = `${basePath}/iasak/radgiver`;

const defaultSwrConfiguration: SWRConfiguration = {
    revalidateOnFocus: false,
    revalidateOnReconnect: false
}

const defaultFetcher = (...args: [url: string, options?: RequestInit]) =>
    fetch(...args).then((res) => res.json());

const useSwrTemplate = <T>(path: string | null, schema: ZodType<T>, config: SWRConfiguration = defaultSwrConfiguration) => {
    const { data, error: fetchError } = useSWR<T>(path, defaultFetcher, {
        ...defaultSwrConfiguration,
        ...config
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
        error: undefined,
        loading: false,
    };
};

export const useFilterverdier = () =>
    useSwrTemplate<Filterverdier>(filterverdierPath, filterverdierSchema);

export const useSykefraværsstatistikk = ({søkeverdier = {}, initierSøk = true}: {
    søkeverdier?: Søkeverdier,
    initierSøk?: boolean
}) => {
    const sykefraværUrl = `${sykefraværsstatistikkPath}?${søkeverdierTilUrlSearchParams(søkeverdier).toString()}`;
    return useSwrTemplate<SykefraværsstatistikkVirksomhetRespons>(
        initierSøk ? sykefraværUrl : null,
        sykefraværListeResponsSchema
    );
};

export const useHentSykefraværsstatistikkForVirksomhet = (orgnummer?: string) => {
    return useSwrTemplate<SykefraversstatistikkVirksomhet[]>(
        orgnummer ? `${sykefraværsstatistikkPath}/${orgnummer}` : null,
        sykefraversstatistikkVirksomhetListeSchema
    );
}

export const useHentVirksomhetsinformasjon = (orgnummer?: string) => {
    return useSwrTemplate<Virksomhet>(
        orgnummer ? `${virksomhetsPath}/${orgnummer}` : null,
        virksomhetsSchema
    );
}

export const useHentBrukerinformasjon = () =>
    useSwrTemplate<NavAnsatt>(innloggetAnsattPath, navAnsattSchema);

export const useHentSakerForVirksomhet = (orgnummer?: string) => {
    const iasakUrl = `${iasakPath}/${orgnummer}`

    return useSwrTemplate<IASak[]>(iasakUrl, iaSakSchema.array())
}

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
    params.append("iaStatus", søkeverdier.iastatus ?? "")
    params.append("side", `${søkeverdier.side}`)
    return params;
};
