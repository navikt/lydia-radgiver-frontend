const integerFormatter = new Intl.NumberFormat("nb-NO", {
    maximumFractionDigits: 0,
    style: "decimal"
})

const enDesimalFormatter = new Intl.NumberFormat("nb-NO", {
    minimumFractionDigits: 1,
    maximumFractionDigits: 1,
    style: "decimal",
});

export const formaterSomHeltall = (value: number) => `${integerFormatter.format(value)}`
export const formaterMedEnDesimal = (value: number) => enDesimalFormatter.format(value)
export const formaterSomProsentMedEnDesimal = (value: number) => `${enDesimalFormatter.format(value)} %`
