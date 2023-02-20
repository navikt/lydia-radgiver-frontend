import styled, { css } from "styled-components";
import { Breakpoint } from "../src/styling/breakpoint";
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
  width: ${Breakpoint.Tablet};
  height: 800px;
  padding: ${contentSpacing.mobileX};

  ${boksUtenOverflow}
`;

export const SimulerMobilWrapper = styled.div`
  width: ${Breakpoint.Mobile};
  height: 800px;
  padding: ${contentSpacing.mobileX};

  ${boksUtenOverflow}
`;
