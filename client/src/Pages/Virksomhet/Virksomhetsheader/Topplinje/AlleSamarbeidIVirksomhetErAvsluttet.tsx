import React from "react";
import { Button, HStack } from "@navikt/ds-react";
import {
    IASak,
    VirksomhetTilstandDto,
} from "../../../../domenetyper/domenetyper";
import { Virksomhet } from "../../../../domenetyper/virksomhet";
import { EierskapKnapp } from "../../Samarbeid/EierskapKnapp";
import { Salesforcelenke } from "..";
import { lokalDato } from "../../../../util/dato";
import VurderVirksomhetKnapp from "./common/VurderVirksomhetKnapp";

export default function AlleSamarbeidIVirksomhetErAvsluttet({
    iaSak,
    virksomhet,
    tilstand,
}: {
    iaSak: IASak;
    virksomhet: Virksomhet;
    tilstand: VirksomhetTilstandDto;
}) {
    return (
        <HStack gap="4">
            <VurderVirksomhetKnapp virksomhet={virksomhet} />
            <Button size="small" variant="primary-neutral" disabled>
                Avsluttet frem til{" "}
                {tilstand?.nesteTilstand?.planlagtDato &&
                    lokalDato(tilstand.nesteTilstand.planlagtDato)}
            </Button>
            <EierskapKnapp iaSak={iaSak} />
            <Salesforcelenke orgnr={virksomhet.orgnr} />
        </HStack>
    );
}
