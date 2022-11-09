export enum Breakpoint {
    Mobile = 448,
    Tablet = 648,
    Desktop = 960,
    LargeDesktop = 1920,
}

export const tabletAndUp = `@media (min-width: ${Breakpoint.Tablet}px)`
export const desktopAndUp = `@media (min-width: ${Breakpoint.Desktop}px)`
export const largeDesktopAndUp = `@media (min-width: ${Breakpoint.LargeDesktop}px)`
