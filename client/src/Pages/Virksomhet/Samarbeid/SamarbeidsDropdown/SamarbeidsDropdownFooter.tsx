import { BodyShort, Button } from "@navikt/ds-react";
import React from "react";
import { IAProsessStatusType } from "../../../../domenetyper/domenetyper";
import { PlusIcon } from "@navikt/aksel-icons";
import { useErPåAktivSak } from "../../VirksomhetContext";

import styles from "./samarbeidsdropdown.module.scss";
import { useHentBrukerinformasjon } from "../../../../api/lydia-api/bruker";

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
    const { data: brukerInformasjon } = useHentBrukerinformasjon();
    const erLesebruker = brukerInformasjon?.rolle === "Lesetilgang";

    const erPåAktivSak = useErPåAktivSak();
    if (!erPåAktivSak || erLesebruker) {
        return null;
    }



    return visOpprettSamarbeidKnapp ? (
        <>
            <Button
                className={styles.opprettSamarbeidKnapp}
                icon={<PlusIcon fontSize={"1.5rem"} />}
                variant="primary"
                onClick={() => setÅpen(true)}
                size={"small"}
                title={"Opprett samarbeid"}
            >
                Opprett samarbeid
            </Button>
        </>
    ) : (
        <KravTilOppretteSamarbeid
            iaSakStatus={iaSakStatus}
            kanEndreSamarbeid={kanEndreSamarbeid}
        />
    );
};

function KravTilOppretteSamarbeid({ iaSakStatus, kanEndreSamarbeid }: { iaSakStatus?: IAProsessStatusType, kanEndreSamarbeid: boolean }) {
    if (iaSakStatus === undefined || iaSakStatus === "IKKE_AKTIV") {
        return (
            <BodyShort className={styles.actionMenuBegrunnelse}>
                Du kan opprette og administrere samarbeid når saken er i{" "}
                status <i>Kartlegges</i> eller <i>Vi bistår</i>.
            </BodyShort>
        );
    }
    if (
        !(iaSakStatus === "KARTLEGGES" || iaSakStatus === "VI_BISTÅR") &&
        !kanEndreSamarbeid
    ) {
        return (
            <BodyShort className={styles.actionMenuBegrunnelse}>
                Status må være i <i>Kartlegges</i> eller <i>Vi bistår</i> og{" "}
                du må være eier eller følger av saken for å opprette og
                administrere samarbeid.
            </BodyShort>
        );
    }

    if (
        !(iaSakStatus === "KARTLEGGES" || iaSakStatus === "VI_BISTÅR") &&
        kanEndreSamarbeid
    ) {
        return (
            <BodyShort className={styles.actionMenuBegrunnelse}>
                Status må være i <i>Kartlegges</i> eller <i>Vi bistår</i>{" "}
                for å opprette og administrere samarbeid.
            </BodyShort>
        );
    }

    if (
        (iaSakStatus === "KARTLEGGES" || iaSakStatus === "VI_BISTÅR") &&
        !kanEndreSamarbeid
    ) {
        return (
            <BodyShort className={styles.actionMenuBegrunnelse}>
                Du må være eier eller følger av saken for å opprette og
                administrere samarbeid.
            </BodyShort>
        );
    }
};