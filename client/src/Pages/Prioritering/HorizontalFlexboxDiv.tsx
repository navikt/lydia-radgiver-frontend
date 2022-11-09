import styled from "styled-components";
import { tabletAndUp } from "../../styling/breakpoint";

export const HorizontalFlexboxDivGap3RemAlignItemsEnd = styled.div`
  display: flex;
  column-gap: 3rem;
  row-gap: ${24/16}rem;
  flex-direction: column;
  flex-wrap: wrap;

  ${tabletAndUp} {
    flex-direction: row;
    align-items: end;
  }
`;
