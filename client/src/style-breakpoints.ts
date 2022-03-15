/*
    Breakpoints for media queries
    Phones are considered to be less than 600px
*/

export enum breakpoints {
    smallestDesktop = 1440,
    largestLaptop = 1439,
    smallestLaptop = 1240,
    largestTablet = 1239,
    smallestTablet = 600,
    largestPhone = 599,
}

export const forLessThan = (breakpoint: number) =>
    `@media (max-width: ${breakpoint - 1}px)`;

export const forLargerThan = (breakpoint: number) =>
    `@media (min-width: ${breakpoint}px)`;

export const forBetween = (lowBreakpoint: number, highBreakpoint: number) =>
    `@media (min-width: ${lowBreakpoint}px) and (max-width: ${highBreakpoint}px)`;
