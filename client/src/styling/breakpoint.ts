export enum Breakpoint {
    Mobile = 448,
    Tablet = 648,
    Desktop = 960,
    LargeDesktop = 1920,
}

export const forLargerThan = (breakpoint: Breakpoint) =>
    `@media (min-width: ${breakpoint}px)`;
