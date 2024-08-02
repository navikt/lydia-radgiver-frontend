import { PlanRessurs } from "../../../domenetyper/plan";
import { Button, TextField } from "@navikt/ds-react";
import { TrashIcon } from "@navikt/aksel-icons";
import React from "react";
import styled from "styled-components";

const SlettKnapp = styled(Button)`
    padding: 0;

    span {
        display: flex;
        align-items: center;
        justify-content: center;
        color: var(--a-text-default);
    }
`;

export function Verktøyrad({
    verktøy,
    setVerktøy,
    slettVerktøy,
}: {
    verktøy: PlanRessurs;
    setVerktøy: (t: PlanRessurs) => void;
    slettVerktøy?: () => void;
}) {
    return (
        <>
            <TextField
                size="small"
                label="Beskrivelse"
                hideLabel
                value={verktøy.beskrivelse}
                onChange={(evt) =>
                    setVerktøy({ ...verktøy, beskrivelse: evt.target.value })
                }
            />
            <TextField
                size="small"
                label="Lenke"
                hideLabel
                value={verktøy.beskrivelse}
                onChange={(evt) =>
                    setVerktøy({ ...verktøy, url: evt.target.value })
                }
            />
            {slettVerktøy ? (
                <SlettKnapp variant="tertiary" onClick={slettVerktøy}>
                    <TrashIcon
                        title={`Slett ${verktøy.beskrivelse}`}
                        fontSize="2rem"
                    />
                </SlettKnapp>
            ) : (
                <span />
            )}
        </>
    );
}
