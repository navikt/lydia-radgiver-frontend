import { Button, ButtonProps, Tooltip } from "@navikt/ds-react";
import { PlusIcon } from "@navikt/aksel-icons";
import React from "react";
import { SpørreundersøkelseType } from "../../domenetyper/spørreundersøkelseMedInnhold";
import { FormatertSpørreundersøkelseType } from "./Spørreundersøkelseliste/utils";

export default function OpprettNySpørreundersøkelseKnapp({ style = {}, type, disabledTooltipTekst, ...remainingProps }: { type?: SpørreundersøkelseType, disabledTooltipTekst?: string } & Omit<ButtonProps, "variant" | "icon" | "type">) {
    if (disabledTooltipTekst && remainingProps.disabled) {
        return (
            <Tooltip content={disabledTooltipTekst}>
                <span style={{ marginTop: "1rem", marginRight: "1rem", ...style }}>
                    <OpprettNySpørreundersøkelseKnapp
                        {...remainingProps}
                        style={{ marginTop: 0, marginRight: 0, ...style }}
                        type={type}
                    />
                </span>
            </Tooltip>
        );
    }
    return (
        <Button
            {...remainingProps}
            variant={"primary"}
            style={{ marginTop: "1rem", minWidth: "10.5rem", marginRight: "1rem", ...style }}
            icon={
                <PlusIcon fontSize="1.5rem" aria-hidden />
            }
        >
            {
                type ? <>Ny <FormatertSpørreundersøkelseType type={type} storForbokstav={false} /></> : "Opprett ny"
            }
        </Button>
    );
}
