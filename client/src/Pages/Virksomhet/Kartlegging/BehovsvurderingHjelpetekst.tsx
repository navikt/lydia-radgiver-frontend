import { BodyShort } from "@navikt/ds-react";
import React from "react";

export const BehovsvurderingHjelpetekst = ({
    brukerErEierAvSak,
    sakErIRettStatus,
}: {
    brukerErEierAvSak: boolean;
    sakErIRettStatus: boolean;
}) => {
    if (!brukerErEierAvSak && !sakErIRettStatus) {
        return (
            <>
                <br />
                <BodyShort>
                    Du må være eier av saken og være i status <i>Kartlegges</i>{" "}
                    eller <i>Vi bistår</i> for å opprette ny behovsvurdering
                </BodyShort>
            </>
        );
    } else if (!sakErIRettStatus) {
        return (
            <>
                <br />
                <BodyShort>
                    Status må være i <i>Kartlegges</i> eller <i>Vi bistår</i>{" "}
                    for å kunne opprette en behovsvurdering
                </BodyShort>
            </>
        );
    } else if (!brukerErEierAvSak) {
        return (
            <>
                <br />
                <BodyShort>
                    Du må være eier av saken for å opprette ny plan
                </BodyShort>
            </>
        );
    } else {
        return <></>;
    }
};
