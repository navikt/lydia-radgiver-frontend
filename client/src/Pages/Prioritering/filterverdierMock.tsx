import { Filterverdier } from "../../domenetyper";

export const filterverdierMock: Filterverdier = {
    fylker: [
        {
            fylke: {
                nummer: "34",
                navn: "Innlandet",
            },
            kommuner: [
                {
                    navn: "Nord-Aurdal",
                    nummer: "3451"
                },
                {
                    navn: "Vestre Slidre",
                    nummer: "3452"
                },
                {
                    navn: "Øystre Slidre",
                    nummer: "3453"
                },
            ],
        },
        {
            fylke: {
                nummer: "03",
                navn: "Oslo",
            },
            kommuner: [
                {
                    navn: "Oslo",
                    nummer: "0301"
                },
            ],
        },
    ],
    næringsgrupper: [
        {
            kode : "01",
            navn : "A - Jordbruk og tjenester tilknyttet jordbruk, jakt og viltstell",
        },
        {
            kode : "02",
            navn: "B - Skogbruk og tjenester tilknyttet skogbruk"
        }
    ]
}