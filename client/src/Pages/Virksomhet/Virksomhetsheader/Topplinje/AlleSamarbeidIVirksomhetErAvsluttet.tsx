import React from "react";
import { Tag, HStack } from "@navikt/ds-react";
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
            <Tag
                size="small"
                variant="info-filled"
                style={{ backgroundColor: "var(--a-gray-50)" }}
            >
                Avsluttet frem til{" "}
                {tilstand?.nesteTilstand?.planlagtDato &&
                    lokalDato(tilstand.nesteTilstand.planlagtDato)}
            </Tag>
            <EierskapKnapp iaSak={iaSak} />
            <Salesforcelenke orgnr={virksomhet.orgnr} />
        </HStack>
    );
}
