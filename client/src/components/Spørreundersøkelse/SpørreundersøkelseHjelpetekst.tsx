import { BodyShort } from "@navikt/ds-react";

export const SpørreundersøkelseHjelpetekst = ({
    brukerErEierAvSak,
    sakErIRettStatus,
    type,
}: {
    brukerErEierAvSak: boolean;
    sakErIRettStatus: boolean;
    type: "evaluering" | "behovsvurdering";
}) => {
    if (!brukerErEierAvSak && !sakErIRettStatus) {
        return (
            <>
                <br />
                <BodyShort>
                    Du må være eier av saken og være i status <i>Kartlegges</i>{" "}
                    eller <i>Vi bistår</i> for å opprette ny {type}
                </BodyShort>
            </>
        );
    } else if (!sakErIRettStatus) {
        if (type === "evaluering") {
            return (
                <>
                    <br />
                    <BodyShort>
                        Status må være i <i>Vi bistår</i>
                        for å kunne opprette en {type}
                    </BodyShort>
                </>
            );
        } else if (type === "behovsvurdering") {
            return (
                <>
                    <br />
                    <BodyShort>
                        Status må være i <i>Kartlegges</i> eller{" "}
                        <i>Vi bistår</i> for å kunne opprette en {type}
                    </BodyShort>
                </>
            );
        }
    } else if (!brukerErEierAvSak) {
        return (
            <>
                <br />
                <BodyShort>
                    Du må være eier av saken for å opprette ny {type}
                </BodyShort>
            </>
        );
    } else {
        return <></>;
    }
};
