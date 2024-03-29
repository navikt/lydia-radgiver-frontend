import { IASak } from "../../../domenetyper/domenetyper";
import { IASakKartlegging } from "../../../domenetyper/iaSakKartlegging";
import { PågåendeKartleggingRad } from "./PågåendeKartleggingRad";
import { FullførtKartleggingRad } from "./FullførtKartleggingRad";
import { KartleggingRadIkkeEier } from "./KartleggingRadIkkeEier";
import { Accordion } from "@navikt/ds-react";
import styled from "styled-components";
import { NyKartleggingRad } from "./NyKartleggingRad";
import { KartleggingStatusBedge } from "../../../components/Badge/KartleggingStatusBadge";
import { useState } from "react";

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
    brukerErEierAvSak: boolean;
    dato?: string;
    defaultOpen?: boolean;
}

export const KartleggingRad = ({
    iaSak,
    kartlegging,
    brukerErEierAvSak,
    defaultOpen,
    dato,
}: KartleggingRadProps) => {
    const [erÅpen, setErÅpen] = useState(defaultOpen);

    if (!brukerErEierAvSak) {
        return <KartleggingRadIkkeEier kartlegging={kartlegging} />;
    }

    return (
        <Accordion.Item
            defaultOpen={defaultOpen}
            onOpenChange={(open: boolean) => {
                setErÅpen(open);
            }}
        >
            <AccordionHeader>
                Kartlegging
                <HeaderRightContent>
                    <KartleggingStatusBedge status={kartlegging.status} />
                    <KartleggingDato>{dato}</KartleggingDato>
                </HeaderRightContent>
            </AccordionHeader>

            {erÅpen && kartlegging.status === "OPPRETTET" && (
                <NyKartleggingRad
                    iaSak={iaSak}
                    kartlegging={kartlegging}
                    vertId={kartlegging.vertId}
                />
            )}

            {erÅpen && kartlegging.status === "PÅBEGYNT" && (
                <PågåendeKartleggingRad
                    iaSak={iaSak}
                    kartlegging={kartlegging}
                    vertId={kartlegging.vertId}
                />
            )}

            {erÅpen && kartlegging.status === "AVSLUTTET" && (
                <FullførtKartleggingRad
                    iaSak={iaSak}
                    kartlegging={kartlegging}
                />
            )}
        </Accordion.Item>
    );
};
