import { BodyShort, Button } from "@navikt/ds-react";
import React from "react";
import { IAProsessStatusType } from "../../../../domenetyper/domenetyper";
import { PlusIcon } from "@navikt/aksel-icons";
import { useErPåAktivSak } from "../../VirksomhetContext";

interface SamarbeidsDropdownFooterProps {
    setÅpen: React.Dispatch<React.SetStateAction<boolean>>;
    kanEndreSamarbeid: boolean;
    iaSakStatus?: IAProsessStatusType | undefined;
}

export const SamarbeidsDropdownFooter = ({
    setÅpen,
    kanEndreSamarbeid,
    iaSakStatus,
}: SamarbeidsDropdownFooterProps) => {
    const visOpprettSamarbeidKnapp =
        kanEndreSamarbeid &&
        (iaSakStatus === "KARTLEGGES" || iaSakStatus === "VI_BISTÅR");

    const erPåAktivSak = useErPåAktivSak();
    if (!erPåAktivSak) {
        return null;
    }

    const kravTilOppretteSamarbeid = () => {
        if (iaSakStatus === undefined || iaSakStatus === "IKKE_AKTIV") {
            return (
                <>
                    Du kan opprette og administrere samarbeid når saken er i{" "}
                    status <i>Kartlegges</i> eller <i>Vi bistår</i>.
                </>
            );
        }
        if (
            !(iaSakStatus === "KARTLEGGES" || iaSakStatus === "VI_BISTÅR") &&
            !kanEndreSamarbeid
        ) {
            return (
                <>
                    Status må være i <i>Kartlegges</i> eller <i>Vi bistår</i> og{" "}
                    du må være eier eller følger av saken for å opprette og
                    administrere samarbeid.
                </>
            );
        }

        if (
            !(iaSakStatus === "KARTLEGGES" || iaSakStatus === "VI_BISTÅR") &&
            kanEndreSamarbeid
        ) {
            return (
                <>
                    Status må være i <i>Kartlegges</i> eller <i>Vi bistår</i>{" "}
                    for å opprette og administrere samarbeid.
                </>
            );
        }

        if (
            (iaSakStatus === "KARTLEGGES" || iaSakStatus === "VI_BISTÅR") &&
            !kanEndreSamarbeid
        ) {
            return (
                <>
                    Du må være eier eller følger av saken for å opprette og
                    administrere samarbeid.
                </>
            );
        }
    };

    return visOpprettSamarbeidKnapp ? (
        <Button
            icon={<PlusIcon fontSize={"1.5rem"} />}
            variant="primary"
            onClick={() => setÅpen(true)}
            size={"small"}
            title={"Opprett samarbeid"}
        >
            Opprett samarbeid
        </Button>
    ) : (
        <BodyShort>{kravTilOppretteSamarbeid()}</BodyShort>
    );
};
