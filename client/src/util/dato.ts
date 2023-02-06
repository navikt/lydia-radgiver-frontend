const dateFormatDato = new Intl.DateTimeFormat("nb-NO", {
    dateStyle: "short",
});

export const lokalDato = (input: Date) => dateFormatDato.format(new Date(input));

export const isoDato = (dato: Date) =>
    new Intl.DateTimeFormat("en-CA", { dateStyle: "short" }).format(dato);
