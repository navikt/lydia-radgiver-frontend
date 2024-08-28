import { IASak } from "../../../domenetyper/domenetyper";
import { IASakKartlegging } from "../../../domenetyper/iaSakKartlegging";
import { Accordion } from "@navikt/ds-react";
import styled from "styled-components";
import { KartleggingRadInnhold } from "./KartleggingRadInnhold";
import { KartleggingStatusBedge } from "../../../components/Badge/KartleggingStatusBadge";
import React, { useState } from "react";
import EksportVisning from "./EksportVisning";
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
    const [erIEksportMode, setErIEksportMode] = useState(false);

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
                    {
                        // Fjern denne når den skal live
                        erIDev && <EksportVisning
                            iaSak={iaSak}
                            kartlegging={kartlegging}
                            erIEksportMode={erIEksportMode}
                            setErIEksportMode={setErIEksportMode} />}
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
