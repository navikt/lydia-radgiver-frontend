const dateFormat = new Intl.DateTimeFormat("nb-NO", {
    dateStyle: "full",
    timeStyle: "medium",
});

export const dato = (input: Date) => dateFormat.format(new Date(input));
