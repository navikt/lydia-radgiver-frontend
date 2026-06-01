import { HStack } from "@navikt/ds-react";
import { Virksomhet } from "../../../../domenetyper/virksomhet";
import { Salesforcelenke } from "..";
import VurderVirksomhetKnapp from "./common/VurderVirksomhetKnapp";

export default function VirksomhetKlarTilVurdering({
    virksomhet,
}: {
    virksomhet: Virksomhet;
}) {
    return (
        <HStack gap={"4"}>
            <VurderVirksomhetKnapp virksomhet={virksomhet} />
            <Salesforcelenke orgnr={virksomhet.orgnr} />
        </HStack>
    );
}
