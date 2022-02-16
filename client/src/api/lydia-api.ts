import {defaultFetcher} from './nettverkskall'
import { Filterverdier, Sykefraværsstatistikk } from '../domenetyper'
import useSWR from "swr";

const basePath = "/api"
const sykefraværsstatistikkPath = `${basePath}/sykefraversstatistikk`
const filterverdierPath = `${sykefraværsstatistikkPath}/filterverdier`


const useSwrTemplate = <T>(path : string) => {
    const {data, error} = useSWR<T>(path, defaultFetcher)
    return {
        data, error, loading: !data && !error
    }
}

export const useFilterverdier = () => useSwrTemplate<Filterverdier>(filterverdierPath)
export const useSykefraværsstatistikk = () => useSwrTemplate<Sykefraværsstatistikk>(sykefraværsstatistikkPath)


