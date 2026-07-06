import { SpørreundersøkelseType } from "../../../domenetyper/spørreundersøkelseMedInnhold";
import { exhaustive } from "../../../util/exhaustive_types";

export function formaterSpørreundersøkelsetype(
    type: SpørreundersøkelseType,
    storForbokstav: boolean = true,
): string {
    switch (type) {
        case "BEHOVSVURDERING":
            if (storForbokstav) {
                return "Behovsvurdering";
            }
            return "behovsvurdering";

        case "EVALUERING":
            if (storForbokstav) {
                return "Evaluering";
            }
            return "evaluering";

        default:
            exhaustive(type);
            return "";
    }
}

export function FormatertSpørreundersøkelseType({
    type,
    storForbokstav = true,
}: {
    type: SpørreundersøkelseType;
    storForbokstav?: boolean;
}) {
    return formaterSpørreundersøkelsetype(type, storForbokstav);
}
