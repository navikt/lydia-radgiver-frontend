const dateFormatDatoTid = new Intl.DateTimeFormat("nb-NO", {
    dateStyle: "full",
    timeStyle: "medium",
});

const dateFormatDato = new Intl.DateTimeFormat("nb-NO", {
    dateStyle: "short",
});

const ANTALL_MILLISEKUNDER_I_EN_DAG = 1000 * 3600 * 24

export const lokalDatoMedTid = (input: Date) => dateFormatDatoTid.format(new Date(input));

export const lokalDato = (input: Date) => dateFormatDato.format(new Date(input));

export const antallDagerMellomDatoer = (d1: Date = new Date(), d2: Date = new Date()) => {
    const diffIMillisekunder = d1.getTime() - d2.getTime()
    return Math.abs(diffIMillisekunder / (ANTALL_MILLISEKUNDER_I_EN_DAG))
}