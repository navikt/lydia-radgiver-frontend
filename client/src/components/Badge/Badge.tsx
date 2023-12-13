import React from "react";
import styled from "styled-components";
import { Tag } from "@navikt/ds-react";
import { FiaFarger } from "../../styling/farger";

const StyledTag = styled(Tag).attrs({ size: "small" }) <{ $backgroundColor: string }>`
  background-color: ${props => props.$backgroundColor};
  min-width: 6em;
  width: fit-content;
`;

interface BadgeProps {
    backgroundColor: FiaFarger;
    children: string;
    className?: string;
    ariaLive?: "off" | "polite" | "assertive";
    ariaLabel?: string;
}

export const Badge = ({ backgroundColor, children, className, ariaLive, ariaLabel }: BadgeProps) => (
    <StyledTag $backgroundColor={backgroundColor} className={className} variant="neutral" aria-label={ariaLabel} aria-live={ariaLive}>
        {children}
    </StyledTag>
);
