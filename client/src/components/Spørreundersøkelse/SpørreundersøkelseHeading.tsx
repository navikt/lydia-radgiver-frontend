import { Heading, HStack } from "@navikt/ds-react";
import {
    IaSakProsess,
} from "../../domenetyper/iaSakProsess";
import { SpørreundersøkelseType } from "../../domenetyper/spørreundersøkelseMedInnhold";
import Samarbeidsfanemeny from "../Samarbeidsfanemeny";

export const SpørreundersøkelseHeading = ({
    type,
}: {
    samarbeid: IaSakProsess;
    type: SpørreundersøkelseType;
}) => {
    return (
        <HStack align={"center"} justify={"space-between"}>
            <HStack align={"center"} gap={"8"}>
                <Heading
                    level="2"
                    size="medium"
                    style={{
                        width: type === "Behovsvurdering" ? "11rem" : "6rem",
                    }}
                >
                    {type}
                </Heading>
            </HStack>
            <Samarbeidsfanemeny type={type} />
        </HStack>
    );
};

