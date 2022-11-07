import React from "react";
import styled from "styled-components";
import { Detail } from "@navikt/ds-react";
import { FiaFarger, NavFarger } from "../../styling/farger";

const StyledDetail = styled(Detail)<{ backgroundColor: string }>`
  flex-shrink: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  white-space: nowrap;

  min-width: 8em;
  width: fit-content;
  height: fit-content;
  padding: 0 1rem;

  background-color: ${props => props.backgroundColor};
  color: ${NavFarger.text};
  border: 1px solid ${FiaFarger.grå};
  border-radius: 4px;
`;

interface BadgeProps {
    backgroundColor: FiaFarger;
    children: string;
    className?: string;
}

export const Badge = ({backgroundColor, children, className}: BadgeProps) =>
    <StyledDetail as={"span"} backgroundColor={backgroundColor} className={`navds-tag--medium ${className}`}>
        {children}
    </StyledDetail>;
