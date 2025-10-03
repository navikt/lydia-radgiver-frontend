import { BodyShort } from "@navikt/ds-react";
import { SpørreundersøkelseType } from "../../domenetyper/spørreundersøkelseMedInnhold";
import { useErPåAktivSak } from "../../Pages/Virksomhet/VirksomhetContext";

export const SpørreundersøkelseHjelpetekst = ({
    kanEndreSpørreundersøkelser,
    sakErIRettStatus,
    type,
    harPlan,
    erLesebruker,
}: {
    kanEndreSpørreundersøkelser: boolean;
    sakErIRettStatus: boolean;
    type: SpørreundersøkelseType;
    erLesebruker: boolean;
    harPlan?: boolean;
}) => {
    const erPåAktivSak = useErPåAktivSak();
    if (!erPåAktivSak || erLesebruker) {
        return null;
    }
    if (!kanEndreSpørreundersøkelser && !sakErIRettStatus) {
        return (
            <>
                <br />
                <BodyShort>
                    Du må være eier eller følger av saken og være i status{" "}
                    <i>Kartlegges</i> eller <i>Vi bistår</i> for å opprette ny{" "}
                    {type}
                </BodyShort>
            </>
        );
    } else if (!sakErIRettStatus) {
        if (type === "EVALUERING") {
            return (
                <>
                    <br />
                    <BodyShort>
                        Status må være i <i>Vi bistår</i> for å kunne opprette
                        en evaluering
                    </BodyShort>
                </>
            );
        } else if (type === "BEHOVSVURDERING") {
            return (
                <>
                    <br />
                    <BodyShort>
                        Status må være i <i>Kartlegges</i> eller{" "}
                        <i>Vi bistår</i> for å kunne opprette en behovsvurdering
                    </BodyShort>
                </>
            );
        }
    } else if (!kanEndreSpørreundersøkelser) {
        return (
            <>
                <br />
                <BodyShort>
                    Du må være eier eller følger av saken for å opprette ny{" "}
                    {type.toLowerCase()}
                </BodyShort>
            </>
        );
    } else if (type === "EVALUERING" && !harPlan) {
        return (
            <>
                <br />
                <BodyShort>
                    Du må opprette en plan før du kan opprette en evaluering
                </BodyShort>
            </>
        );
    } else {
        return <></>;
    }
};
