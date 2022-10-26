import React from "react";
import styled, { css } from "styled-components";
import { BodyShort, Detail } from "@navikt/ds-react";
import { FiaFarger } from "../../styling/farger";

const badgeStyling = css<{ backgroundColor: string, textColor: string }>`
  background-color: ${props => props.backgroundColor};
  color: ${props => props.textColor};
  padding: 0 1rem;
  border: 1px solid ${FiaFarger.grå};
  border-radius: 4px;
  text-align: center;
  white-space: nowrap;
  display: flex;
  justify-content: center;
  align-items: center;
  height: fit-content;
`;

const StyledDetail = styled(Detail)<{ backgroundColor: string, textColor: string }>`
  ${badgeStyling}
`;

const StyledBodyShort = styled(BodyShort)<{ backgroundColor: string, textColor: string }>`
  ${badgeStyling}
`;

interface BadgeProps {
    text: string;
    backgroundColor: FiaFarger;
    textColor?: FiaFarger;
    size?: "small" | "medium";
    className?: string;
}

export const Badge = ({
    text,
    backgroundColor,
    textColor = FiaFarger.svart,
    size = "small",
    className,
}: BadgeProps) => {
    const TextComponent = size === "small" ? StyledDetail : StyledBodyShort

    return (
        <TextComponent
            as={"span"}
            backgroundColor={backgroundColor}
            textColor={textColor}
            className={`navds-tag--medium ${className}`}
        >
            {text}
        </TextComponent>
    );
};
