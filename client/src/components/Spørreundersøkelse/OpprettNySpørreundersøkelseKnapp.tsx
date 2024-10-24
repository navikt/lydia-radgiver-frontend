import { Button, HStack } from "@navikt/ds-react";
import { PlusIcon } from "@navikt/aksel-icons";
import React from "react";

export default function OpprettNySpørreundersøkelseKnapp({
    onClick, disabled,
}: {
    onClick: () => void;
    disabled: boolean;
}) {
    return (
        <Button
            onClick={onClick}
            variant={"primary"}
            style={{ margin: "1rem", minWidth: "10.5rem" }}
            disabled={disabled}
        >
            <HStack align={"center"} gap={"2"}>
                <PlusIcon fontSize="1.5rem" />
                Opprett ny
            </HStack>
        </Button>
    );
}
