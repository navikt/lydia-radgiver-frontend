import { Button } from "@navikt/ds-react";
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
            style={{ marginTop: "1rem", minWidth: "10.5rem" }}
            disabled={disabled}
            icon={
                <PlusIcon fontSize="1.5rem" aria-hidden />
            }
        >
            Opprett ny
        </Button>
    );
}
