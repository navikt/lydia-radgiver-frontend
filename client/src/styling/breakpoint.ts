export enum Breakpoint {
    // Inspirert av https://nav-it.slack.com/archives/C7NE7A8UF/p1675946446260179?thread_ts=1675944823.993269&cid=C7NE7A8UF
    Mobile = "30rem",
    Tablet = "48rem",
    Desktop = "64rem",
    // MediumDesktop = "80rem",
    LargeDesktop = "120rem",
}

export const tabletAndUp = `@media (min-width: ${Breakpoint.Tablet})`
export const desktopAndUp = `@media (min-width: ${Breakpoint.Desktop})`
export const largeDesktopAndUp = `@media (min-width: ${Breakpoint.LargeDesktop})`
    