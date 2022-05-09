import React from "react";
import {BodyShort} from "@navikt/ds-react/src";


export enum Farge {
    hvit = "#FFFFFF",
    lyseBlå = "#D8F9FF",
    mørkeBlå = "#CCE1FF",
    rød = "#EFA89D",
    grå = "#C9C9C9",
    svart = "#000000",
    mørkeGrå = "#A0A0A0"
}

interface BadgeProps {
    text: string;
    backgroundColor: Farge;
    textColor?: Farge;
    styleAs?: "div" | "span";
}

export const Badge = ({
    text,
    backgroundColor,
    textColor = Farge.svart,
    styleAs = "span"
}: BadgeProps) => {
    return (
        <BodyShort
            as={styleAs}
            style={{
                backgroundColor: backgroundColor,
                color: textColor,
                padding: "0 1rem",
                border: `1px solid ${Farge.grå}`,
                borderRadius: "4px",
                textAlign: "center",
                whiteSpace: "nowrap",
            }}
            className={`navds-tag--medium`}
        >
            {text}
        </BodyShort>
    );
};
