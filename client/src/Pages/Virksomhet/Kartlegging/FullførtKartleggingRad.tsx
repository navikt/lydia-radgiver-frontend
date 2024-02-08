import { Accordion, Heading } from "@navikt/ds-react";
import React from "react";
import { StatusBadge } from "../../../components/Badge/StatusBadge";
import { KartleggingResultat } from "./KartleggingResultat";
import styled from "styled-components";
import { IASak, IASakKartleggingStatusType } from "../../../domenetyper/domenetyper";

const AccordionHeaderContent = styled.div`
    display: flex;
    align-items: center;
    gap: 2rem;
`;

interface AvsluttetKartleggingProps {
    iaSak: IASak,
    kartleggingId: string,
    kartleggingStatus: IASakKartleggingStatusType,
    index: number
}

export const FullførtKartleggingRad = ({ iaSak, kartleggingId, kartleggingStatus, index }: AvsluttetKartleggingProps) => {

    return (
        <Accordion.Item>
            <Accordion.Header>
                <AccordionHeaderContent>
                    <StatusBadge status={kartleggingStatus} />
                    Kartlegging nr {index + 1}
                </AccordionHeaderContent>
            </Accordion.Header>

            <Accordion.Content>
                <Heading  spacing={true} size="medium">KartleggingId: {kartleggingId}</Heading>
                <KartleggingResultat iaSak={iaSak} kartleggingId={kartleggingId} />
            </Accordion.Content>
        </Accordion.Item>
    )
}
