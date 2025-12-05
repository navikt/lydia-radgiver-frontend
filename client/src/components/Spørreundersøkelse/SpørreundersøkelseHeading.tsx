import { Heading, HStack } from "@navikt/ds-react";
import { IaSakProsess } from "../../domenetyper/iaSakProsess";
import { SpørreundersøkelseType } from "../../domenetyper/spørreundersøkelseMedInnhold";
import Samarbeidsfanemeny from "../Samarbeidsfanemeny";

export const SpørreundersøkelseHeading = ({
    type,
    children,
}: {
    samarbeid: IaSakProsess;
    type?: SpørreundersøkelseType;
    children?: React.ReactNode;
}) => {
    return (
        <HStack align={"center"} justify={"space-between"} style={{ marginTop: '0.75rem', marginBottom: '1.5rem' }}>
            <HStack align={"center"} gap={"8"}>
                {children ?? (
                    <Heading
                        level="2"
                        size="medium"
                        style={{
                            width: type === "BEHOVSVURDERING" ? "11rem" : "6rem",
                        }}
                    >
                        spørreundersøkelseHeading(type)
                    </Heading>
                )}
            </HStack>
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
        default:
            return null;
    }
}
