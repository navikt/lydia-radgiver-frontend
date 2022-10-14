const dateFormatDatoTid = new Intl.DateTimeFormat("nb-NO", {
    dateStyle: "full",
    timeStyle: "medium",
});

const dateFormatDato = new Intl.DateTimeFormat("nb-NO", {
    dateStyle: "short",
});

export const lokalDatoMedTid = (input: Date) => dateFormatDatoTid.format(new Date(input));

export const lokalDato = (input: Date) => dateFormatDato.format(new Date(input));
