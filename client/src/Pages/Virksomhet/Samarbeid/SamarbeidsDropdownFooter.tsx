import { BodyShort, Button } from "@navikt/ds-react";
import React from "react";
import { IAProsessStatusType } from "../../../domenetyper/domenetyper";
import { PlusIcon } from "@navikt/aksel-icons";
import styled from "styled-components";

const OpprettSamarbeidKnapp = styled.div`
    padding-left: 1rem;
`;

interface SamarbeidsDropdownFooterProps {
    setÅpen: React.Dispatch<React.SetStateAction<boolean>>;
    brukerErEierAvSak: boolean;
    iaSakStatus?: IAProsessStatusType | undefined;
}

export const SamarbeidsDropdownFooter = ({
    setÅpen,
    brukerErEierAvSak,
    iaSakStatus,
}: SamarbeidsDropdownFooterProps) => {
    const visOpprettSamarbeidKnapp =
        brukerErEierAvSak &&
        (iaSakStatus === "KARTLEGGES" || iaSakStatus === "VI_BISTÅR");

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
            !brukerErEierAvSak
        ) {
            return (
                <>
                    Status må være i <i>Kartlegges</i> eller <i>Vi bistår</i> og{" "}
                    du må være eier av saken for å opprette og administrere
                    samarbeid.
                </>
            );
        }

        if (
            !(iaSakStatus === "KARTLEGGES" || iaSakStatus === "VI_BISTÅR") &&
            brukerErEierAvSak
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
            !brukerErEierAvSak
        ) {
            return (
                <>
                    Du må være eier av saken for å opprette og administrere{" "}
                    samarbeid.
                </>
            );
        }
    };

    return (
        <OpprettSamarbeidKnapp>
            {visOpprettSamarbeidKnapp ? (
                <Button
                    icon={<PlusIcon fontSize={"1.5rem"} />}
                    variant="primary"
                    onClick={() => setÅpen(true)}
                    size={"small"}
                    title={"Opprett samarbeid"}
                >
                    Opprett Samarbeid
                </Button>
            ) : (
                <BodyShort>{kravTilOppretteSamarbeid()}</BodyShort>
            )}
        </OpprettSamarbeidKnapp>
    );
};
