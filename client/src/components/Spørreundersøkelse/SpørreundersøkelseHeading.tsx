import { Heading, HStack, Tag } from "@navikt/ds-react";
import { defaultNavnHvisTomt, IaSakProsess } from "../../domenetyper/iaSakProsess";

export const SpørreundersøkelseHeading = ({
    samarbeid,
    type,
}: {
    samarbeid: IaSakProsess;
    type: "Evaluering" | "Behovsvurdering";
}) => {
    return (
        <HStack align={"center"} justify={"space-between"}>
            <HStack align={"center"} gap={"8"}>
                <Heading level="2" size="medium" style={{ width: type === "Behovsvurdering" ? "11rem" : "6rem" }}>
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
}
