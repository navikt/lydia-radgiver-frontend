import { Button, ButtonProps } from "@navikt/ds-react";
import { PlusIcon } from "@navikt/aksel-icons";
import React from "react";
import { SpørreundersøkelseType } from "../../domenetyper/spørreundersøkelseMedInnhold";
import { FormatertSpørreundersøkelseType } from "./Spørreundersøkelseliste/utils";

export default function OpprettNySpørreundersøkelseKnapp({ style = {}, type, ...remainingProps }: { type?: SpørreundersøkelseType } & Omit<ButtonProps, "variant" | "icon" | "type">) {
    return (
        <Button
            {...remainingProps}
            variant={"primary"}
            style={{ marginTop: "1rem", minWidth: "10.5rem", ...style }}
            icon={
                <PlusIcon fontSize="1.5rem" aria-hidden />
            }
        >
            Opprett {type ? <FormatertSpørreundersøkelseType type={type} storForbokstav={false} /> : "ny"}
        </Button>
    );
}
