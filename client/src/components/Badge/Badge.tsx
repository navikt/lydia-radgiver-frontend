import React from "react";
import styled from "styled-components";
import { Detail } from "@navikt/ds-react";
import { FiaFarger, NavFarger } from "../../styling/farger";

const StyledDetail = styled(Detail)<{ backgroundColor: string }>`
  display: flex;
  justify-content: center;
  align-items: center;
  white-space: nowrap;
  
  padding: 0 1rem;
  height: fit-content;

  background-color: ${props => props.backgroundColor};
  color: ${NavFarger.text};
  border: 1px solid ${FiaFarger.grå};
  border-radius: 4px;
`;

interface BadgeProps {
    text: string;
    backgroundColor: FiaFarger;
    className?: string;
}

export const Badge = ({
    text,
    backgroundColor,
    className,
}: BadgeProps) => {
    return (
        <StyledDetail
            as={"span"}
            backgroundColor={backgroundColor}
            className={`navds-tag--medium ${className}`}
        >
            {text}
        </StyledDetail>
    );
};
