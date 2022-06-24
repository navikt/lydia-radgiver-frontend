const dateFormat = new Intl.DateTimeFormat("nb-NO", {
    dateStyle: "full",
    timeStyle: "medium",
});

export const lokalDato = (input: Date) => dateFormat.format(new Date(input));
