import React, { useState } from "react";
import { Button, Tooltip } from "@navikt/ds-react";
import { useHentBrukerinformasjon } from "../../../../../api/lydia-api/bruker";
import { Virksomhet } from "../../../../../domenetyper/virksomhet";
import VurderVirksomhetModal from "./VurderVirksomhetModal";

export default function VurderVirksomhetKnapp({
    virksomhet,
    label = "Vurder virksomheten",
}: {
    virksomhet: Virksomhet;
    label?: string;
}) {
    const [modalErÅpen, setModalErÅpen] = useState(false);

    const { data: brukerInformasjon } = useHentBrukerinformasjon();

    if (brukerInformasjon?.rolle === "Superbruker") {
        return (
            <>
                <Button onClick={() => setModalErÅpen(true)} size="small">
                    {label}
                </Button>
                {modalErÅpen && (
                    <VurderVirksomhetModal
                        erÅpen={modalErÅpen}
                        onClose={() => setModalErÅpen(false)}
                        orgnr={virksomhet.orgnr}
                    />
                )}
            </>
        );
    }

    return (
        <Tooltip content="Du må ha rollen som superbruker for å vurdere">
            <Button disabled size="small">
                {label}
            </Button>
        </Tooltip>
    );
}
