const enDesimalFormatter = new Intl.NumberFormat("nb-NO", {
    maximumFractionDigits: 1,
    style: "decimal",
});
const heltallFormatter = new Intl.NumberFormat("nb-NO", {
    maximumFractionDigits: 0,
    style: "decimal",
});

export const formaterSomHeltall = (value : number) => heltallFormatter.format(value)
export const formatterMedEnDesimal = (value : number) => enDesimalFormatter.format(value)
export const formaterSomProsentMedEnDesimal = (value : number) => `${enDesimalFormatter.format(value)}%`
