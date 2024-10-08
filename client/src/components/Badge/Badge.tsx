import React from "react";
import styled from "styled-components";
import { Tag, TagProps } from "@navikt/ds-react";
import { FiaFarger } from "../../styling/farger";

const StyledTag = styled(Tag).attrs({ size: "small" })<{
    $backgroundColor: string;
    $minWidth: string;
}>`
    background-color: ${(props) => props.$backgroundColor};
    min-width: ${(props) => props.$minWidth};
    width: fit-content;
`;

interface BadgeProps extends Partial<TagProps> {
    backgroundColor: FiaFarger;
    children: string;
    className?: string;
    ariaLive?: "off" | "polite" | "assertive";
    ariaLabel?: string;
    minWidth?: string;
}

export const Badge = ({
    backgroundColor,
    children,
    className,
    ariaLive,
    ariaLabel,
    variant = "neutral",
    minWidth = "6em",
}: BadgeProps) => (
    <StyledTag
        $backgroundColor={backgroundColor}
        className={className}
        variant={variant}
        aria-label={ariaLabel}
        aria-live={ariaLive}
        $minWidth={minWidth}
    >
        {children}
    </StyledTag>
);
