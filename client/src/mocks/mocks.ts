import {
    Brukerinformasjon,
    IASakshendelseType,
    Næringsgruppe,
    SykefraversstatistikkVirksomhet,
    SykefraværsstatistikkVirksomhetRespons,
    Virksomhet
} from "../domenetyper";
import {sykefraværsstatistikkMock} from "../Pages/Prioritering/mocks/sykefraværsstatistikkMock";
import {
    iaSakFullført,
    iaSakIkkeAktuell,
    iaSakKartlegges,
    iaSakKontaktes,
    iaSakViBistår,
    iaSakVurderesMedEier,
    iaSakVurderesUtenEier
} from "../Pages/Virksomhet/mocks/iaSakMock";

export const brukerMedGyldigToken: Brukerinformasjon = {
    navn: "Navn Navnesen",
    ident: "Z12345",
    epost: "navn.navnesen@dev.nav.no",
    tokenUtløper: Date.now() + 1000 * 60 * 60 * 24
}
export const sykefraværRespons: SykefraværsstatistikkVirksomhetRespons = {
    data: sykefraværsstatistikkMock,
    total: 80
}

const neringsgrupper: Næringsgruppe[] = [
        {
            navn: "Offentlig administrasjon og forsvar, og trygdeordninger underlagt offentlig forvaltning",
            kode: "50.221"
        },
        {
            navn: "En annen næring",
            kode: "23.321"
        },
        {
            navn: "Produksjon av ikke-jernholdige metaller ellers",
            kode: "24.450"
        }
    ]

export const virksomheterMock: Virksomhet[] = [
    {
        "orgnr": "995428563",
        "navn": "SUSHISHAPPA PÅ HJØRNET",
        "adresse": [],
    "poststed": "OSLO",
        "postnummer": "0301",
        "neringsgrupper": neringsgrupper,
        "sektor": "Privat og offentlig næringsvirksomhet",
    },
    {
        "orgnr": "974557746",
        "navn": "MUJAFAS BMW",
        "adresse": [],
        "poststed": "BERGEN",
        "postnummer": "4601",
        "neringsgrupper": neringsgrupper,
        "sektor": "Privat og offentlig næringsvirksomhet",
    },
    {
        "orgnr": "974706490",
        "navn": "HERMETISKE TOMATER",
        "adresse": [],
        "poststed": "LØRENSKOG",
        "postnummer": "3029",
        "neringsgrupper": neringsgrupper,
        "sektor": "Privat og offentlig næringsvirksomhet",
    },
    {
        "orgnr": "974589095",
        "navn": "RUNE RUDBERGS RÅNEHJØRNE",
        "adresse": [],
        "poststed": "OSLO",
        "postnummer": "0301",
        "neringsgrupper": neringsgrupper,
        "sektor": "Privat og offentlig næringsvirksomhet",
    },
    {
        "orgnr": "973861778",
        "navn": "ANANAS RINGER",
        "adresse": [],
        "poststed": "SOKKELEN SØR FOR 62 GRADER",
        "postnummer": "2311",
        "neringsgrupper": neringsgrupper,
        "sektor": "Privat og offentlig næringsvirksomhet",
    },
    {
        "orgnr": "874716782",
        "navn": "PARADIS PIZZA",
        "adresse": [],
        "poststed": "OSLO",
        "postnummer": "0301",
        "neringsgrupper": neringsgrupper,
        "sektor": "Privat og offentlig næringsvirksomhet",
    },
    {
        "orgnr": "974749025",
        "navn": "KONG OLAV DEN HELLIGE",
        "adresse": [],
        "poststed": "TRONDHEIM",
        "postnummer": "5001",
        "neringsgrupper": neringsgrupper,
        "sektor": "Privat og offentlig næringsvirksomhet",
    },
    {
        "orgnr": "974703300",
        "navn": "JALLA BEDRIFT",
        "adresse": [],
        "poststed": "STAVANGER",
        "postnummer": "1103",
        "neringsgrupper": neringsgrupper,
        "sektor": "Privat og offentlig næringsvirksomhet",
    },
    {
        "orgnr": "974633752",
        "navn": "SKATTEFENGSELET",
        "adresse": [],
        "poststed": "SARPSBORG",
        "postnummer": "3003",
        "neringsgrupper": neringsgrupper,
        "sektor": "Privat og offentlig næringsvirksomhet",
    },
    {
        "orgnr": "974795787",
        "navn": "VIRKSOMHET AS",
        "adresse": [],
        "poststed": "TROMSØ",
        "postnummer": "5401",
        "neringsgrupper": neringsgrupper,
        "sektor": "Privat og offentlig næringsvirksomhet",
    },
    {
        "orgnr": "985674744",
        "navn": "SAMMA GAMLA VANLIGA",
        "adresse": [],
        "poststed": "OSLO",
        "postnummer": "0301",
        "neringsgrupper": neringsgrupper,
        "sektor": "Privat og offentlig næringsvirksomhet",
    },
    {
        "orgnr": "974631326",
        "navn": "NORTHUG",
        "adresse": [],
        "poststed": "DRAMMEN",
        "postnummer": "3005",
        "neringsgrupper": neringsgrupper,
        "sektor": "Privat og offentlig næringsvirksomhet",
    },
    {
        "orgnr": "974757486",
        "navn": "VINDRUER AS",
        "adresse": [],
        "poststed": "TROMSØ",
        "postnummer": "5401",
        "neringsgrupper": neringsgrupper,
        "sektor": "Privat og offentlig næringsvirksomhet",
    },
    {
        "orgnr": "998801389",
        "navn": "BARCLAYS",
        "adresse": [],
        "poststed": "OSLO",
        "postnummer": "0301",
        "neringsgrupper": neringsgrupper,
        "sektor": "Privat og offentlig næringsvirksomhet",
    },
    {
        "orgnr": "973851713",
        "navn": "CHELSEA FC",
        "adresse": [],
        "poststed": "DRAMMEN",
        "postnummer": "3005",
        "neringsgrupper": neringsgrupper,
        "sektor": "Privat og offentlig næringsvirksomhet",
    },
    {
        "orgnr": "974733013",
        "navn": "GODSET FRA DRAMMEN",
        "adresse": [],
        "poststed": "KRISTIANSAND",
        "postnummer": "4204",
        "neringsgrupper": neringsgrupper,
        "sektor": "Privat og offentlig næringsvirksomhet",
    },
    {
        "orgnr": "980054756",
        "navn": "STATSMINISTERENS KONTOR",
        "adresse": [],
        "poststed": "STAVANGER",
        "postnummer": "1103",
        "neringsgrupper": neringsgrupper,
        "sektor": "Privat og offentlig næringsvirksomhet",
    },
    {
        "orgnr": "974633574",
        "navn": "JØRGEN HATTEMAKER",
        "adresse": [],
        "poststed": "TØNSBERG",
        "postnummer": "3803",
        "neringsgrupper": neringsgrupper,
        "sektor": "Privat og offentlig næringsvirksomhet",
    },
    {
        "orgnr": "974633191",
        "navn": "KRITTBUTIKKEN",
        "adresse": [],
        "poststed": "SKIEN",
        "postnummer": "3807",
        "neringsgrupper": neringsgrupper,
        "sektor": "Privat og offentlig næringsvirksomhet",
    },
    {
        "orgnr": "974747138",
        "navn": "NEI AS",
        "adresse": [],
        "poststed": "ÅLESUND",
        "postnummer": "1507",
        "neringsgrupper": neringsgrupper,
        "sektor": "Privat og offentlig næringsvirksomhet",
    },
    {
        "orgnr": "974747132",
        "navn": "Nummer 21 AS",
        "adresse": [],
        "poststed": "ÅLESUND",
        "postnummer": "1507",
        "neringsgrupper": neringsgrupper,
        "sektor": "Privat og offentlig næringsvirksomhet",
    },
]

export const iaSakFraHendelse = (hendelsesType: IASakshendelseType) => {
    switch (hendelsesType) {
        case "OPPRETT_SAK_FOR_VIRKSOMHET":
        case "VIRKSOMHET_VURDERES":
            return iaSakVurderesUtenEier
        case "TA_EIERSKAP_I_SAK":
            return iaSakVurderesMedEier
        case "VIRKSOMHET_SKAL_KONTAKTES":
            return iaSakKontaktes
        case "VIRKSOMHET_ER_IKKE_AKTUELL":
            return iaSakIkkeAktuell
        case "VIRKSOMHET_KARTLEGGES":
            return iaSakKartlegges
        case "VIRKSOMHET_SKAL_BISTÅS":
            return iaSakViBistår
        case "FULLFØR_BISTAND":
            return iaSakFullført
        case "TILBAKE":
            return iaSakViBistår
    }
}

export const iaSakFraStatistikk = (statistikk: SykefraversstatistikkVirksomhet) => {
    switch (statistikk.status) {
        case "NY":
        case "VURDERES":
            return [statistikk.eidAv ? iaSakVurderesMedEier : iaSakVurderesUtenEier]
        case "IKKE_AKTIV":
            return []
        case "KONTAKTES":
            return [iaSakKontaktes]
        case "KARTLEGGES":
            return [iaSakKartlegges]
        case "VI_BISTÅR":
            return [iaSakViBistår]
        case "FULLFØRT":
            return [iaSakFullført]
        case "IKKE_AKTUELL":
            return [iaSakIkkeAktuell]
    }
}