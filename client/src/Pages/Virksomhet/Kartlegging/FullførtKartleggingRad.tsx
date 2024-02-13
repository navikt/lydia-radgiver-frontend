import {Accordion} from "@navikt/ds-react";
import React from "react";
import {KartleggingResultat} from "./KartleggingResultat";
import {IASak} from "../../../domenetyper/domenetyper";

interface AvsluttetKartleggingProps {
    iaSak: IASak,
    kartleggingId: string,
}

export const FullførtKartleggingRad = ({ iaSak, kartleggingId }: AvsluttetKartleggingProps) => {

    return (
        <Accordion.Content>
            <KartleggingResultat iaSak={iaSak} kartleggingId={kartleggingId} />
        </Accordion.Content>
    )
}
