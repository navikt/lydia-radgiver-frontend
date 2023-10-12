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
}

// TODO: Gje dette eit betre namn
export const graflinjer: { [key: string]: Graflinje } = {
    [Grafer.VIRKSOMHET]: {
        navn: "Virksomhet",
        farge: GrafFarger.rød,
        symbol: "circle",
    },
    [Grafer.NÆRING]: {
        navn: "Næring",
        farge: GrafFarger.svart,
        symbol: "wye",
    },
    [Grafer.BRANSJE]: {
        navn: "Bransjeprogram",
        farge: GrafFarger.oransje,
        symbol: "diamond",
    },
    [Grafer.SEKTOR]: {
        navn: "Sektor",
        farge: GrafFarger.blå,
        symbol: "triangle",
    },
    [Grafer.LAND]: {
        navn: "Norge",
        farge: GrafFarger.grønn,
        symbol: "square",
    },
}
