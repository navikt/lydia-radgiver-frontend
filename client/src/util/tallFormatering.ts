const enDesimalFormatter = new Intl.NumberFormat("nb-NO", {
    maximumFractionDigits: 1,
    style: "decimal",
});

export const formaterMedEnDesimal = (value : number) => enDesimalFormatter.format(value)
export const formaterSomProsentMedEnDesimal = (value : number) => `${enDesimalFormatter.format(value)} %`
