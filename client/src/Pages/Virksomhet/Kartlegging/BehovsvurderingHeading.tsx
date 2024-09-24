import { IaSakProsess } from "../../../domenetyper/iaSakProsess";
import { Heading, HStack, Tag } from "@navikt/ds-react";
import React from "react";

export const BehovsvurderingHeading = ({
    samarbeid,
}: {
    samarbeid: IaSakProsess;
}) => (
    <HStack align={"center"} justify={"space-between"}>
        <HStack align={"center"} gap={"8"}>
            <Heading level="2" size="medium" style={{ width: "11rem" }}>
                Behovsvurdering
            </Heading>
            {samarbeid && (
                <Tag variant={"alt3-filled"} size="small">
                    {samarbeid.navn || "Samarbeid uten navn"}
                </Tag>
            )}
        </HStack>
    </HStack>
);
