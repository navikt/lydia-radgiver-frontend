import React from "react";
import { HStack } from "@navikt/ds-react";
import { IASak } from "../../../../domenetyper/domenetyper";
import { Virksomhet } from "../../../../domenetyper/virksomhet";
import { EierskapKnapp } from "../../Samarbeid/EierskapKnapp";
import { Salesforcelenke } from "..";

export default function VirksomhetHarAktiveSamarbeid({
    iaSak,
    virksomhet,
}: {
    iaSak: IASak;
    virksomhet: Virksomhet;
}) {
    return (
        <HStack gap="4">
            <EierskapKnapp iaSak={iaSak} />
            <Salesforcelenke orgnr={virksomhet.orgnr} />
        </HStack>
    );
}
