import { Heading, HStack, Tag } from "@navikt/ds-react";
import {
    defaultNavnHvisTomt,
    IaSakProsess,
} from "../../domenetyper/iaSakProsess";
import { SpørreundersøkelseType } from "../../domenetyper/spørreundersøkelseMedInnhold";

export const SpørreundersøkelseHeading = ({
    samarbeid,
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
                {samarbeid && (
                    <Tag variant={"alt3-filled"} size="small">
                        {defaultNavnHvisTomt(samarbeid.navn)}
                    </Tag>
                )}
            </HStack>
        </HStack>
    );
};
