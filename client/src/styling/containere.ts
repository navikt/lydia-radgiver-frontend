import { css } from "styled-components";
import { NavFarger } from "./farger";
import { Skygger } from "./skygger";
import { BorderRadius } from "./borderRadius";

export const hvitBoksMedSkygge = css`
  background-color: ${NavFarger.white};
  box-shadow: ${Skygger.small};
  border-radius: ${BorderRadius.medium};
`

export const tabInnholdStyling = css`
  padding: 0.75rem 1.5rem 1.5rem;
  background: ${NavFarger.white};
  border-radius: ${BorderRadius.medium};
  box-shadow: ${Skygger.small};
`;
