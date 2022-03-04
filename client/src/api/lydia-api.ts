import { defaultFetcher } from "./nettverkskall";
import {
    Filterverdier,
    filterverdierSchema,
    NavAnsatt,
    navAnsattSchema,
    SykefraversstatistikkVirksomhet,
    sykefraversstatistikkVirksomhetListeSchema,
    Søkeverdier,
} from "../domenetyper";
import useSWR from "swr";
import { ZodType } from "zod";

const basePath = "/api";
const sykefraværsstatistikkPath = `${basePath}/sykefraversstatistikk`;
const filterverdierPath = `${sykefraværsstatistikkPath}/filterverdier`;
const innloggetAnsattPath = `/innloggetAnsatt`;

const useSwrTemplate = <T>(path: string, schema: ZodType<T>) => {
    const { data, error: fetchError } = useSWR<T>(path, defaultFetcher);
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
        loading: !safeParseResultat.data && !fetchError,
    };
};

export const useFilterverdier = () =>
    useSwrTemplate<Filterverdier>(filterverdierPath, filterverdierSchema);

export const useSykefraværsstatistikk = (søkeverdier?: Søkeverdier) => {
    let sykefraværUrl = sykefraværsstatistikkPath;
    if (søkeverdier) {
        sykefraværUrl += `?${søkeverdierTilUrlSearchParams(
            søkeverdier
        ).toString()}`;
    }
    return useSwrTemplate<SykefraversstatistikkVirksomhet[]>(
        sykefraværUrl,
        sykefraversstatistikkVirksomhetListeSchema
    );
};

export const useHentBrukerinformasjon = () =>
    useSwrTemplate<NavAnsatt>(innloggetAnsattPath, navAnsattSchema);

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
        søkeverdier.næringsgrupper
            ?.map((næringsgruppe) => næringsgruppe.kode)
            .join(",") ?? ""
    );
    return params;
};
