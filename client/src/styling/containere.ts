import styled, { css } from "styled-components";
import { NavFarger } from "./farger";
import { Skygger } from "./skygger";
import { BorderRadius } from "./borderRadius";
import { contentSpacing } from "./contentSpacing";

export const hvitBoksMedSkygge = css`
    background-color: ${NavFarger.white};
    box-shadow: ${Skygger.small};
    border-radius: ${BorderRadius.medium};
`;

export const tabInnholdStyling = css`
    padding: 1.5rem;
    background: ${NavFarger.white};
    border-radius: ${BorderRadius.medium};
    box-shadow: ${Skygger.small};
`;

export const max75remBreddeOgSentrert = css`
    width: clamp(0px, 100%, 75rem);
    margin-left: auto;
    margin-right: auto;
`;

export const SideContainer = styled.div`
    padding: ${contentSpacing.mobileY} 0;

    ${max75remBreddeOgSentrert};
`;
