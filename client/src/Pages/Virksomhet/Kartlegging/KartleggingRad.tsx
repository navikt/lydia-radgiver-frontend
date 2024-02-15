import { IASak } from "../../../domenetyper/domenetyper";
import { IASakKartlegging } from "../../../domenetyper/iaSakKartlegging";
import { PågåendeKartleggingRad } from "./PågåendeKartleggingRad";
import { FullførtKartleggingRad } from "./FullførtKartleggingRad";
import { KartleggingRadIkkeEier } from "./KartleggingRadIkkeEier";
import { Accordion } from "@navikt/ds-react";
import { StatusBadge } from "../../../components/Badge/StatusBadge";
import styled from "styled-components";
import { lokalDatoMedKlokkeslett } from "../../../util/dato";
import { NyKartleggingRad } from "./NyKartleggingRad";

const AccordionHeaderContent = styled.div`
    display: flex;
    align-items: center;
    gap: 2rem;
`;

interface KartleggingRadProps {
    iaSak: IASak;
    kartlegging: IASakKartlegging;
    brukerErEierAvSak: boolean;
    defaultOpen?: boolean;
}

export const KartleggingRad = ({
    iaSak,
    kartlegging,
    brukerErEierAvSak,
    defaultOpen,
}: KartleggingRadProps) => {
    if (!brukerErEierAvSak) {
        return <KartleggingRadIkkeEier kartlegging={kartlegging} />;
    }

    return (
        <Accordion.Item defaultOpen={defaultOpen}>
            <Accordion.Header>
                <AccordionHeaderContent>
                    <StatusBadge status={kartlegging.status} />
                    Kartlegging opprettet{" "}
                    {lokalDatoMedKlokkeslett(kartlegging.opprettetTidspunkt)}
                </AccordionHeaderContent>
            </Accordion.Header>
            {kartlegging.status === "OPPRETTET" && (
                <NyKartleggingRad
                    iaSak={iaSak}
                    kartlegging={kartlegging}
                    vertId={kartlegging.vertId}
                />
            )}

            {kartlegging.status === "PÅBEGYNT" && (
                <PågåendeKartleggingRad
                    iaSak={iaSak}
                    kartlegging={kartlegging}
                    vertId={kartlegging.vertId}
                />
            )}

            {kartlegging.status === "AVSLUTTET" && (
                <FullførtKartleggingRad
                    iaSak={iaSak}
                    kartleggingId={kartlegging.kartleggingId}
                />
            )}
        </Accordion.Item>
    );
};
