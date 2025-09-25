import { Button, ButtonProps } from "@navikt/ds-react";
import { PlusIcon } from "@navikt/aksel-icons";
import React from "react";

export default function OpprettNySpørreundersøkelseKnapp({ style = {}, ...remainingProps }: Omit<ButtonProps, "variant" | "icon">) {
    return (
        <Button
            {...remainingProps}
            variant={"primary"}
            style={{ marginTop: "1rem", minWidth: "10.5rem", ...style }}
            icon={
                <PlusIcon fontSize="1.5rem" aria-hidden />
            }
        >
            Opprett ny
        </Button>
    );
}
