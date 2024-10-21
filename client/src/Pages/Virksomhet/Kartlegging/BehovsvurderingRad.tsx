import { IASak } from "../../../domenetyper/domenetyper";
import { IASakKartlegging } from "../../../domenetyper/iaSakKartlegging";
import { ExpansionCard } from "@navikt/ds-react";
import styled from "styled-components";
import { BehovsvurderingRadInnhold } from "./BehovsvurderingRadInnhold";
import React, { useState } from "react";
import { IaSakProsess } from "../../../domenetyper/iaSakProsess";
import { BehovsvurderingCardHeaderInnhold } from "./BehovsvurderingCardHeaderInnhold";

const StyledExpansionCard = styled(ExpansionCard) <{ $avstandFraSiste: number }>`
    margin-bottom: 1rem;

    &>div {
        z-index: ${(props) => props.$avstandFraSiste + 5};
    }
`;


export const BehovsvurderingRad = ({
    iaSak,
    behovsvurdering,
    brukerRolle,
    samarbeid,
    defaultOpen,
    brukerErEierAvSak,
    dato,
    avstandFraSiste,
}: {
    iaSak: IASak;
    samarbeid: IaSakProsess;
    behovsvurdering: IASakKartlegging;
    brukerRolle: "Superbruker" | "Saksbehandler" | "Lesetilgang" | undefined;
    dato?: string;
    brukerErEierAvSak: boolean;
    defaultOpen?: boolean;
    avstandFraSiste: number;
}) => {
    const [erÅpen, setErÅpen] = useState(defaultOpen);

    return (
        <StyledExpansionCard
            aria-label="Behovsvurdering"
            open={erÅpen}
            onToggle={(open: boolean) => {
                setErÅpen(open);
            }}
            $avstandFraSiste={avstandFraSiste}
        >
            <BehovsvurderingCardHeaderInnhold
                iaSak={iaSak}
                samarbeid={samarbeid}
                behovsvurderingStatus={behovsvurdering.status}
                behovsvurdering={behovsvurdering}
                brukerRolle={brukerRolle}
                brukerErEierAvSak={brukerErEierAvSak}
                dato={dato} />
            {erÅpen && behovsvurdering.status === "AVSLUTTET" && (
                <BehovsvurderingRadInnhold
                    iaSak={iaSak}
                    samarbeid={samarbeid}
                    behovsvurderingStatus={behovsvurdering.status}
                    behovsvurdering={behovsvurdering}
                    brukerRolle={brukerRolle}
                    brukerErEierAvSak={brukerErEierAvSak}
                />
            )}
        </StyledExpansionCard>
    );
};
