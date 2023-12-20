import { GrafSymboler } from "./SymbolSvg";
import { GrafFarger } from "../../../../styling/farger";

export const enum Grafer {
    VIRKSOMHET = "virksomhet",
    NÆRING = "næring",
    BRANSJE = "bransje",
    SEKTOR = "sektor",
    LAND = "land",
}

export interface Graflinje {
    navn: string,
    farge: GrafFarger,
    symbol: GrafSymboler,
    rekkefølge: number,
}

export const graflinjer: { [key: string]: Graflinje } = {
    [Grafer.VIRKSOMHET]: {
        navn: "Virksomhet",
        farge: GrafFarger.data_3,
        symbol: "circle",
        rekkefølge: 0,
    },
    [Grafer.NÆRING]: {
        navn: "Næring",
        farge: GrafFarger.data_4,
        symbol: "wye",
        rekkefølge: 1,
    },
    [Grafer.BRANSJE]: {
        navn: "Bransje",
        farge: GrafFarger.data_5,
        symbol: "diamond",
        rekkefølge: 2,
    },
    [Grafer.SEKTOR]: {
        navn: "Sektor",
        farge: GrafFarger.data_6,
        symbol: "triangle",
        rekkefølge: 3,
    },
    [Grafer.LAND]: {
        navn: "Norge",
        farge: GrafFarger.data_1,
        symbol: "square",
        rekkefølge: 4,
    },
}

export const grafrekkefølge = (a: [string, Graflinje], b: [string, Graflinje]) => {
    // a og b er ei liste av key:string og value:Graflinje laga med Object.entries(graflinjer)
    // for å samanlikne sortering må vi sjå på indeks 1 i a og b.
    return b[1].rekkefølge - a[1].rekkefølge
}
