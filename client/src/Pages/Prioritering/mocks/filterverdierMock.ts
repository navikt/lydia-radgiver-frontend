import { Eier, IAProsessStatusEnum } from "../../../domenetyper/domenetyper";
import { Filterverdier } from "../../../domenetyper/filterverdier";

export const EIERE_MOCKS: Eier[] = [
    {
        navn: "Donald Duck",
        navIdent: "A12345",
    },
    {
        navn: "Fetter Anton",
        navIdent: "B12345",
    },
    {
        navn: "Onkel Skrue",
        navIdent: "C12345",
    },
    {
        navn: "Klara Ku",
        navIdent: "D12345",
    },
    {
        navn: "Dolly Duck",
        navIdent: "E12345",
    },
    {
        navn: "Langbein",
        navIdent: "F12345",
    },
    {
        navn: "Mikke Mus",
        navIdent: "G12345",
    },
    {
        navn: "Albus Parsifal Ulfrik Brian Humlesnurr",
        navIdent: "H12345",
    },
    {
        navn: "Pippilotta Viktualia Rullegardina Krusemynte Efraimsdatter Langstrømpe",
        navIdent: "I12345",
    },
    {
        navn: "Jo Å",
        navIdent: "J12345",
    },
];

export const filterverdierMock: Filterverdier = {
    sektorer: [
        {
            kode: "1",
            beskrivelse: "Kommunal forvaltning",
        },
        {
            kode: "2",
            beskrivelse: "Statlig forvaltning",
        },
        {
            kode: "3",
            beskrivelse: "Privat og offentlig næringsvirksomhet",
        },
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
                    navnNorsk: "Nord-Aurdal",
                    nummer: "3451",
                },
                {
                    navn: "Vestre Slidre",
                    navnNorsk: "Vestre Slidre",
                    nummer: "3452",
                },
                {
                    navn: "Øystre Slidre",
                    navnNorsk: "Øystre Slidre",
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
                    navnNorsk: "Oslo",
                    nummer: "0301",
                },
            ],
        },
        {
            fylke: {
                nummer: "18",
                navn: "Nordland",
            },
            kommuner: [
                {
                    navn: "Bodø",
                    navnNorsk: "Bodø",
                    nummer: "1804",
                },
                {
                    navn: "Narvik",
                    navnNorsk: "Narvik",
                    nummer: "1806",
                },
                {
                    navn: "Bindal",
                    navnNorsk: "Bindal",
                    nummer: "1811",
                },
                {
                    navn: "Sømna",
                    navnNorsk: "Sømna",
                    nummer: "1812",
                },
                {
                    navn: "Brønnøy",
                    navnNorsk: "Brønnøy",
                    nummer: "1813",
                },
                {
                    navn: "Vega",
                    navnNorsk: "Vega",
                    nummer: "1815",
                },
                {
                    navn: "Vevelstad",
                    navnNorsk: "Vevelstad",
                    nummer: "1816",
                },
                {
                    navn: "Herøy",
                    navnNorsk: "Herøy",
                    nummer: "1818",
                },
                {
                    navn: "Alstahaug",
                    navnNorsk: "Alstahaug",
                    nummer: "1820",
                },
                {
                    navn: "Leirfjord",
                    navnNorsk: "Leirfjord",
                    nummer: "1822",
                },
                {
                    navn: "Vefsn",
                    navnNorsk: "Vefsn",
                    nummer: "1824",
                },
                {
                    navn: "Grane",
                    navnNorsk: "Grane",
                    nummer: "1825",
                },
                {
                    navn: "Aarborte",
                    navnNorsk: "Aarborte",
                    nummer: "1826",
                },
                {
                    navn: "Dønna",
                    navnNorsk: "Dønna",
                    nummer: "1827",
                },
                {
                    navn: "Nesna",
                    navnNorsk: "Nesna",
                    nummer: "1828",
                },
                {
                    navn: "Hemnes",
                    navnNorsk: "Hemnes",
                    nummer: "1832",
                },
                {
                    navn: "Rana",
                    navnNorsk: "Rana",
                    nummer: "1833",
                },
                {
                    navn: "Lurøy",
                    navnNorsk: "Lurøy",
                    nummer: "1834",
                },
                {
                    navn: "Træna",
                    navnNorsk: "Træna",
                    nummer: "1835",
                },
                {
                    navn: "Rødøy",
                    navnNorsk: "Rødøy",
                    nummer: "1836",
                },
                {
                    navn: "Meløy",
                    navnNorsk: "Meløy",
                    nummer: "1837",
                },
                {
                    navn: "Gildeskål",
                    navnNorsk: "Gildeskål",
                    nummer: "1838",
                },
                {
                    navn: "Beiarn",
                    navnNorsk: "Beiarn",
                    nummer: "1839",
                },
                {
                    navn: "Saltdal",
                    navnNorsk: "Saltdal",
                    nummer: "1840",
                },
                {
                    navn: "Fauske",
                    navnNorsk: "Fauske",
                    nummer: "1841",
                },
                {
                    navn: "Sørfold",
                    navnNorsk: "Sørfold",
                    nummer: "1845",
                },
                {
                    navn: "Steigen",
                    navnNorsk: "Steigen",
                    nummer: "1848",
                },
                {
                    navn: "Lødingen",
                    navnNorsk: "Lødingen",
                    nummer: "1851",
                },
                {
                    navn: "Evenes",
                    navnNorsk: "Evenes",
                    nummer: "1853",
                },
                {
                    navn: "Røst",
                    navnNorsk: "Røst",
                    nummer: "1856",
                },
                {
                    navn: "Værøy",
                    navnNorsk: "Værøy",
                    nummer: "1857",
                },
                {
                    navn: "Flakstad",
                    navnNorsk: "Flakstad",
                    nummer: "1859",
                },
                {
                    navn: "Vestvågøy",
                    navnNorsk: "Vestvågøy",
                    nummer: "1860",
                },
                {
                    navn: "Vågan",
                    navnNorsk: "Vågan",
                    nummer: "1865",
                },
                {
                    navn: "Hadsel",
                    navnNorsk: "Hadsel",
                    nummer: "1866",
                },
                {
                    navn: "Bø",
                    navnNorsk: "Bø",
                    nummer: "1867",
                },
                {
                    navn: "Øksnes",
                    navnNorsk: "Øksnes",
                    nummer: "1868",
                },
                {
                    navn: "Sortland",
                    navnNorsk: "Sortland",
                    nummer: "1870",
                },
                {
                    navn: "Andøy",
                    navnNorsk: "Andøy",
                    nummer: "1871",
                },
                {
                    navn: "Moskenes",
                    navnNorsk: "Moskenes",
                    nummer: "1874",
                },
                {
                    navn: "Hábmer",
                    navnNorsk: "Hábmer",
                    nummer: "1875",
                },
            ],
        },
        {
            fylke: {
                nummer: "54",
                navn: "Troms og Finnmark",
            },
            kommuner: [
                {
                    navn: "Deatnu",
                    navnNorsk: "Tana",
                    nummer: "5441",
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
                    navn: "Asker",
                    navnNorsk: "Asker",
                    nummer: "3025",
                },
                {
                    navn: "Bærum",
                    navnNorsk: "Bærum",
                    nummer: "3024",
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
                    navn: "Aurskog-Høland",
                    navnNorsk: "Aurskog-Høland",
                    nummer: "3026",
                },
                {
                    navn: "Nannestad",
                    navnNorsk: "Nannestad",
                    nummer: "3036",
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
    naringsgrupper: [
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
        "navn",
        "sist_endret",
    ],
    bransjeprogram: [
        "BARNEHAGER",
        "NÆRINGSMIDDELINDUSTRI",
        "SYKEHUS",
        "SYKEHJEM",
        "TRANSPORT",
        "BYGG",
        "ANLEGG",
    ],
};
