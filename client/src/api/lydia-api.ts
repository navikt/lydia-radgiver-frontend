import { defaultFetcher } from "./nettverkskall";
import { Filterverdier, SykefraversstatistikkVirksomhet, Søkeverdier } from "../domenetyper";
import useSWR from "swr";

const basePath = "/api";
const sykefraværsstatistikkPath = `${basePath}/sykefraversstatistikk`;
const filterverdierPath = `${sykefraværsstatistikkPath}/filterverdier`;

const useSwrTemplate = <T>(path: string) => {
    const { data, error } = useSWR<T>(path, defaultFetcher);
    return {
        data,
        error,
        loading: !data && !error,
    };
};

export const useFilterverdier = () => useSwrTemplate<Filterverdier>(filterverdierPath);
export const useSykefraværsstatistikk = (søkeverdier?: Søkeverdier) => {
    let sykefraværUrl = sykefraværsstatistikkPath
    if (søkeverdier) {
        sykefraværUrl += `?${søkeverdierTilUrlSearchParams(søkeverdier).toString()}`;
    }
    return useSwrTemplate<SykefraversstatistikkVirksomhet[]>(sykefraværUrl);
};

const søkeverdierTilUrlSearchParams = (søkeverdier: Søkeverdier) => {
    const params = new URLSearchParams();
    params.append("kommuner", søkeverdier.kommuner?.map(kommune => kommune.nummer).join(",") ?? "");
    params.append("fylker", søkeverdier.fylker?.map(fylke => fylke.nummer).join(",") ?? "");
    params.append("neringsgrupper", søkeverdier.næringsgrupper?.map(næringsgruppe => næringsgruppe.kode).join(",") ?? "");
    return params;
}
