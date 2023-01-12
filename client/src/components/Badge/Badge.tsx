import React from "react";
import styled from "styled-components";
import { Tag } from "@navikt/ds-react";
import { FiaFarger } from "../../styling/farger";

const StyledTag = styled(Tag).attrs({variant: "neutral", size: "small"})<{ backgroundColor: string }>`
  background-color: ${props => props.backgroundColor};
  min-width: 6em;
  width: fit-content;
`;

interface BadgeProps {
    backgroundColor: FiaFarger;
    children: string;
    className?: string;
}

export const Badge = ({backgroundColor, children, className}: BadgeProps) => (
    <StyledTag backgroundColor={backgroundColor} className={className}>
        {children}
    </StyledTag>
);
