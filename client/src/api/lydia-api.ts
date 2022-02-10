import {defaultFetcher} from './nettverkskall'
import { Filterverdier } from '../domenetyper'
import useSWR from "swr";

const basePath = "/api"
const sykefraværsstatistikkPath = `${basePath}/sykefraversstatistikk`
const filterverdierPath = `${sykefraværsstatistikkPath}/filterverdier`

export const useFilterverdier = () => {
    const {data: filterverdier, error} = useSWR<Filterverdier>(filterverdierPath, defaultFetcher)
    return {
        filterverdier, error, loading: !filterverdier && !error
    }
}