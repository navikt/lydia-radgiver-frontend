import { css } from "styled-components";
import { NavFarger } from "./farger";
import { Skygger } from "./skygger";
import { BorderRadius } from "./borderRadius";

export const hvitBoksMedSkygge = css`
  background-color: ${NavFarger.white};
  box-shadow: ${Skygger.small};
  border-radius: ${BorderRadius.medium};
`
