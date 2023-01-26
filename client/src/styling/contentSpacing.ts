import { css } from "styled-components";
import { desktopAndUp, largeDesktopAndUp } from "./breakpoint";

export const contentSpacing =  {
    mobileX: '8px',
    mobileY: `${24/16}rem`,
    desktopX: '5rem',
    largeDesktopX: '10rem',
}

export const strekkBakgrunnenHeltUtTilKantenAvSida = css`
  // Gjer at eit element dekkjer heile breidda av skjermen
  margin-left: -${contentSpacing.mobileX};
  margin-right: -${contentSpacing.mobileX};
  padding-left: ${contentSpacing.mobileX};
  padding-right: ${contentSpacing.mobileX};

  ${desktopAndUp} {
    margin-left: -${contentSpacing.desktopX};
    margin-right: -${contentSpacing.desktopX};
    padding-left: ${contentSpacing.desktopX};
    padding-right: ${contentSpacing.desktopX};
  }

  ${largeDesktopAndUp} {
    margin-left: -${contentSpacing.largeDesktopX};
    margin-right: -${contentSpacing.largeDesktopX};
    padding-left: ${contentSpacing.largeDesktopX};
    padding-right: ${contentSpacing.largeDesktopX};
  }
`
