import { get, ApiResultat, ApiFeil } from './nettverkskall'
import { Filterverdier } from '../domenetyper'

const basePath = "/api"
const sykefraværsstatistikkPath = `${basePath}/sykefraversstatistikk`
const filterverdierPath = `${sykefraværsstatistikkPath}/filterverdier`

export const hentFilterverdier = () => get<Filterverdier>(filterverdierPath)