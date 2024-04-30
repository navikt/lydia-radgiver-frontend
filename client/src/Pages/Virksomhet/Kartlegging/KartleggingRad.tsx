import { IASak } from "../../../domenetyper/domenetyper";
import { IASakKartlegging } from "../../../domenetyper/iaSakKartlegging";
import { Accordion } from "@navikt/ds-react";
import styled from "styled-components";
import { KartleggingRadInnhold } from "./KartleggingRadInnhold";
import { KartleggingStatusBedge } from "../../../components/Badge/KartleggingStatusBadge";
import React, { useState } from "react";

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

interface KartleggingRadProps {
    iaSak: IASak;
    kartlegging: IASakKartlegging;
    brukerRolle: "Superbruker" | "Saksbehandler" | "Lesetilgang" | undefined;
    dato?: string;
    brukerErEierAvSak: boolean;
    defaultOpen?: boolean;
    visSomProsent: boolean;
}

export const KartleggingRad = ({
    iaSak,
    kartlegging,
    brukerRolle,
    defaultOpen,
    brukerErEierAvSak,
    dato,
    visSomProsent,
}: KartleggingRadProps) => {
    const [erÅpen, setErÅpen] = useState(defaultOpen);

    return (
        <Accordion.Item
            defaultOpen={defaultOpen}
            onOpenChange={(open: boolean) => {
                setErÅpen(open);
            }}
        >
            <AccordionHeader>
                Behovsvurdering
                <HeaderRightContent>
                    <KartleggingStatusBedge status={kartlegging.status} />
                    <KartleggingDato>{dato}</KartleggingDato>
                </HeaderRightContent>
            </AccordionHeader>
            {erÅpen && (
                <KartleggingRadInnhold
                    iaSak={iaSak}
                    kartleggingstatus={kartlegging.status}
                    kartlegging={kartlegging}
                    vertId={kartlegging.vertId}
                    brukerRolle={brukerRolle}
                    brukerErEierAvSak={brukerErEierAvSak}
                    visSomProsent={visSomProsent}
                />
            )}
        </Accordion.Item>
    );
};
