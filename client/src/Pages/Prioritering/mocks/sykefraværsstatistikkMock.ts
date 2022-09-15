import {IAProsessStatusEnum, SykefraversstatistikkVirksomhet} from "../../../domenetyper";

const sykefraværStatiskData: Pick<SykefraversstatistikkVirksomhet, 'antallPersoner' | 'muligeDagsverk' | 'tapteDagsverk' | 'sykefraversprosent'> = {
    antallPersoner: 69.4123,
    muligeDagsverk: 555.123123,
    tapteDagsverk: 222.22222,
    sykefraversprosent: 1.513
}

const sykefraværStatiskDataUtenDesimaler: Pick<SykefraversstatistikkVirksomhet, 'antallPersoner' | 'muligeDagsverk' | 'tapteDagsverk' | 'sykefraversprosent'> = {
    antallPersoner: 69,
    muligeDagsverk: 555,
    tapteDagsverk: 222,
    sykefraversprosent: 1
}

const endretDato = new Date(2022,7,22)

export const sykefraværsstatistikkMock: SykefraversstatistikkVirksomhet[] = [{
    "orgnr": "995428563",
    "virksomhetsnavn": "SUSHISHAPPA PÅ HJØRNET",
    "kommune": {"navn": "OSLO", "nummer": "0301"},
    "sektor": "",
    "neringsgruppe": "",
    "arstall": 2021,
    "kvartal": 3,
    ...sykefraværStatiskData,
    "status": IAProsessStatusEnum.enum.IKKE_AKTIV,
    "eidAv": "X123456",
    "sistEndret": null
}, {
    "orgnr": "974557746",
    "virksomhetsnavn": "MUJAFAS BMW",
    "kommune": {"navn": "BERGEN", "nummer": "4601"},
    "sektor": "",
    "neringsgruppe": "",
    "arstall": 2021,
    "kvartal": 3,
    ...sykefraværStatiskDataUtenDesimaler,
    "status": IAProsessStatusEnum.enum.IKKE_AKTUELL,
    "eidAv": null,
    "sistEndret": endretDato
}, {
    "orgnr": "974706490",
    "virksomhetsnavn": "HERMETISKE TOMATER",
    "kommune": {"navn": "LØRENSKOG", "nummer": "3029"},
    "sektor": "",
    "neringsgruppe": "",
    "arstall": 2021,
    "kvartal": 3,
    ...sykefraværStatiskData,
    "status": IAProsessStatusEnum.enum.VURDERES,
    "eidAv": "Z123456",
    "sistEndret": endretDato
}, {
    "orgnr": "974589095",
    "virksomhetsnavn": "RUNE RUDBERGS RÅNEHJØRNE",
    "kommune": {"navn": "OSLO", "nummer": "0301"},
    "sektor": "",
    "neringsgruppe": "",
    "arstall": 2021,
    "kvartal": 3,
    ...sykefraværStatiskData,
    "status": IAProsessStatusEnum.enum.KONTAKTES,
    "eidAv": null,
    "sistEndret": endretDato
}, {
    "orgnr": "973861778",
    "virksomhetsnavn": "ANANAS RINGER",
    "kommune": {"navn": "SOKKELEN SØR FOR 62 GRADER", "nummer": "2311"},
    "sektor": "",
    "neringsgruppe": "",
    "arstall": 2021,
    "kvartal": 3,
    ...sykefraværStatiskData,
    "status": IAProsessStatusEnum.enum.IKKE_AKTIV,
    "eidAv": "A123456",
    "sistEndret": null
}, {
    "orgnr": "874716782",
    "virksomhetsnavn": "PARADIS PIZZA",
    "kommune": {"navn": "OSLO", "nummer": "0301"},
    "sektor": "",
    "neringsgruppe": "",
    "arstall": 2021,
    "kvartal": 3,
    ...sykefraværStatiskDataUtenDesimaler,
    "status": IAProsessStatusEnum.enum.IKKE_AKTIV,
    "eidAv": null,
    "sistEndret": null
}, {
    "orgnr": "974749025",
    "virksomhetsnavn": "KONG OLAV DEN HELLIGE",
    "kommune": {"navn": "TRONDHEIM", "nummer": "5001"},
    "sektor": "",
    "neringsgruppe": "",
    "arstall": 2021,
    "kvartal": 3,
    ...sykefraværStatiskData,
    "status": IAProsessStatusEnum.enum.IKKE_AKTIV,
    "eidAv": null,
    "sistEndret": null
}, {
    "orgnr": "974703300",
    "virksomhetsnavn": "JALLA BEDRIFT",
    "kommune": {"navn": "STAVANGER", "nummer": "1103"},
    "sektor": "",
    "neringsgruppe": "",
    "arstall": 2021,
    "kvartal": 3,
    ...sykefraværStatiskData,
    "status": IAProsessStatusEnum.enum.IKKE_AKTIV,
    "eidAv": null,
    "sistEndret": null
}, {
    "orgnr": "974633752",
    "virksomhetsnavn": "SKATTEFENGSELET",
    "kommune": {"navn": "SARPSBORG", "nummer": "3003"},
    "sektor": "",
    "neringsgruppe": "",
    "arstall": 2021,
    "kvartal": 3,
    ...sykefraværStatiskDataUtenDesimaler,
    "status": IAProsessStatusEnum.enum.IKKE_AKTIV,
    "eidAv": null,
    "sistEndret": null
}, {
    "orgnr": "974795787",
    "virksomhetsnavn": "VIRKSOMHET AS",
    "kommune": {"navn": "TROMSØ", "nummer": "5401"},
    "sektor": "",
    "neringsgruppe": "",
    "arstall": 2021,
    "kvartal": 3,
    ...sykefraværStatiskData,
    "status": IAProsessStatusEnum.enum.IKKE_AKTIV,
    "eidAv": null,
    "sistEndret": null
}, {
    "orgnr": "985674744",
    "virksomhetsnavn": "SAMMA GAMLA VANLIGA",
    "kommune": {"navn": "OSLO", "nummer": "0301"},
    "sektor": "",
    "neringsgruppe": "",
    "arstall": 2021,
    "kvartal": 3,
    ...sykefraværStatiskDataUtenDesimaler,
    "status": IAProsessStatusEnum.enum.IKKE_AKTIV,
    "eidAv": null,
    "sistEndret": null
}, {
    "orgnr": "974631326",
    "virksomhetsnavn": "NORTHUG",
    "kommune": {"navn": "DRAMMEN", "nummer": "3005"},
    "sektor": "",
    "neringsgruppe": "",
    "arstall": 2021,
    "kvartal": 3,
    ...sykefraværStatiskData,
    "status": IAProsessStatusEnum.enum.IKKE_AKTIV,
    "eidAv": null,
    "sistEndret": null
}, {
    "orgnr": "974757486",
    "virksomhetsnavn": "VINDRUER AS",
    "kommune": {"navn": "TROMSØ", "nummer": "5401"},
    "sektor": "",
    "neringsgruppe": "",
    "arstall": 2021,
    "kvartal": 3,
    ...sykefraværStatiskData,
    "status": IAProsessStatusEnum.enum.IKKE_AKTIV,
    "eidAv": null,
    "sistEndret": null
}, {
    "orgnr": "998801389",
    "virksomhetsnavn": "BARCLAYS",
    "kommune": {"navn": "OSLO", "nummer": "0301"},
    "sektor": "",
    "neringsgruppe": "",
    "arstall": 2021,
    "kvartal": 3,
    ...sykefraværStatiskData,
    "status": IAProsessStatusEnum.enum.IKKE_AKTIV,
    "eidAv": null,
    "sistEndret": null
}, {
    "orgnr": "973851713",
    "virksomhetsnavn": "CHELSEA FC",
    "kommune": {"navn": "DRAMMEN", "nummer": "3005"},
    "sektor": "",
    "neringsgruppe": "",
    "arstall": 2021,
    "kvartal": 3,
    ...sykefraværStatiskData,
    "status": IAProsessStatusEnum.enum.IKKE_AKTIV,
    "eidAv": null,
    "sistEndret": null
}, {
    "orgnr": "974733013",
    "virksomhetsnavn": "GODSET FRA DRAMMEN",
    "kommune": {"navn": "KRISTIANSAND", "nummer": "4204"},
    "sektor": "",
    "neringsgruppe": "",
    "arstall": 2021,
    "kvartal": 3,
    ...sykefraværStatiskDataUtenDesimaler,
    "status": IAProsessStatusEnum.enum.IKKE_AKTIV,
    "eidAv": null,
    "sistEndret": null
}, {
    "orgnr": "980054756",
    "virksomhetsnavn": "STATSMINISTERENS KONTOR",
    "kommune": {"navn": "STAVANGER", "nummer": "1103"},
    "sektor": "",
    "neringsgruppe": "",
    "arstall": 2021,
    "kvartal": 3,
    ...sykefraværStatiskData,
    "status": IAProsessStatusEnum.enum.IKKE_AKTIV,
    "eidAv": null,
    "sistEndret": null
}, {
    "orgnr": "974633574",
    "virksomhetsnavn": "JØRGEN HATTEMAKER",
    "kommune": {"navn": "TØNSBERG", "nummer": "3803"},
    "sektor": "",
    "neringsgruppe": "",
    "arstall": 2021,
    "kvartal": 3,
    ...sykefraværStatiskData,
    "status": IAProsessStatusEnum.enum.IKKE_AKTIV,
    "eidAv": null,
    "sistEndret": null
}, {
    "orgnr": "974633191",
    "virksomhetsnavn": "KRITTBUTIKKEN",
    "kommune": {"navn": "SKIEN", "nummer": "3807"},
    "sektor": "",
    "neringsgruppe": "",
    "arstall": 2021,
    "kvartal": 3,
    ...sykefraværStatiskData,
    "status": IAProsessStatusEnum.enum.IKKE_AKTIV,
    "eidAv": null,
    "sistEndret": null
}, {
    "orgnr": "974747138",
    "virksomhetsnavn": "NEI AS",
    "kommune": {"navn": "ÅLESUND", "nummer": "1507"},
    "sektor": "",
    "neringsgruppe": "",
    "arstall": 2021,
    "kvartal": 3,
    ...sykefraværStatiskDataUtenDesimaler,
    "status": IAProsessStatusEnum.enum.IKKE_AKTUELL,
    "eidAv": null,
    "sistEndret": endretDato
}, {
        "orgnr": "974747132",
        "virksomhetsnavn": "Nummer 21 AS",
        "kommune": {"navn": "ÅLESUND", "nummer": "1507"},
        "sektor": "",
        "neringsgruppe": "",
        "arstall": 2021,
        "kvartal": 3,
        ...sykefraværStatiskData,
        "status": IAProsessStatusEnum.enum.IKKE_AKTUELL,
        "eidAv": null,
        "sistEndret": endretDato
    },
]
