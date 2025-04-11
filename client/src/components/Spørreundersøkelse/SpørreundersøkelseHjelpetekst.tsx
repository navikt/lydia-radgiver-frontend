import { BodyShort } from "@navikt/ds-react";
import { SpørreundersøkelseType } from "../../domenetyper/spørreundersøkelseMedInnhold";
import { useErPåAktivSak } from "../../Pages/Virksomhet/VirksomhetContext";

export const SpørreundersøkelseHjelpetekst = ({
    brukerErEierAvSak,
    sakErIRettStatus,
    type,
    harPlan,
}: {
    brukerErEierAvSak: boolean;
    sakErIRettStatus: boolean;
    type: SpørreundersøkelseType;
    harPlan?: boolean;
}) => {
    const erPåAktivSak = useErPåAktivSak();
    if (!erPåAktivSak) {
        return null;
    }
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
        if (type === "Evaluering") {
            return (
                <>
                    <br />
                    <BodyShort>
                        Status må være i <i>Vi bistår</i> for å kunne opprette
                        en {type}
                    </BodyShort>
                </>
            );
        } else if (type === "Behovsvurdering") {
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
    } else if (type === "Evaluering" && !harPlan) {
        return (
            <>
                <br />
                <BodyShort>
                    Du må opprette en plan før du kan opprette en {type}
                </BodyShort>
            </>
        );
    } else {
        return <></>;
    }
};
