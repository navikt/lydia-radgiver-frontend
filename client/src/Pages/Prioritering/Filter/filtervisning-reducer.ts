import { useCallback, useEffect, useReducer } from "react";
import { useSearchParams } from "react-router-dom";
import { SortState } from "@navikt/ds-react";
import { Range } from "./SykefraværsprosentVelger";
import { Eier, IAProsessStatusType, Periode, } from "../../../domenetyper/domenetyper";
import { søkeverdierTilUrlSearchParams } from "../../../api/lydia-api";
import { Fylke, FylkeMedKommuner, Kommune } from "../../../domenetyper/fylkeOgKommune";
import { Næringsgruppe } from "../../../domenetyper/virksomhet";
import { Filterverdier, Sorteringsverdi, ValgtSnittFilter } from "../../../domenetyper/filterverdier";

const næringsgruppeKoderTilNæringsgrupper = (næringsgruppeKoder: string[], næringsgrupper: Næringsgruppe[]) =>
    næringsgrupper.filter(({ kode }) => næringsgruppeKoder.includes(kode));

const finnBransjeprogram = (næringsgrupper: string[]) =>
    næringsgrupper.filter((gruppe) => isNaN(+gruppe));


const finnFylker = (filterverdier: Filterverdier, fylkesnummer: string[]): Fylke[] => 
    filterverdier.fylker
        .filter(({ fylke }) => fylkesnummer.includes(fylke.nummer))
        .map(({ fylke }) => fylke) ?? [];

const parametere = [
    "kommuner",
    "fylker",
    "naringsgrupper",
    "sykefravarsprosentFra",
    "sykefravarsprosentTil",
    "snittfilter",
    "ansatteFra",
    "ansatteTil",
    "sorteringsnokkel",
    "sorteringsretning",
    "iaStatus",
    "sektor",
    "side",
    "bransjeprogram",
    "eiere",
    "datoFra",
    "datoTil"
] as const;

type Søkeparametere = Partial<Record<typeof parametere[number], string>>;

function hentKommunerFraParametere(kommuner: string, filterverdier: Filterverdier): Kommune[] {
    const kommuneliste = kommuner.split(",").filter((v) => v.trim().length);
    return filterverdier.fylker
        .map((fylke) => fylke.kommuner)
        .flatMap((k) => k)
        .filter((kommune) => kommuneliste.includes(kommune.nummer));
}

const søkeparametereTilFilterstate = (parametere: Søkeparametere, filterverdier: Filterverdier): FiltervisningState => {
    return {
        kommuner: hentKommunerFraParametere(
            parametere?.kommuner ?? "",
            filterverdier
        ),
        valgteFylker: finnFylker(filterverdier, parametere.fylker?.split(",") ?? []),

        antallArbeidsforhold: {
            fra: Number(
                parametere.ansatteFra ?? initialFiltervisningState.antallArbeidsforhold.fra
            ),
            til: Number(
                parametere.ansatteTil ?? initialFiltervisningState.antallArbeidsforhold.til
            ),
        },
        sykefraværsprosent: {
            fra: Number(
                parametere.sykefravarsprosentFra ?? initialFiltervisningState.sykefraværsprosent.fra
            ),
            til: Number(
                parametere.sykefravarsprosentTil ?? initialFiltervisningState.sykefraværsprosent.til
            ),
        },
        valgtSnittfilter: parametere.snittfilter as ValgtSnittFilter,
        eiere: filterverdier.filtrerbareEiere.filter((eier) =>
            parametere.eiere?.includes(eier.navIdent)
        ),

        sektor: parametere.sektor,

        iaStatus: filterverdier.statuser.find(
            (status) => status === parametere.iaStatus
        ),
        bransjeprogram: finnBransjeprogram(
            parametere.bransjeprogram?.split(",") ?? []
        ),

        næringsgrupper: næringsgruppeKoderTilNæringsgrupper(
            parametere?.naringsgrupper?.split(",") ?? [],
            filterverdier.naringsgrupper
        ),
        side: initialFiltervisningState.side,
    };
};

const erUtryggFraLocalStorage = (localState: FiltervisningState, filterverdier: Filterverdier) => {
    if (localState === undefined) {
        return true;
    }
    const tilgjengeligeKommuner = filterverdier.fylker.flatMap((fylke) => fylke.kommuner);
    const lovligeKommunerFraLocalStorage = localState.kommuner.filter((kommune) => tilgjengeligeKommuner.find((k) => k.nummer === kommune.nummer && k.navn === kommune.navn && k.navnNorsk === kommune.navnNorsk) !== undefined);
    if (lovligeKommunerFraLocalStorage.length !== localState.kommuner.length) {
        return true;
    }

    const lovligFylkeFraLocalstorage = filterverdier.fylker.find((fylke) => fylke.fylke.nummer === localState.valgtFylke?.fylke.nummer && fylke.fylke.navn === localState.valgtFylke?.fylke.navn);
    if (lovligFylkeFraLocalstorage === undefined && localState.valgtFylke !== undefined) {
        return true;
    }

    const lovligBransjeprogram = localState.bransjeprogram.filter((bransjeprogram) => filterverdier.bransjeprogram.includes(bransjeprogram));
    if (lovligBransjeprogram.length !== localState.bransjeprogram.length) {
        return true;
    }

    const lovligNæringsgrupper = localState.næringsgrupper.filter((næringsgruppe) => filterverdier.naringsgrupper.find((n) => n.kode === næringsgruppe.kode && n.navn === næringsgruppe.navn) !== undefined);
    if (lovligNæringsgrupper.length !== localState.næringsgrupper.length) {
        return true;
    }

    const lovligEier = localState.eiere.filter((eier) => filterverdier.filtrerbareEiere.find((e) => e.navIdent === eier.navIdent && e.navn === eier.navn) !== undefined);
    if (lovligEier.length !== localState.eiere.length) {
        return true;
    }

    return false;
}

export const filterstateFraLokalstorage = (filterverdier: Filterverdier): FiltervisningState => {
    const localstorageFilter = window.localStorage.getItem("lokalFiltervisningState");
    const parsedLocalstorageFilter = localstorageFilter ? JSON.parse(localstorageFilter) : undefined;

    if (erUtryggFraLocalStorage(parsedLocalstorageFilter, filterverdier)) {
        window.localStorage.removeItem("lokalFiltervisningState");

        return initialFiltervisningState;
    }

    return {
        ...initialFiltervisningState,
        ...parsedLocalstorageFilter,
    };
};
type EndreFylkerAction = {
    type: "ENDRE_FYLKER";
    payload: {
        fylker: Fylke[];
    };
};
type EndreKommuneAction = {
    type: "ENDRE_KOMMUNE";
    payload: {
        kommuner: Kommune[];
    };
};
type EndreNæringsgruppeAction = {
    type: "ENDRE_NÆRINGSGRUPPE";
    payload: {
        næringsgrupper: string[];
    };
};
type EndreSykefraværsprosentAction = {
    type: "ENDRE_SYKEFRAVÆRSPROSENT";
    payload: {
        sykefraværsprosent: Range;
    };
};
type EndreSnittfilterAction = {
    type: "ENDRE_SNITTFILTER";
    payload: {
        snittfilter: string;
    };
};
type EndreAntallArbeidsforholdAction = {
    type: "ENDRE_ARBEIDSFORHOLD";
    payload: {
        arbeidsforhold: Range;
    };
};
type SettInnFilterverdierAction = {
    type: "SETT_INN_FILTERVERDIER";
    payload: {
        filterverdier: Filterverdier;
        filterstate: FiltervisningState;
    };
};
type EndreIAStatusAction = {
    type: "ENDRE_IASTATUS";
    payload: {
        iastatus?: IAProsessStatusType;
    };
};
type EndreSektorAction = {
    type: "ENDRE_SEKTOR";
    payload: {
        sektor: string;
    };
};
type EndrePeriodeAction = {
    type: "ENDRE_PERIODE";
    payload: {
        periode?: { fraDato: Date, tilDato: Date };
    };
};
type TilbakestillAction = {
    type: "TILBAKESTILL";
};
type OppdaterSideAction = {
    type: "OPPDATER_SIDE";
    payload: {
        side: number;
        sortering?: SortState;
    };
};
type OppdaterEiereAction = {
    type: "OPPDATER_EIERE";
    payload: {
        eiere: Eier[];
    };
};
type OppdaterAutosøkAction = {
    type: "OPPDATER_AUTOSØK";
    payload: {
        autosøk: boolean;
    };
};
type Action =
    | EndreFylkerAction
    | EndreKommuneAction
    | EndreNæringsgruppeAction
    | EndreSykefraværsprosentAction
    | EndreSnittfilterAction
    | EndreAntallArbeidsforholdAction
    | EndreIAStatusAction
    | EndreSektorAction
    | TilbakestillAction
    | OppdaterSideAction
    | OppdaterEiereAction
    | EndrePeriodeAction
    | SettInnFilterverdierAction
    | OppdaterAutosøkAction;

export interface FiltervisningState {
    autosøk?: boolean,
    readonly filterverdier?: Filterverdier;
    valgtFylke?: FylkeMedKommuner;
    valgteFylker?: Fylke[];
    kommuner: Kommune[];
    næringsgrupper: Næringsgruppe[];
    sykefraværsprosent: Range;
    valgtSnittfilter?: ValgtSnittFilter;
    antallArbeidsforhold: Range;
    sektor?: string;
    iaStatus?: IAProsessStatusType;
    bransjeprogram: string[];
    eiere: Eier[];
    sorteringsnokkel?: Sorteringsverdi;
    sorteringsretning?: "asc" | "desc";
    periode?: Periode;
    side: number;
}

export const initialFiltervisningState: FiltervisningState = {
    autosøk: true,
    valgtFylke: undefined,
    kommuner: [],
    næringsgrupper: [],
    sykefraværsprosent: {
        fra: 0,
        til: 100,
    },
    valgtSnittfilter: ValgtSnittFilter.ALLE,
    antallArbeidsforhold: {
        fra: 5,
        til: NaN,
    },
    sektor: "",
    iaStatus: undefined,
    bransjeprogram: [],
    eiere: [],
    side: 1,
};

export const sammenliknFilterverdier = (filterstateA: FiltervisningState, filterstateB: FiltervisningState, ignorerSide: boolean = true) => {
    const sammenlignbarFilterstateA = {
        ...filterstateA,
        side: ignorerSide ? filterstateA.side : undefined
    };
    const sammenlignbarFilterstateB = {
        ...filterstateB,
        side: ignorerSide ? filterstateB.side : undefined
    };

    return JSON.stringify(sammenlignbarFilterstateA) === JSON.stringify(sammenlignbarFilterstateB);
}

const endreKommune = (state: FiltervisningState, action: EndreKommuneAction): FiltervisningState => ({
    ...state,
    kommuner: action.payload.kommuner,
});

export const erSammeFylker = (liste1: Fylke[], liste2: Fylke[]) => {
    return liste1.length === liste2.length &&
        liste1.reduce(
            (previousValue, fylke) => {
                return previousValue &&
                    (liste2.findIndex( (fylke2) => fylke2.nummer === fylke.nummer)
                        !== -1)
        }, true)
}

function endreFylker(state: FiltervisningState, action: EndreFylkerAction): FiltervisningState {
    if (state.valgteFylker && erSammeFylker(action.payload.fylker, state.valgteFylker))
        return state;

    return {
        ...state,
        valgteFylker: action.payload.fylker,
    };
}

const endreNæringsgruppe = (state: FiltervisningState, action: EndreNæringsgruppeAction): FiltervisningState => {
    const endretNæringsgrupper = næringsgruppeKoderTilNæringsgrupper(
        action.payload.næringsgrupper,
        state.filterverdier?.naringsgrupper ?? []
    );
    const bransjeprogram = finnBransjeprogram(action.payload.næringsgrupper);
    return {
        ...state,
        bransjeprogram,
        næringsgrupper: endretNæringsgrupper,
    };
};

const endreSykefraværsprosent = (
    state: FiltervisningState,
    action: EndreSykefraværsprosentAction
): FiltervisningState => ({
    ...state,
    sykefraværsprosent: action.payload.sykefraværsprosent,
});

const endreSnittfilter = (
    state: FiltervisningState,
    action: EndreSnittfilterAction
): FiltervisningState => ({
    ...state,
    valgtSnittfilter: action.payload.snittfilter as ValgtSnittFilter,
});

const endreAntallArbeidsforhold = (
    state: FiltervisningState,
    action: EndreAntallArbeidsforholdAction
): FiltervisningState => ({
    ...state,
    antallArbeidsforhold: action.payload.arbeidsforhold,
});

const endreIastatus = (state: FiltervisningState, action: EndreIAStatusAction): FiltervisningState => ({
    ...state,
    iaStatus: action.payload.iastatus,
});

const endreSektor = (state: FiltervisningState, action: EndreSektorAction): FiltervisningState => ({
    ...state,
    sektor: action.payload.sektor,
});

const endreSide = (state: FiltervisningState, action: OppdaterSideAction): FiltervisningState => {
    const tilSorteringsretning = (
        direction: SortState["direction"] = "descending"
    ) => {
        switch (direction) {
            case "ascending":
                return "asc";
            case "descending":
                return "desc";
        }
    };

    return {
        ...state,
        side: action.payload.side,
        ...(action.payload.sortering && {
            sorteringsnokkel: action.payload.sortering
                .orderBy as Sorteringsverdi,
            sorteringsretning: tilSorteringsretning(
                action.payload.sortering.direction
            ),
        }),
    };
};

const endreEiere = (state: FiltervisningState, action: OppdaterEiereAction): FiltervisningState => ({
    ...state,
    eiere: action.payload.eiere
});

const endrePeriode = (state: FiltervisningState, action: EndrePeriodeAction): FiltervisningState => ({
    ...state,
    periode: action.payload.periode
});

const oppdaterAutosøk = (state: FiltervisningState, action: OppdaterAutosøkAction): FiltervisningState => ({
    ...state,
    autosøk: action.payload.autosøk
});

const settInnFilterverdier = (state: FiltervisningState, action: SettInnFilterverdierAction): FiltervisningState => {
    return {
        ...state,
        ...action.payload.filterstate,
        filterverdier: action.payload.filterverdier,
    };
};

const reducer = (state: FiltervisningState, action: Action) => {
    switch (action.type) {
        case "SETT_INN_FILTERVERDIER":
            return settInnFilterverdier(state, action);
        case "OPPDATER_EIERE":
            return endreEiere(state, action);
        case "OPPDATER_SIDE":
            return endreSide(state, action);
        case "ENDRE_FYLKER":
            return endreFylker(state, action);
        case "ENDRE_KOMMUNE":
            return endreKommune(state, action);
        case "ENDRE_NÆRINGSGRUPPE":
            return endreNæringsgruppe(state, action);
        case "ENDRE_SYKEFRAVÆRSPROSENT":
            return endreSykefraværsprosent(state, action);
        case "ENDRE_SNITTFILTER":
            return endreSnittfilter(state, action);
        case "ENDRE_ARBEIDSFORHOLD":
            return endreAntallArbeidsforhold(state, action);
        case "ENDRE_IASTATUS":
            return endreIastatus(state, action);
        case "ENDRE_SEKTOR":
            return endreSektor(state, action);
        case "ENDRE_PERIODE":
            return endrePeriode(state, action);
        case "OPPDATER_AUTOSØK":
            return oppdaterAutosøk(state, action);
        case "TILBAKESTILL":
            return { ...state, ...initialFiltervisningState };
        default: {
            const _exaustiveCheck: never = action;
            return _exaustiveCheck;
        }
    }
};

const storedReducer = (state: FiltervisningState, action: Action) => {
    const newState = reducer(state, action);

    if (action.type === "TILBAKESTILL") {
        window.localStorage.removeItem("lokalFiltervisningState");

    } else if (action.type !== "SETT_INN_FILTERVERDIER") {
        oppdaterLagretSøk(newState);
    }
    return newState;
};

function oppdaterLagretSøk(state: FiltervisningState) {
    window.localStorage.setItem("lokalFiltervisningState", JSON.stringify({
        ...state,
        filterverdier: undefined,
        sorteringsnokkel: undefined,
        sorteringsretning: undefined,
        periode: undefined,
        side: initialFiltervisningState.side
    }));
}

export const useFiltervisningState = () => {
    const [state, dispatch] = useReducer(storedReducer, initialFiltervisningState);
    const [search, setSearch] = useSearchParams();

    useEffect(() => {
        const searchParams = søkeverdierTilUrlSearchParams(state, true);
        setSearch(searchParams, {
            replace: true,
        });
    }, [state]);

    const gyldigeSøkeparametereIUrlen: Søkeparametere = parametere.reduce(
        (obj, key) => {
            const verdi = search.get(key);
            return {
                ...obj,
                ...(verdi && {
                    [key]: verdi,
                }),
            };
        },
        {}
    );

    const oppdaterKommuner = useCallback(
        (payload: EndreKommuneAction["payload"]) => {
            dispatch({
                type: "ENDRE_KOMMUNE",
                payload,
            });
        },
        []
    );

    const oppdaterFylker = useCallback(
        (payload: EndreFylkerAction["payload"]) => {
            dispatch({
                type: "ENDRE_FYLKER",
                payload,
            });
        },
        []
    );

    const oppdaterNæringsgruppe = useCallback(
        (payload: EndreNæringsgruppeAction["payload"]) => {
            dispatch({
                type: "ENDRE_NÆRINGSGRUPPE",
                payload,
            });
        },
        []
    );

    const oppdaterSykefraværsprosent = useCallback(
        (payload: EndreSykefraværsprosentAction["payload"]) => {
            dispatch({
                type: "ENDRE_SYKEFRAVÆRSPROSENT",
                payload,
            });
        },
        []
    );

    const oppdaterSnittfilter = useCallback(
        (payload: EndreSnittfilterAction["payload"]) => {
            dispatch({
                type: "ENDRE_SNITTFILTER",
                payload,
            });
        },
        []
    );

    const oppdaterAntallArbeidsforhold = useCallback(
        (payload: EndreAntallArbeidsforholdAction["payload"]) => {
            dispatch({
                type: "ENDRE_ARBEIDSFORHOLD",
                payload,
            });
        },
        []
    );

    const oppdaterIastatus = useCallback(
        (payload: EndreIAStatusAction["payload"]) => {
            dispatch({
                type: "ENDRE_IASTATUS",
                payload,
            });
        },
        []
    );

    const oppdaterSektorer = useCallback(
        (payload: EndreSektorAction["payload"]) => {
            dispatch({
                type: "ENDRE_SEKTOR",
                payload
            })
        }, [])

    const tilbakestill = useCallback(() => {
        dispatch({
            type: "TILBAKESTILL",
        });
    }, []);

    const oppdaterSide = useCallback(
        (payload: OppdaterSideAction["payload"]) => {
            dispatch({
                type: "OPPDATER_SIDE",
                payload,
            });
        },
        []
    );

    const oppdaterEiere = useCallback(
        (payload: OppdaterEiereAction["payload"]) => {
            dispatch({
                type: "OPPDATER_EIERE",
                payload,
            });
        },
        []
    );

    const oppdaterAutosøk = useCallback(
        (payload: OppdaterAutosøkAction["payload"]) => {
            dispatch({
                type: "OPPDATER_AUTOSØK",
                payload,
            });
        },
        []
    );
    const lastData = useCallback(
        (payload: { filterverdier: Filterverdier }) => {
            if (Object.keys(gyldigeSøkeparametereIUrlen).length > 0) {
                const filterstate = søkeparametereTilFilterstate(
                    gyldigeSøkeparametereIUrlen,
                    payload.filterverdier
                    );

                dispatch({
                    type: "SETT_INN_FILTERVERDIER",
                    payload: {
                        filterverdier: payload.filterverdier,
                        filterstate,
                    },
                });
            } else {
                const localFilterState = filterstateFraLokalstorage(payload.filterverdier);

                dispatch({
                    type: "SETT_INN_FILTERVERDIER",
                    payload: {
                        filterverdier: payload.filterverdier,
                        filterstate: localFilterState,
                    },
                });
            }

        },
        []
    );

    return {
        state,
        oppdaterAntallArbeidsforhold,
        oppdaterFylker,
        oppdaterKommuner,
        oppdaterIastatus,
        oppdaterSektorer,
        oppdaterNæringsgruppe,
        oppdaterSykefraværsprosent,
        oppdaterSnittfilter,
        tilbakestill,
        oppdaterSide,
        oppdaterEiere,
        lastData,
        oppdaterAutosøk,
    };
};
