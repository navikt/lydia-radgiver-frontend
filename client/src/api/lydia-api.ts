import { defaultFetcher } from "./nettverkskall";
import { Filterverdier, SykefraversstatistikkVirksomhet } from "../domenetyper";
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
    const sykefraværurl = new URL(sykefraværsstatistikkPath);
    if (søkeverdier) {
        Object.entries(søkeverdier).forEach(([key, value]) => {
            sykefraværurl.searchParams.append(key, value);
        });
    }
    const path = sykefraværurl.toString();
    return useSwrTemplate<SykefraversstatistikkVirksomhet[]>(path);
};

interface Søkeverdier {
    kommuner?: string;
    fylker?: string;
}
