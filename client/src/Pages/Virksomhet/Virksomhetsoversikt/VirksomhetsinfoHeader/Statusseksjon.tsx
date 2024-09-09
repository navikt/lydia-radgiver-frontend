import {
    IAProsessStatusEnum,
    IAProsessStatusType,
    IASak,
    IASakshendelseTypeEnum,
} from "../../../../domenetyper/domenetyper";
import React from "react";
import { Button, HStack } from "@navikt/ds-react";
import { NyttStatusBadge } from "../../../../components/Badge/StatusBadge";
import { NotePencilIcon } from "@navikt/aksel-icons";
import EndreStatusModal from "../IASakStatus/EndreStatusModal/EndreStatusModal";

export function Statusseksjon({
    iaSak,
    setVisKonfetti,
}: {
    iaSak: IASak;
    setVisKonfetti?: (visKonfetti: boolean) => void;
}) {
    function kanEndreProsess(
        status: IAProsessStatusType,
        eidAv: string | null,
    ) {
        return status !== IAProsessStatusEnum.Enum.VURDERES || eidAv !== null;
    }

    const [open, setOpen] = React.useState(false);
    const { status, eidAv } = iaSak;
    const hendelserSomRepresentererKnapperISaksboksen =
        iaSak.gyldigeNesteHendelser.filter(
            (hendelse) =>
                hendelse.saksHendelsestype !==
                    IASakshendelseTypeEnum.Enum.ENDRE_PROSESS &&
                hendelse.saksHendelsestype !==
                    IASakshendelseTypeEnum.Enum.NY_PROSESS,
        );

    return (
        <>
            <HStack gap="1" align="center" justify="end">
                <NyttStatusBadge status={status} />
                {kanEndreProsess(status, eidAv) && (
                    <Button
                        size="xsmall"
                        variant="tertiary-neutral"
                        onClick={() => setOpen(true)}
                    >
                        <NotePencilIcon fontSize="1.5rem" />
                    </Button>
                )}
            </HStack>
            <EndreStatusModal
                sak={iaSak}
                hendelser={hendelserSomRepresentererKnapperISaksboksen}
                setVisKonfetti={setVisKonfetti}
                open={open}
                setOpen={setOpen}
            />
        </>
    );
}
