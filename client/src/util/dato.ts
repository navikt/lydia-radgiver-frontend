const dateFormatDato = new Intl.DateTimeFormat("nb-NO", {
    dateStyle: "short",
});

export const lokalDato = (input: Date) => dateFormatDato.format(new Date(input));

export const isoDato = (dato: Date) => {
    dato.setHours(12);
    return dato.toISOString().substring(0, 10);
};
