import { GrafSymboler } from "./SymbolSvg";
import { GrafFarger } from "../../../../styling/farger";

export interface Graflinje {
    navn: string,
    farge: GrafFarger,
    symbol: GrafSymboler,
}

// TODO: Gje dette eit betre namn
export const graflinjer: {[key: string]: Graflinje} = {
    virksomhet: {
        navn: "Virksomhet",
        farge: GrafFarger.rød,
        symbol: "circle",
    },
    næring: {
        navn: "Næring",
        farge: GrafFarger.svart,
        symbol: "wye",
    },
    bransje: {
        navn: "Bransjeprogram",
        farge: GrafFarger.oransje,
        symbol: "diamond",
    },
    sektor: {
        navn: "Sektor",
        farge: GrafFarger.blå,
        symbol: "triangle",
    },
    land: {
        navn: "Norge",
        farge: GrafFarger.grønn,
        symbol: "square",
    },
}
