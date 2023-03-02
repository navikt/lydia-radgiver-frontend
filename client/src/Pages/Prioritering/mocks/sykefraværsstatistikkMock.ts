import { IAProsessStatusEnum } from "../../../domenetyper/domenetyper";
import { KvartalFraTil } from "../../../domenetyper/kvartal";
import { VirkomshetsstatistikkSisteKvartal } from "../../../domenetyper/virksomhetsstatistikkSisteKvartal";
import { VirksomhetsstatistikkSiste4Kvartaler } from "../../../domenetyper/virksomhetsstatistikkSiste4Kvartaler";
import { Virksomhetsoversikt } from "../../../domenetyper/virksomhetsoversikt";

const sykefraværStatiskData: Pick<Virksomhetsoversikt, 'antallPersoner' | 'muligeDagsverk' | 'tapteDagsverk' | 'sykefraversprosent'> = {
    antallPersoner: 69.4123,
    muligeDagsverk: 555.123123,
    tapteDagsverk: 222.22222,
    sykefraversprosent: 1.513
}

const sykefraværStatiskDataUtenDesimaler: Pick<Virksomhetsoversikt, 'antallPersoner' | 'muligeDagsverk' | 'tapteDagsverk' | 'sykefraversprosent'> = {
    antallPersoner: 69,
    muligeDagsverk: 555,
    tapteDagsverk: 222,
    sykefraversprosent: 1
}

const endretDato = new Date(2022, 7, 22)

export const sykefraværsstatistikkSisteKvartalMock: VirkomshetsstatistikkSisteKvartal[] = [{
    "orgnr": "995428563",
    "arstall": 2021,
    "kvartal": 3,
    ...sykefraværStatiskData,
    "maskert": false,
}];

export const forrigePeriodeSiste4Kvartal: KvartalFraTil = {
    fra: {
        kvartal: 4,
        årstall: 2021,
    },
    til: {
        kvartal: 3,
        årstall: 2022,
    }
}

export const gjeldendePeriodeSiste4Kvartal: KvartalFraTil = {
    fra: {
        kvartal: 1,
        årstall: 2022,
    },
    til: {
        kvartal: 4,
        årstall: 2022,
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
    "sistEndret": endretDato,
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
