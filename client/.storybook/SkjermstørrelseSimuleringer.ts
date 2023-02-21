import styled, { css } from "styled-components";
import { Breakpoints } from "../src/styling/breakpoints";
import { NavFarger } from "../src/styling/farger";
import { Skygger } from "../src/styling/skygger";
import { contentSpacing } from "../src/styling/contentSpacing";

const boksUtenOverflow = css`
  background: ${NavFarger.white};
  box-shadow: ${Skygger.medium};

  overflow-x: hidden; // Fordi det skal gjere vondt om ein får overflow på komponentane.
  overflow-y: auto;
`;

export const SimulerTabletWrapper = styled.div`
  width: ${Breakpoints.Tablet};
  height: 800px;
  padding: ${contentSpacing.mobileX};

  ${boksUtenOverflow}
`;

export const SimulerMobilWrapper = styled.div`
  width: ${Breakpoints.Mobile};
  height: 800px;
  padding: ${contentSpacing.mobileX};

  ${boksUtenOverflow}
`;
