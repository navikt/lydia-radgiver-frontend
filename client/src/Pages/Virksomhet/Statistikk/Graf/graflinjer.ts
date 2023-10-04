import { GrafSymboler } from "./SymbolSvg";
import { GrafFarger } from "../../../../styling/farger";

interface Graflinje {
    farge: GrafFarger,
    symbol: GrafSymboler,
}

// TODO: Gje dette eit betre namn
export const graflinjer: {[key: string]: Graflinje} = {
    virksomhet: {
        farge: GrafFarger.rød,
        symbol: "circle",
    },
    land: {
        farge: GrafFarger.grønn,
        symbol: "square",
    },
}
