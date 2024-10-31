import { søkeverdierTilUrlSearchParams } from "./sok";
import { FiltervisningState } from "../../Pages/Prioritering/Filter/filtervisning-reducer";

export const basePath = "/api";
export const sykefraværsstatistikkPath = `${basePath}/sykefravarsstatistikk`;
export const sykefraværsstatistikkAntallTreffPath = `${sykefraværsstatistikkPath}/antallTreff`;
export const filterverdierPath = `${sykefraværsstatistikkPath}/filterverdier`;
export const virksomhetsPath = `${basePath}/virksomhet`;
export const innloggetAnsattPath = `/innloggetAnsatt`;
export const iaSakPath = `${basePath}/iasak/radgiver`;
export const mineSakerPath = `${basePath}/iasak/minesaker`;
export const iaSakTeamPath = `${basePath}/iasak/team`;
export const iaSakPostNyHendelsePath = `${iaSakPath}/hendelse`;
export const iaSakHistorikkPath = `${iaSakPath}/historikk`;
export const virksomhetAutocompletePath = `${virksomhetsPath}/finn`;
export const siste4kvartalerPath = "siste4kvartaler";
export const sistekvartalPath = "sistetilgjengeligekvartal";
export const næringPath = "naring";
export const bransjePath = "bransje";
export const publiseringsinfoPath = "publiseringsinfo";
export const leveransePath = `${iaSakPath}/leveranse`;
export const statusoversiktPath = `${basePath}/statusoversikt`;
export const historiskStatistikkPath = "historiskstatistikk";
export const salesforceUrlPath = `${virksomhetsPath}/salesforce`;
export const spørreundersøkelsePath = `${iaSakPath}/kartlegging`;
export const planPath = `${iaSakPath}/plan`;
export const getSykefraværsstatistikkUrl = (søkeverdier: FiltervisningState) =>
    `${sykefraværsstatistikkPath}?${søkeverdierTilUrlSearchParams(
        søkeverdier,
    ).toString()}`;
export const getStatusoversiktUrl = (søkeverdier: FiltervisningState) =>
    `${statusoversiktPath}?${søkeverdierTilUrlSearchParams(
        søkeverdier,
    ).toString()}`;
export const getSykefraværsstatistikkAntallTreffUrl = (
    søkeverdier: FiltervisningState,
) =>
    `${sykefraværsstatistikkAntallTreffPath}?${søkeverdierTilUrlSearchParams(
        søkeverdier,
    ).toString()}`;
