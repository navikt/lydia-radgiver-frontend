import { HStack } from "@navikt/ds-react";
import { IaSakProsess } from "../../domenetyper/iaSakProsess";
import { SpørreundersøkelseType } from "../../domenetyper/spørreundersøkelseMedInnhold";
import Samarbeidsfanemeny from "../Samarbeidsfanemeny";
import { exhaustive } from "../../util/exhaustive_types";

export const SpørreundersøkelseHeading = ({
    type,
    children,
}: {
    samarbeid: IaSakProsess;
    type?: SpørreundersøkelseType;
    children?: React.ReactNode;
}) => {
    return (
        <HStack
            align={"center"}
            justify={"space-between"}
            style={{ marginTop: "0.75rem", marginBottom: "1.5rem" }}
        >
            <HStack align={"center"}>{children}</HStack>
            <Samarbeidsfanemeny type={type} />
        </HStack>
    );
};

export function spørreundersøkelseHeading(type?: SpørreundersøkelseType) {
    switch (type) {
        case "EVALUERING":
            return "Evaluering";
        case "BEHOVSVURDERING":
            return "Behovsvurdering";
        case undefined:
            break;
        default:
            return exhaustive(type);
    }
    return null;
}
