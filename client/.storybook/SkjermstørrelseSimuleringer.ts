import styled, { css } from "styled-components";
import { Breakpoint } from "../src/styling/breakpoint";
import { NavFarger } from "../src/styling/farger";
import { Skygger } from "../src/styling/skygger";
import { contentSpacing } from "../src/styling/contentSpacing";

const boksUtenOverflow = css`
  background: ${NavFarger.white};
  box-shadow: ${Skygger.medium};

  overflow: hidden; // Fordi det skal gjere vondt om ein får overflow på komponentane.
`;

export const SimulerTabletWrapper = styled.div`
  width: ${Breakpoint.Tablet}px;
  height: 800px;
  padding: ${contentSpacing.mobileX};

  ${boksUtenOverflow}
`;

export const SimulerMobilWrapper = styled.div`
  width: ${Breakpoint.Mobile}px;
  height: 800px;
  padding: ${contentSpacing.mobileX};

  ${boksUtenOverflow}
`;
