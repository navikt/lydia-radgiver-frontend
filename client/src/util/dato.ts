const dateFormatDato = new Intl.DateTimeFormat("nb-NO", {
    dateStyle: "short",
});

export const lokalDato = (input: Date) => dateFormatDato.format(new Date(input));

export const isoDato = (dato: Date) =>
    new Intl.DateTimeFormat("en-CA", { dateStyle: "short" }).format(dato);

export const getDatoIFortidPåFørsteDagIMåned = (dato: Date, antallÅrTilbakeITid: number): Date => {
    const datoForAntallÅrTilbakeITid = new Date(dato).setFullYear(dato.getFullYear() - antallÅrTilbakeITid);
    const datoPåFørsteDagINesteMåned = new Date(datoForAntallÅrTilbakeITid);
    datoPåFørsteDagINesteMåned.setMonth(datoPåFørsteDagINesteMåned.getMonth() + 1, 1);
    return datoPåFørsteDagINesteMåned;
}

export const getDatoPåFørsteDagINesteMåned = (dato: Date): Date => {
    const datoPåFørsteDagINesteMåned = new Date(dato);
    datoPåFørsteDagINesteMåned.setMonth(datoPåFørsteDagINesteMåned.getMonth() + 1, 1);
    return datoPåFørsteDagINesteMåned;
}

export const getDatoPåSisteDagIMåned = (dato: Date): Date => {
    const år = dato.getFullYear();
    const måned = dato.getMonth();
    return new Date(år, måned + 1, 0);
}
