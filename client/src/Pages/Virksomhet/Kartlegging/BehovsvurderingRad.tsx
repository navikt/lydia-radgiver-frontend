import { IASak } from "../../../domenetyper/domenetyper";
import { IASakKartlegging } from "../../../domenetyper/iaSakKartlegging";
import { Accordion } from "@navikt/ds-react";
import styled from "styled-components";
import { BehovsvurderingRadInnhold } from "./BehovsvurderingRadInnhold";
import { KartleggingStatusBedge } from "../../../components/Badge/KartleggingStatusBadge";
import React, { useState } from "react";
import { IaSakProsess } from "../../../domenetyper/iaSakProsess";

const AccordionHeader = styled(Accordion.Header)`
    width: 100%;

    .navds-heading {
        display: flex;
        align-items: center;
        justify-content: space-between;
        width: 100%;
    }
`;

const HeaderRightContent = styled.span`
    display: flex;
    align-items: center;
    font-size: 1rem;
`;

const KartleggingDato = styled.span`
    width: 8rem;
    text-align: right;
`;

export const BehovsvurderingRad = ({
    iaSak,
    behovsvurdering,
    brukerRolle,
    samarbeid,
    defaultOpen,
    brukerErEierAvSak,
    dato,
}: {
    iaSak: IASak;
    samarbeid: IaSakProsess;
    behovsvurdering: IASakKartlegging;
    brukerRolle: "Superbruker" | "Saksbehandler" | "Lesetilgang" | undefined;
    dato?: string;
    brukerErEierAvSak: boolean;
    defaultOpen?: boolean;
}) => {
    const [erÅpen, setErÅpen] = useState(defaultOpen);

    return (
        <Accordion.Item
            open={erÅpen}
            defaultOpen={defaultOpen}
            onOpenChange={(open: boolean) => {
                setErÅpen(open);
            }}
        >
            <AccordionHeader>
                Behovsvurdering
                <HeaderRightContent>
                    <KartleggingStatusBedge status={behovsvurdering.status} />
                    <KartleggingDato>{dato}</KartleggingDato>
                </HeaderRightContent>
            </AccordionHeader>
            {erÅpen && (
                <BehovsvurderingRadInnhold
                    iaSak={iaSak}
                    samarbeid={samarbeid}
                    behovsvurderingStatus={behovsvurdering.status}
                    behovsvurdering={behovsvurdering}
                    brukerRolle={brukerRolle}
                    brukerErEierAvSak={brukerErEierAvSak}
                />
            )}
        </Accordion.Item>
    );
};
