import React from "react";
import styled from "styled-components";
import { Detail } from "@navikt/ds-react";
import { FiaFarger, NavFarger } from "../../styling/farger";
import { BorderRadius } from "../../styling/borderRadius";

const StyledDetail = styled(Detail)<{ backgroundColor: string }>`
  flex-shrink: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  white-space: nowrap;

  min-width: 7em;
  width: fit-content;
  height: fit-content;
  padding: 0 1rem;

  background-color: ${props => props.backgroundColor};
  color: ${NavFarger.text};
  border: 1px solid ${FiaFarger.grå};
  border-radius: ${BorderRadius.medium};

  font-size: var(--navds-font-size-medium);
  font-weight: normal;
`;

interface BadgeProps {
    backgroundColor: FiaFarger;
    children: string;
    className?: string;
}

export const Badge = ({backgroundColor, children, className}: BadgeProps) => (
    <StyledDetail as={"span"} backgroundColor={backgroundColor} className={className}>
        {children}
    </StyledDetail>
);
