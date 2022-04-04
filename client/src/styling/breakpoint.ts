export enum Breakpoint {
    Mobile = 448,
    Tablet = 648,
    Desktop = 960,
}

export const forLargerThan = (breakpoint: Breakpoint) =>
    `@media (min-width: ${breakpoint}px)`;
