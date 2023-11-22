import { IAProsessStatusEnum } from "../../../domenetyper/domenetyper";
import { VirkomshetsstatistikkSisteKvartal } from "../../../domenetyper/virksomhetsstatistikkSisteKvartal";
import { VirksomhetsstatistikkSiste4Kvartaler } from "../../../domenetyper/virksomhetsstatistikkSiste4Kvartaler";
import { Virksomhetsoversikt } from "../../../domenetyper/virksomhetsoversikt";
import { Publiseringsinfo } from "../../../domenetyper/publiseringsinfo";
import { Bransjestatistikk, Næringsstatistikk } from "../../../domenetyper/bransjestatistikk";
import { HistoriskStatistikk } from "../../../domenetyper/historiskstatistikk";

const sykefraværStatiskData: Pick<VirkomshetsstatistikkSisteKvartal, 'antallPersoner' | 'muligeDagsverk' | 'tapteDagsverk' | 'sykefraværsprosent' | 'graderingsprosent'> = {
    antallPersoner: 69.4123,
    muligeDagsverk: 555.123123,
    tapteDagsverk: 222.22222,
    sykefraværsprosent: 1.513,
    graderingsprosent: 18.5,
}

const sykefraværStatiskDataUtenDesimaler: Pick<VirkomshetsstatistikkSisteKvartal, 'antallPersoner' | 'muligeDagsverk' | 'tapteDagsverk' | 'sykefraværsprosent' | 'graderingsprosent'> = {
    antallPersoner: 69,
    muligeDagsverk: 555,
    tapteDagsverk: 222,
    sykefraværsprosent: 1,
    graderingsprosent: 20,
}

const endretDato = new Date(2022, 7, 22)

export const sykefraværsstatistikkSisteKvartalMock: VirkomshetsstatistikkSisteKvartal[] = [{
    "orgnr": "995428563",
    "arstall": 2021,
    "kvartal": 3,
    ...sykefraværStatiskData,
    "maskert": false,
}];

const sistePubliserteKvartalMock = {
    årstall: 2092,
    kvartal: 2,
    prosent: 21,
    tapteDagsverk: 1234,
    muligeDagsverk: 4321,
    antallPersoner: 7239481728,
    erMaskert: false,
}

const siste4KvartalMock = {
    prosent: 12,
    tapteDagsverk: 2345,
    muligeDagsverk: 4321,
    erMaskert: false,
    kvartaler: [
        { årstall: 2022, kvartal: 3 },
        { årstall: 2022, kvartal: 2 },
        { årstall: 2022, kvartal: 1 },
        { årstall: 2021, kvartal: 4 },
    ],
}
export const sykefraværsstatistikkNæringMock: Næringsstatistikk = {
    næring: "næringsnavn",
    sisteGjeldendeKvartal: sistePubliserteKvartalMock,
    siste4Kvartal: siste4KvartalMock,
}

export const sykefraværsstatistikkBransjeMock: Bransjestatistikk = {
    bransje: "bransjenavn",
    sisteGjeldendeKvartal: sistePubliserteKvartalMock,
    siste4Kvartal: siste4KvartalMock,
}

export const forrigePeriodePubliseringsinfo: Publiseringsinfo = {
    sistePubliseringsdato: "2022-12-03",
    nestePubliseringsdato: "2023-03-02",
    fraTil: {
        fra: {
            kvartal: 4,
            årstall: 2021,
        },
        til: {
            kvartal: 3,
            årstall: 2022,
        }
    }
}

export const gjeldendePeriodePubliseringsinfo: Publiseringsinfo = {
    sistePubliseringsdato: "2023-03-02",
    nestePubliseringsdato: "2023-06-01",
    fraTil: {
        fra: {
            kvartal: 1,
            årstall: 2022,
        },
        til: {
            kvartal: 4,
            årstall: 2022,
        }
    }
}

export const virksomhetsstatistikkSiste4KvartalerMock: VirksomhetsstatistikkSiste4Kvartaler[] = [{
    "orgnr": "995428563",
    ...sykefraværStatiskData,
    "antallKvartaler": 4,
    "kvartaler": [
        { årstall: 2022, kvartal: 3 },
        { årstall: 2022, kvartal: 2 },
        { årstall: 2022, kvartal: 1 },
        { årstall: 2021, kvartal: 4 },
    ],
}, {
    "orgnr": "974557746",
    ...sykefraværStatiskDataUtenDesimaler,
    "antallKvartaler": 3,
    "kvartaler": [
        { årstall: 2022, kvartal: 3 },
        { årstall: 2022, kvartal: 2 },
        { årstall: 2021, kvartal: 4 },
    ],
}, {
    "orgnr": "974706490",
    ...sykefraværStatiskData,
    "antallKvartaler": 2,
    "kvartaler": [
        { årstall: 2022, kvartal: 2 },
        { årstall: 2021, kvartal: 4 },
    ],
}, {
    "orgnr": "974589095",
    ...sykefraværStatiskData,
    "antallKvartaler": 1,
    "kvartaler": [
        { årstall: 2021, kvartal: 4 },
    ],
}, {
    "orgnr": "973861778",
    ...sykefraværStatiskData,
    "antallKvartaler": 0,
    "kvartaler": [],
}]

export const sykefraværsstatistikkMock: Virksomhetsoversikt[] = [{
    "orgnr": "995428563",
    "virksomhetsnavn": "SUSHISHAPPA PÅ HJØRNET",
    ...sykefraværStatiskData,
    "status": IAProsessStatusEnum.enum.IKKE_AKTIV,
    "eidAv": "X123456",
    "sistEndret": null,
}, {
    "orgnr": "974557746",
    "virksomhetsnavn": "MUJAFAS BMW",
    ...sykefraværStatiskDataUtenDesimaler,
    "status": IAProsessStatusEnum.enum.IKKE_AKTUELL,
    "eidAv": null,
    "sistEndret": new Date(),
}, {
    "orgnr": "974706490",
    "virksomhetsnavn": "HERMETISKE TOMATER",
    ...sykefraværStatiskData,
    "status": IAProsessStatusEnum.enum.VURDERES,
    "eidAv": "Z123456",
    "sistEndret": endretDato,
}, {
    "orgnr": "974589095",
    "virksomhetsnavn": "RUNE RUDBERGS RÅNEHJØRNE",
    ...sykefraværStatiskData,
    "status": IAProsessStatusEnum.enum.KONTAKTES,
    "eidAv": null,
    "sistEndret": endretDato,
}, {
    "orgnr": "973861778",
    "virksomhetsnavn": "ANANAS RINGER",
    ...sykefraværStatiskData,
    "status": IAProsessStatusEnum.enum.IKKE_AKTIV,
    "eidAv": "A123456",
    "sistEndret": null,
}, {
    "orgnr": "874716782",
    "virksomhetsnavn": "PARADIS PIZZA",
    ...sykefraværStatiskDataUtenDesimaler,
    "status": IAProsessStatusEnum.enum.IKKE_AKTIV,
    "eidAv": null,
    "sistEndret": null,
}, {
    "orgnr": "974749025",
    "virksomhetsnavn": "KONG OLAV DEN HELLIGE",
    ...sykefraværStatiskData,
    "status": IAProsessStatusEnum.enum.IKKE_AKTIV,
    "eidAv": null,
    "sistEndret": null,
}, {
    "orgnr": "974703300",
    "virksomhetsnavn": "JALLA VIRKSOMHET",
    ...sykefraværStatiskData,
    "status": IAProsessStatusEnum.enum.IKKE_AKTIV,
    "eidAv": null,
    "sistEndret": null,
}, {
    "orgnr": "974633752",
    "virksomhetsnavn": "SKATTEFENGSELET",
    ...sykefraværStatiskDataUtenDesimaler,
    "status": IAProsessStatusEnum.enum.IKKE_AKTIV,
    "eidAv": null,
    "sistEndret": null,
}, {
    "orgnr": "974795787",
    "virksomhetsnavn": "VIRKSOMHET AS",
    ...sykefraværStatiskData,
    "status": IAProsessStatusEnum.enum.IKKE_AKTIV,
    "eidAv": null,
    "sistEndret": null,
}, {
    "orgnr": "985674744",
    "virksomhetsnavn": "SAMMA GAMLA VANLIGA",
    ...sykefraværStatiskDataUtenDesimaler,
    "status": IAProsessStatusEnum.enum.IKKE_AKTIV,
    "eidAv": null,
    "sistEndret": null,
}, {
    "orgnr": "974631326",
    "virksomhetsnavn": "NORTHUG",
    ...sykefraværStatiskData,
    "status": IAProsessStatusEnum.enum.IKKE_AKTIV,
    "eidAv": null,
    "sistEndret": null,
}, {
    "orgnr": "974757486",
    "virksomhetsnavn": "VINDRUER AS",
    ...sykefraværStatiskData,
    "status": IAProsessStatusEnum.enum.IKKE_AKTIV,
    "eidAv": null,
    "sistEndret": null,
}, {
    "orgnr": "998801389",
    "virksomhetsnavn": "BARCLAYS",
    ...sykefraværStatiskData,
    "status": IAProsessStatusEnum.enum.IKKE_AKTIV,
    "eidAv": null,
    "sistEndret": null,
}, {
    "orgnr": "973851713",
    "virksomhetsnavn": "CHELSEA FC",
    ...sykefraværStatiskData,
    "status": IAProsessStatusEnum.enum.IKKE_AKTIV,
    "eidAv": null,
    "sistEndret": null,
}, {
    "orgnr": "974733013",
    "virksomhetsnavn": "GODSET FRA DRAMMEN",
    ...sykefraværStatiskDataUtenDesimaler,
    "status": IAProsessStatusEnum.enum.IKKE_AKTIV,
    "eidAv": null,
    "sistEndret": null,
}, {
    "orgnr": "980054756",
    "virksomhetsnavn": "STATSMINISTERENS KONTOR",
    ...sykefraværStatiskData,
    "status": IAProsessStatusEnum.enum.IKKE_AKTIV,
    "eidAv": null,
    "sistEndret": null,
}, {
    "orgnr": "974633574",
    "virksomhetsnavn": "JØRGEN HATTEMAKER",
    ...sykefraværStatiskData,
    "status": IAProsessStatusEnum.enum.IKKE_AKTIV,
    "eidAv": null,
    "sistEndret": null,
}, {
    "orgnr": "974633191",
    "virksomhetsnavn": "KRITTBUTIKKEN",
    ...sykefraværStatiskData,
    "status": IAProsessStatusEnum.enum.IKKE_AKTIV,
    "eidAv": null,
    "sistEndret": null,
}, {
    "orgnr": "974747138",
    "virksomhetsnavn": "NEI AS",
    ...sykefraværStatiskDataUtenDesimaler,
    "status": IAProsessStatusEnum.enum.IKKE_AKTUELL,
    "eidAv": null,
    "sistEndret": endretDato,
}, {
    "orgnr": "974747132",
    "virksomhetsnavn": "Nummer 21 AS",
    ...sykefraværStatiskData,
    "status": IAProsessStatusEnum.enum.IKKE_AKTUELL,
    "eidAv": null,
    "sistEndret": endretDato,
},
]

export const historiskStatistikkMock: HistoriskStatistikk ={
    virksomhetsstatistikk: {
        kategori: "VIRKSOMHET",
        kode: "123456789",
        beskrivelse: "Virksomhet med historisk statistikk",
        statistikk: [
            {
                kvartal: 2,
                årstall: 2023,
                sykefraværsprosent: 2.0,
                maskert: false
            },
            {
                kvartal: 1,
                årstall: 2023,
                sykefraværsprosent: 7.0,
                maskert: false
            },
            {
                kvartal: 4,
                årstall: 2022,
                sykefraværsprosent: 8.0,
                maskert: false
            },
            {
                kvartal: 3,
                årstall: 2022,
                sykefraværsprosent: 17.0,
                maskert: false
            },
        ]
    },
    næringsstatistikk: {
        kategori: "NÆRING",
        kode: "88",
        beskrivelse: "Omsorg uten botilbud, barnehager mv.",
        statistikk: [
            {
                kvartal: 2,
                årstall: 2023,
                sykefraværsprosent: 7.0,
                maskert: false
            },
            {
                kvartal: 1,
                årstall: 2023,
                sykefraværsprosent: 8.0,
                maskert: false
            },
            {
                kvartal: 4,
                årstall: 2022,
                sykefraværsprosent: 9.0,
                maskert: false
            },
            {
                kvartal: 3,
                årstall: 2022,
                sykefraværsprosent: 5.0,
                maskert: false
            },
        ]
    },
    bransjestatistikk: {
        kategori: "BRANSJE",
        kode: "Barnehager",
        beskrivelse: "Barnehager",
        statistikk: [
            {
                kvartal: 2,
                årstall: 2023,
                sykefraværsprosent: 2.0,
                maskert: false
            },
            {
                kvartal: 1,
                årstall: 2023,
                sykefraværsprosent: 6.0,
                maskert: false
            },
            {
                kvartal: 4,
                årstall: 2022,
                sykefraværsprosent: 8.0,
                maskert: false
            },
            {
                kvartal: 3,
                årstall: 2022,
                sykefraværsprosent: 6.0,
                maskert: false
            },
        ]
    },
    sektorstatistikk: {
        kategori: "SEKTOR",
        kode: "1",
        beskrivelse: "Statlig forvaltning",
        statistikk: [
            {
                kvartal: 2,
                årstall: 2023,
                sykefraværsprosent: 4.9,
                maskert: false
            },
            {
                kvartal: 1,
                årstall: 2023,
                sykefraværsprosent: 3.9,
                maskert: false
            },
            {
                kvartal: 4,
                årstall: 2022,
                sykefraværsprosent: 4.9,
                maskert: false
            },
            {
                kvartal: 3,
                årstall: 2022,
                sykefraværsprosent: 4.9,
                maskert: false
            },
        ]
    },
    landsstatistikk: {
        kategori: "LAND",
        kode: "NO",
        beskrivelse: "Norge",
        statistikk: [
            {
                kvartal: 2,
                årstall: 2023,
                sykefraværsprosent: 6.0,
                maskert: false
            },
            {
                kvartal: 1,
                årstall: 2023,
                sykefraværsprosent: 7.0,
                maskert: false
            },
            {
                kvartal: 4,
                årstall: 2022,
                sykefraværsprosent: 5.0,
                maskert: false
            },
            {
                kvartal: 3,
                årstall: 2022,
                sykefraværsprosent: 6.0,
                maskert: false
            },
        ]
    }
}
