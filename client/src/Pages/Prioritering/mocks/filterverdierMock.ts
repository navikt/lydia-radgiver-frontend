import { Eier, Filterverdier, IAProsessStatusEnum } from "../../../domenetyper/domenetyper";

export const EIERE_MOCKS: Eier[] = [
    {
        navn: "Donald Duck",
        navIdent: "A12345"
    },
    {
        navn: "Fetter Anton",
        navIdent: "B12345"
    },
    {
        navn: "Onkel Skrue",
        navIdent: "C12345"
    },
    {
        navn: "Klara Ku",
        navIdent: "D12345"
    },
    {
        navn: "Dolly Duck",
        navIdent: "E12345"
    },
    {
        navn: "Langbein",
        navIdent: "F12345"
    },
    {
        navn: "Mikke Mus",
        navIdent: "G12345"
    },
    {
        navn: "Albus Parsifal Ulfrik Brian Humlesnurr",
        navIdent: "H12345"
    },
    {
        navn: "Pippilotta Viktualia Rullgardina Krusmynte Efraimsdatter Langstrømpe",
        navIdent: "I12345"
    },
    {
        navn: "Jo Å",
        navIdent: "J12345"
    },
]

export const filterverdierMock: Filterverdier = {
    sektorer: [
        {
            kode: "1",
            beskrivelse: "Kommunal forvaltning"
        },
        {
            kode: "2",
            beskrivelse: "Statlig forvaltning"
        },
        {
            kode: "3",
            beskrivelse: "Privat og offentlig næringsvirksomhet"
        }
    ],
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
                navn: "Nordland",
                nummer: "18"
            },
            kommuner: [
                {
                    navn: "Bodø",
                    nummer: "1804"
                },
                {
                    navn: "Narvik",
                    nummer: "1806"
                },
                {
                    navn: "Bindal",
                    nummer: "1811"
                },
                {
                    navn: "Sømna",
                    nummer: "1812"
                },
                {
                    navn: "Brønnøy",
                    nummer: "1813"
                },
                {
                    navn: "Vega",
                    nummer: "1815"
                },
                {
                    navn: "Vevelstad",
                    nummer: "1816"
                },
                {
                    navn: "Herøy",
                    nummer: "1818"
                },
                {
                    navn: "Alstahaug",
                    nummer: "1820"
                },
                {
                    navn: "Leirfjord",
                    nummer: "1822"
                },
                {
                    navn: "Vefsn",
                    nummer: "1824"
                },
                {
                    navn: "Grane",
                    nummer: "1825"
                },
                {
                    navn: "Aarborte",
                    nummer: "1826"
                },
                {
                    navn: "Dønna",
                    nummer: "1827"
                },
                {
                    navn: "Nesna",
                    nummer: "1828"
                },
                {
                    navn: "Hemnes",
                    nummer: "1832"
                },
                {
                    navn: "Rana",
                    nummer: "1833"
                },
                {
                    navn: "Lurøy",
                    nummer: "1834"
                },
                {
                    navn: "Træna",
                    nummer: "1835"
                },
                {
                    navn: "Rødøy",
                    nummer: "1836"
                },
                {
                    navn: "Meløy",
                    nummer: "1837"
                },
                {
                    navn: "Gildeskål",
                    nummer: "1838"
                },
                {
                    navn: "Beiarn",
                    nummer: "1839"
                },
                {
                    navn: "Saltdal",
                    nummer: "1840"
                },
                {
                    navn: "Fauske",
                    nummer: "1841"
                },
                {
                    navn: "Sørfold",
                    nummer: "1845"
                },
                {
                    navn: "Steigen",
                    nummer: "1848"
                },
                {
                    navn: "Lødingen",
                    nummer: "1851"
                },
                {
                    navn: "Evenes",
                    nummer: "1853"
                },
                {
                    navn: "Røst",
                    nummer: "1856"
                },
                {
                    navn: "Værøy",
                    nummer: "1857"
                },
                {
                    navn: "Flakstad",
                    nummer: "1859"
                },
                {
                    navn: "Vestvågøy",
                    nummer: "1860"
                },
                {
                    navn: "Vågan",
                    nummer: "1865"
                },
                {
                    navn: "Hadsel",
                    nummer: "1866"
                },
                {
                    navn: "Bø",
                    nummer: "1867"
                },
                {
                    navn: "Øksnes",
                    nummer: "1868"
                },
                {
                    navn: "Sortland",
                    nummer: "1870"
                },
                {
                    navn: "Andøy",
                    nummer: "1871"
                },
                {
                    navn: "Moskenes",
                    nummer: "1874"
                },
                {
                    navn: "Hábmer",
                    nummer: "1875"
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
                    nummer: "3025",
                    navn: "Asker",
                },
                {
                    nummer: "3024",
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
                    nummer: "3026",
                    navn: "Aurskog-Høland",
                },
                {
                    nummer: "3036",
                    navn: "Nannestad",
                },
            ],
        },
    ],
    statuser: [
        IAProsessStatusEnum.enum.IKKE_AKTIV,
        IAProsessStatusEnum.enum.VURDERES,
        IAProsessStatusEnum.enum.KONTAKTES,
        IAProsessStatusEnum.enum.KARTLEGGES,
        IAProsessStatusEnum.enum.VI_BISTÅR,
        IAProsessStatusEnum.enum.IKKE_AKTUELL,
        IAProsessStatusEnum.enum.FULLFØRT,
    ],
    neringsgrupper: [
        {
            kode: "02",
            navn: "Skogbruk og tjenester tilknyttet skogbruk",
        },
        {
            kode: "99",
            navn: "Internasjonale organisasjoner og organer",
        },
        {
            kode: "01",
            navn: "Jordbruk og tjenester tilknyttet jordbruk, jakt og viltstell",
        },
    ],
    filtrerbareEiere: EIERE_MOCKS,
    sorteringsnokler: [
        "tapte_dagsverk",
        "mulige_dagsverk",
        "antall_personer",
        "sykefraversprosent",
        "navn"
    ],
    bransjeprogram: [
        "BARNEHAGER",
        "NÆRINGSMIDDELINDUSTRI",
        "SYKEHUS",
        "SYKEHJEM",
        "TRANSPORT",
        "BYGG",
        "ANLEGG"
    ]
};
