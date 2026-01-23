import { SpørreundersøkelseType } from "../../../domenetyper/spørreundersøkelseMedInnhold";

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
