const dateFormat = new Intl.DateTimeFormat("nb-NO", {
    dateStyle: "full",
    timeStyle: "medium",
});

export const dato = (input: string | Date) =>
    dateFormat.format(new Date(input));
