import { Accordion, BodyShort } from "@navikt/ds-react";
import React from "react";
import { StatusBadge } from "../../../components/Badge/StatusBadge";
import { KartleggingResultat } from "./KartleggingResultat";
import { IASakKartlegging } from "../../../domenetyper/iaSakKartlegging";
import styled from "styled-components";
import { IASak } from "../../../domenetyper/domenetyper";

const AccordionHeaderContent = styled.div`
    display: flex;
    align-items: center;
    gap: 2rem;
`;

interface AvsluttetKartleggingProps {
    iaSak: IASak,
    item: IASakKartlegging,
    index: number
}

export const FullførtKartleggingRad = ({ iaSak, item, index }: AvsluttetKartleggingProps) => {

    return (
        <Accordion.Item>
            <Accordion.Header>
                <AccordionHeaderContent>
                    <StatusBadge
                        status={item.status}
                    />
                    Kartlegging nr {index + 1}
                </AccordionHeaderContent>
            </Accordion.Header>

            <Accordion.Content>
                <BodyShort>KartleggingId: {item.kartleggingId}</BodyShort>
                <KartleggingResultat
                    iaSak={iaSak}
                    kartleggingId={
                        item.kartleggingId
                    }
                />
            </Accordion.Content>
        </Accordion.Item>
    )
}
