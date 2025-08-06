import {
    getStatusoversiktUrl,
    getSykefraværsstatistikkAntallTreffUrl,
} from "./paths";
import { getSykefraværsstatistikkUrl } from "./paths";
import {
    Filterverdier,
    filterverdierSchema,
} from "../../domenetyper/filterverdier";
import { statusoversiktListeResponsSchema } from "../../domenetyper/statusoversikt";
import { virksomhetsoversiktListeResponsSchema } from "../../domenetyper/virksomhetsoversikt";
import { FiltervisningState } from "../../Pages/Prioritering/Filter/filtervisning-reducer";
import { useSwrTemplate } from "./networkRequests";
import { filterverdierPath } from "./paths";
import { z } from "zod/v4";

export const useFilterverdier = () =>
    useSwrTemplate<Filterverdier>(filterverdierPath, filterverdierSchema);
export interface SøkeProps {
    filterstate: FiltervisningState;
    initierSøk?: boolean;
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

export function useHentAntallTreff({
    filterstate,
    initierSøk = true,
}: SøkeProps) {
    const antallTreffUrl = getSykefraværsstatistikkAntallTreffUrl(filterstate);
    return useSwrTemplate(initierSøk ? antallTreffUrl : null, z.number());
}

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
export const appendIfPresent = <T>(
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
