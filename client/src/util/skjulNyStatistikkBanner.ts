export const skjulNyStatistikkBanner = (idag: Date, publiseringsdato: Date) => {
    const ANTALL_DAGER_FØR_PUBLISERING_HVOR_BANNER_SKAL_VISES = 4;
    const ANTALL_DAGER_ETTER_PUBLISERING_HVOR_BANNER_SKAL_VISES = 7;
    const ETT_DØGN_I_MILLISEKUND = 1000 * 60 * 60 * 24;
    const erDetForTidlig = idag.getTime() <= publiseringsdato.getTime()
        - (ANTALL_DAGER_FØR_PUBLISERING_HVOR_BANNER_SKAL_VISES * ETT_DØGN_I_MILLISEKUND);
    const erDetForSent = idag.getTime() >= publiseringsdato.getTime()
        + (ANTALL_DAGER_ETTER_PUBLISERING_HVOR_BANNER_SKAL_VISES * ETT_DØGN_I_MILLISEKUND);

    return erDetForTidlig || erDetForSent;
}
