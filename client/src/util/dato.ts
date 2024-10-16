const dateFormatDato = new Intl.DateTimeFormat("nb-NO", {
    dateStyle: "short",
});

export const lokalDato = (input: Date) =>
    dateFormatDato.format(new Date(input));

const dateFormatDatoMedKortTekstmåned = new Intl.DateTimeFormat("nb-NO", {
    month: "short",
    day: "numeric",
    year: "2-digit",
});

export const lokalDatoMedKortTekstmåned = (input: Date) =>
    dateFormatDatoMedKortTekstmåned.format(new Date(input));

const dateFormatDatoMedKlokke = new Intl.DateTimeFormat("nb-NO", {
    dateStyle: "medium",
    timeStyle: "short",
});

export const lokalDatoMedKlokkeslett = (input: Date) =>
    dateFormatDatoMedKlokke.format(new Date(input));

export const isoDato = (dato: Date) => {
    dato.setHours(12);
    return dato.toISOString().substring(0, 10);
};

export const erSammeDato = (dato1: Date, dato2: Date): boolean => {
    return (
        dato1.getFullYear() === dato2.getFullYear() &&
        dato1.getMonth() === dato2.getMonth() &&
        dato1.getDay() === dato2.getDay()
    );
};
