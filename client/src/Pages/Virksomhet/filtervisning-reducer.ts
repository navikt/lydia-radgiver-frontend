import {
    Eier,
    Filterverdier,
    FylkeMedKommuner,
    IAProsessStatusType,
    Kommune,
    Næringsgruppe,
    Sorteringsverdi,
} from "../../domenetyper";
import { Range } from "../Prioritering/SykefraværsprosentVelger";
import { useCallback, useReducer } from "react";
import { SortState } from "@navikt/ds-react";

const næringsgruppeKoderTilNæringsgrupper = (
    næringsgruppeKoder: string[],
    næringsgrupper: Næringsgruppe[]
) => næringsgrupper.filter(({ kode }) => næringsgruppeKoder.includes(kode));

type EndreFylkeAction = {
    type: "ENDRE_FYLKE";
    payload: {
        fylkesnummer: string;
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
    };
};
type EndreIAStatusAction = {
    type: "ENDRE_IASTATUS";
    payload: {
        iastatus?: IAProsessStatusType;
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
        eiere?: Eier[];
    };
};
type Action =
    | EndreFylkeAction
    | EndreKommuneAction
    | EndreNæringsgruppeAction
    | EndreSykefraværsprosentAction
    | EndreAntallArbeidsforholdAction
    | EndreIAStatusAction
    | TilbakestillAction
    | OppdaterSideAction
    | OppdaterEiereAction
    | SettInnFilterverdierAction;

export interface FiltervisningState {
    readonly filterverdier?: Filterverdier;
    valgtFylke?: FylkeMedKommuner;
    kommuner: Kommune[];
    næringsgrupper: Næringsgruppe[];
    sykefraværsprosent: Range;
    antallArbeidsforhold: Range;
    iaStatus?: IAProsessStatusType;
    bransjeprogram: string[];
    sorteringsnokkel?: Sorteringsverdi;
    sorteringsretning?: "asc" | "desc";
    eiere?: Eier[];
    side: number;
}

const endreKommune = (
    state: FiltervisningState,
    action: EndreKommuneAction
): FiltervisningState => ({
    ...state,
    kommuner: action.payload.kommuner,
});

function endreFylke(
    state: FiltervisningState,
    action: EndreFylkeAction
): FiltervisningState {
    if (action.payload.fylkesnummer === state.valgtFylke?.fylke.nummer)
        return state;
    const endretFylkeMedKommuner = state.filterverdier?.fylker.find(
        ({ fylke }) => fylke.nummer === action.payload.fylkesnummer
    );
    if (!endretFylkeMedKommuner) {
        return {
            ...state,
            valgtFylke: undefined,
        };
    }
    const kommuner = state.kommuner.filter((kommune) =>
        endretFylkeMedKommuner.kommuner.includes(kommune)
    );
    return {
        ...endreKommune(state, {
            type: "ENDRE_KOMMUNE",
            payload: {
                kommuner,
            },
        }),
        valgtFylke: endretFylkeMedKommuner,
    };
}

const endreNæringsgruppe = (
    state: FiltervisningState,
    action: EndreNæringsgruppeAction
): FiltervisningState => {
    const endretNæringsgrupper = næringsgruppeKoderTilNæringsgrupper(
        action.payload.næringsgrupper,
        state.filterverdier?.neringsgrupper ?? []
    );
    const bransjeprogram = action.payload.næringsgrupper.filter((v) =>
        isNaN(+v)
    );
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

const endreAntallArbeidsforhold = (
    state: FiltervisningState,
    action: EndreAntallArbeidsforholdAction
): FiltervisningState => ({
    ...state,
    antallArbeidsforhold: action.payload.arbeidsforhold,
});

const endreIastatus = (
    state: FiltervisningState,
    action: EndreIAStatusAction
): FiltervisningState => ({
    ...state,
    iaStatus: action.payload.iastatus,
});

const initialState: FiltervisningState = {
    kommuner: [],
    næringsgrupper: [],
    antallArbeidsforhold: {
        fra: 5,
        til: NaN,
    },
    sykefraværsprosent: {
        fra: 0,
        til: 100,
    },
    bransjeprogram: [],
    side: 1,
};

const oppdaterSide = (
    state: FiltervisningState,
    action: OppdaterSideAction
): FiltervisningState => {
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

const oppdaterEiere = (
    state: FiltervisningState,
    action: OppdaterEiereAction
): FiltervisningState => ({ ...state, eiere: action.payload.eiere });

const settInnFilterverdier = (
    state: FiltervisningState,
    action: SettInnFilterverdierAction
): FiltervisningState => ({
    ...state,
    filterverdier: action.payload.filterverdier,
});

const reducer = (state: FiltervisningState, action: Action) => {
    switch (action.type) {
        case "SETT_INN_FILTERVERDIER":
            return settInnFilterverdier(state, action);
        case "OPPDATER_EIERE":
            return oppdaterEiere(state, action);
        case "OPPDATER_SIDE":
            return oppdaterSide(state, action);
        case "ENDRE_FYLKE":
            return endreFylke(state, action);
        case "ENDRE_KOMMUNE":
            return endreKommune(state, action);
        case "ENDRE_NÆRINGSGRUPPE":
            return endreNæringsgruppe(state, action);
        case "ENDRE_SYKEFRAVÆRSPROSENT":
            return endreSykefraværsprosent(state, action);
        case "ENDRE_ARBEIDSFORHOLD":
            return endreAntallArbeidsforhold(state, action);
        case "ENDRE_IASTATUS":
            return endreIastatus(state, action);
        case "TILBAKESTILL":
            return { ...state, ...initialState };
    }
};

export const useFiltervisningState = () => {
    const [state, dispatch] = useReducer(reducer, initialState);

    const kommuner = useCallback((payload: EndreKommuneAction["payload"]) => {
        dispatch({
            type: "ENDRE_KOMMUNE",
            payload,
        });
    }, []);

    const fylke = useCallback((payload: EndreFylkeAction["payload"]) => {
        dispatch({
            type: "ENDRE_FYLKE",
            payload,
        });
    }, []);

    const næringsgruppe = useCallback(
        (payload: EndreNæringsgruppeAction["payload"]) => {
            dispatch({
                type: "ENDRE_NÆRINGSGRUPPE",
                payload,
            });
        },
        []
    );

    const sykefraværsprosent = useCallback(
        (payload: EndreSykefraværsprosentAction["payload"]) => {
            dispatch({
                type: "ENDRE_SYKEFRAVÆRSPROSENT",
                payload,
            });
        },
        []
    );

    const antallArbeidsforhold = useCallback(
        (payload: EndreAntallArbeidsforholdAction["payload"]) => {
            dispatch({
                type: "ENDRE_ARBEIDSFORHOLD",
                payload,
            });
        },
        []
    );

    const iastatus = useCallback((payload: EndreIAStatusAction["payload"]) => {
        dispatch({
            type: "ENDRE_IASTATUS",
            payload,
        });
    }, []);

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

    const lastData = useCallback(
        (payload: SettInnFilterverdierAction["payload"]) => {
            dispatch({
                type: "SETT_INN_FILTERVERDIER",
                payload,
            });
        },
        []
    );

    return {
        state,
        antallArbeidsforhold,
        fylke,
        kommuner,
        iastatus,
        næringsgruppe,
        sykefraværsprosent,
        tilbakestill,
        oppdaterSide,
        oppdaterEiere,
        lastData,
    };
};
