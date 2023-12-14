export enum Breakpoints {
    // Inspirert av https://nav-it.slack.com/archives/C7NE7A8UF/p1675946446260179?thread_ts=1675944823.993269&cid=C7NE7A8UF
    Mobile = "30rem",           // 480px
    Tablet = "48rem",           // 768px
    Desktop = "64rem",          // 1024px
    // MediumDesktop = "80rem", // 1280px
    LargeDesktop = "120rem",    // 1920px
}

/*
* mobileAndUp treng vi stort sett berre der vi skal oppfylle WCAG 2.1 kriterie 1.4.10 om zoom på sida.
* Eit døme er der grid-"tabellar" skal gå over til å ha berre ei kolonne i staden for to.
* */
export const mobileAndUp = `@media (min-width: ${Breakpoints.Mobile})`;

export const tabletAndUp = `@media (min-width: ${Breakpoints.Tablet})`
export const desktopAndUp = `@media (min-width: ${Breakpoints.Desktop})`
export const largeDesktopAndUp = `@media (min-width: ${Breakpoints.LargeDesktop})`
    