import { IASak } from "../../../domenetyper/domenetyper";
import { BodyShort, Button, HStack } from "@navikt/ds-react";
import { ChevronDownIcon, CircleSlashIcon } from "@navikt/aksel-icons";
import React, { useState } from "react";
import TeamDropdown from "../../MineSaker/TeamDropdown";
import { NavnForNavIdentProvider } from "../../../components/NavnForNavIdent";

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
                <HStack align={"center"} gap={"space-4"}>
                    <CircleSlashIcon aria-hidden />
                    <BodyShort>Ingen aktiv sak</BodyShort>
                </HStack>
            </Button>
        );
    }

    return (
        <NavnForNavIdentProvider
            oppslag="radgivere"
            saksnumre={[iaSak.saksnummer]}
        >
            <TeamDropdown
                open={isModalOpen}
                setOpen={setIsModalOpen}
                iaSak={iaSak}
            />
        </NavnForNavIdentProvider>
    );
}
