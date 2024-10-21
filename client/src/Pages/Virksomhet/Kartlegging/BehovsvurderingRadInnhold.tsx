import { ExpansionCard } from "@navikt/ds-react";
import { IASak } from "../../../domenetyper/domenetyper";
import { IASakKartlegging } from "../../../domenetyper/iaSakKartlegging";
import { BehovsvurderingResultat } from "./BehovsvurderingResultat";
import { IaSakProsess } from "../../../domenetyper/iaSakProsess";

export const BehovsvurderingRadInnhold = ({
    iaSak,
    behovsvurdering,
    behovsvurderingStatus,
}: {
    iaSak: IASak;
    behovsvurdering: IASakKartlegging;
    samarbeid: IaSakProsess;
    brukerRolle: "Superbruker" | "Saksbehandler" | "Lesetilgang" | undefined;
    brukerErEierAvSak: boolean;
    behovsvurderingStatus: "OPPRETTET" | "PÅBEGYNT" | "AVSLUTTET" | "SLETTET";
}) => {

    if (iaSak !== undefined) {
        if (behovsvurderingStatus === "SLETTET") {
            return null;
        }

        if (behovsvurderingStatus === "AVSLUTTET") {
            return (
                <ExpansionCard.Content>
                    <BehovsvurderingResultat
                        iaSak={iaSak}
                        behovsvurderingId={behovsvurdering.kartleggingId}
                    />
                </ExpansionCard.Content>
            );
        }
    }
};