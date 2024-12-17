import { IASak } from "../../../domenetyper/domenetyper";
import { BodyShort, Button, HStack } from "@navikt/ds-react";
import { ChevronDownIcon, CircleSlashIcon } from "@navikt/aksel-icons";
import React, { useState } from "react";
import TeamDropdown from "../../MineSaker/TeamDropdown";

export function EierskapKnapp({ iaSak }: { iaSak?: IASak }) {
    if (iaSak === undefined) {
        return (
            <Button
                onClick={() => setIsModalOpen(true)}
                icon={<ChevronDownIcon aria-hidden />}
                iconPosition={"right"}
                variant={"tertiary"}
                size={"small"}
                disabled={true}
            >
                <HStack align={"center"} gap={"1"}>
                    <CircleSlashIcon aria-hidden />
                    <BodyShort>Ingen aktiv sak</BodyShort>
                </HStack>
            </Button>
        );
    }

    const [isModalOpen, setIsModalOpen] = useState(false);

    return (
        <>
            <TeamDropdown
                open={isModalOpen}
                setOpen={setIsModalOpen}
                iaSak={iaSak}
            />
        </>
    );
}
