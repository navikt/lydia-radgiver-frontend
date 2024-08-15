import { IASak } from "../../../domenetyper/domenetyper";
import { IASakKartlegging } from "../../../domenetyper/iaSakKartlegging";
import { Accordion } from "@navikt/ds-react";
import styled from "styled-components";
import { KartleggingRadInnhold } from "./KartleggingRadInnhold";
import { KartleggingStatusBedge } from "../../../components/Badge/KartleggingStatusBadge";
import React, { useState } from "react";
import PrintVisning from "./PrintVisning";
import { erIDev } from "../../../components/Dekoratør/Dekoratør";

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
}

export const KartleggingRad = ({
    iaSak,
    kartlegging,
    brukerRolle,
    defaultOpen,
    brukerErEierAvSak,
    dato,
}: KartleggingRadProps) => {
    const [erÅpen, setErÅpen] = useState(defaultOpen);
    const [erIPrintMode, setErIPrintMode] = useState(false);

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
                    {erIDev && <PrintVisning
                        iaSak={iaSak}
                        kartlegging={kartlegging}
                        erIPrintMode={erIPrintMode}
                        setErIPrintMode={setErIPrintMode} />}
                    <KartleggingStatusBedge status={kartlegging.status} />
                    <KartleggingDato>{dato}</KartleggingDato>
                </HeaderRightContent>
            </AccordionHeader>
            {erÅpen && (
                <KartleggingRadInnhold
                    iaSak={iaSak}
                    kartleggingstatus={kartlegging.status}
                    kartlegging={kartlegging}
                    brukerRolle={brukerRolle}
                    brukerErEierAvSak={brukerErEierAvSak}
                />
            )}
        </Accordion.Item>
    );
};
