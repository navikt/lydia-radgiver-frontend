import { ChevronDownIcon, CircleSlashIcon } from "@navikt/aksel-icons";
import { BodyShort, Button, HStack } from "@navikt/ds-react";
import React, { useState } from "react";
import { IASak } from "@/domenetyper/domenetyper";
import TeamDropdown from "@/Pages/MineSaker/TeamDropdown";

export function EierskapKnapp({ iaSak }: { iaSak?: IASak }) {
    const [isModalOpen, setIsModalOpen] = useState(false);

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
