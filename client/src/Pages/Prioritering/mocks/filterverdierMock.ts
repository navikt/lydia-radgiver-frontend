import { Filterverdier, IAProsessStatusEnum } from "../../../domenetyper";

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
                    nummer: "3451",
                },
                {
                    navn: "Vestre Slidre",
                    nummer: "3452",
                },
                {
                    navn: "Øystre Slidre",
                    nummer: "3453",
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
                    nummer: "0301",
                },
            ],
        },
        {
            fylke: {
                nummer: "V30",
                navn: "Vest-Viken",
            },
            kommuner: [
                {
                    nummer: "V3025",
                    navn: "Asker",
                },
                {
                    nummer: "V3024",
                    navn: "Bærum",
                },
            ],
        },
        {
            fylke: {
                nummer: "Ø30",
                navn: "Øst-Viken",
            },
            kommuner: [
                {
                    nummer: "Ø3026",
                    navn: "Aurskog-Høland",
                },
                {
                    nummer: "Ø3036",
                    navn: "Nannestad",
                },
            ],
        },
    ],
    statuser: [
        IAProsessStatusEnum.enum.IKKE_AKTIV,
        IAProsessStatusEnum.enum.VURDERES,
        IAProsessStatusEnum.enum.KONTAKTES,
        IAProsessStatusEnum.enum.IKKE_AKTUELL,
    ],
    neringsgrupper: [
        {
            kode: "01",
            navn: "A - Jordbruk og tjenester tilknyttet jordbruk, jakt og viltstell",
        },
        {
            kode: "02",
            navn: "B - Skogbruk og tjenester tilknyttet skogbruk",
        },
    ],
    sorteringsnokler: ["tapte_dagsverk", "sykefraversprosent"],
};
