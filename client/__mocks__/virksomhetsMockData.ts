import { Næringsstatistikk } from "../src/domenetyper/bransjestatistikk";
import { IASak } from "../src/domenetyper/domenetyper";
import { IaSakProsess } from "../src/domenetyper/iaSakProsess";
import { Plan } from "../src/domenetyper/plan";
import { Publiseringsinfo } from "../src/domenetyper/publiseringsinfo";
import { Sakshistorikk } from "../src/domenetyper/sakshistorikk";
import { Virksomhet } from "../src/domenetyper/virksomhet";
import { VirksomhetsstatistikkSiste4Kvartaler } from "../src/domenetyper/virksomhetsstatistikkSiste4Kvartaler";
import { VirkomshetsstatistikkSisteKvartal } from "../src/domenetyper/virksomhetsstatistikkSisteKvartal";

export const dummyVirksomhetsinformasjon: Virksomhet = {
    orgnr: "840623927",
    navn: "Navn 840623927",
    adresse: ["adresse"],
    postnummer: "1234",
    poststed: "POSTSTED",
    næring: {
        navn: "Jordbruk, tilhør. tjenester, jakt",
        kode: "01",
    },
    næringsundergruppe1: {
        navn: "Dyrking av ris",
        kode: "01.120",
    },
    næringsundergruppe2: null,
    næringsundergruppe3: null,
    bransje: null,
    sektor: "Statlig forvaltning",
    status: "AKTIV",
    aktivtSaksnummer: "01K5BFZKXHVCSX0659EVJJ0Z29",
};

export const dummyIaSak: IASak = {
    saksnummer: "01K5BFZKXHVCSX0659EVJJ0Z29",
    orgnr: "840623927",
    opprettetTidspunkt: new Date("2025-09-17T09:27:09.489Z"),
    opprettetAv: "S54321",
    endretTidspunkt: new Date("2025-11-14T13:53:10.898Z"),
    endretAv: "Z123456",
    endretAvHendelseId: "01KA1A8D7JXZZV18S3QA6P07CA",
    eidAv: "Z123456",
    status: "VI_BISTÅR",
    gyldigeNesteHendelser: [
        {
            saksHendelsestype: "TILBAKE",
            gyldigeÅrsaker: [],
        },
        {
            saksHendelsestype: "FULLFØR_BISTAND",
            gyldigeÅrsaker: [],
        },
        {
            saksHendelsestype: "VIRKSOMHET_ER_IKKE_AKTUELL",
            gyldigeÅrsaker: [
                {
                    type: "NAV_IGANGSETTER_IKKE_TILTAK",
                    navn: "NAV har besluttet å ikke starte samarbeid",
                    begrunnelser: [
                        {
                            type: "IKKE_DIALOG_MELLOM_PARTENE",
                            navn: "Det er ikke dokumentert dialog mellom partene på arbeidsplassen",
                        },
                        {
                            type: "FOR_FÅ_TAPTE_DAGSVERK",
                            navn: "Virksomheten har for få tapte dagsverk",
                        },
                        {
                            type: "SAKEN_ER_FEILREGISTRERT",
                            navn: "Saken er feilregistrert",
                        },
                    ],
                },
                {
                    type: "VIRKSOMHETEN_TAKKET_NEI",
                    navn: "Virksomheten har takket nei",
                    begrunnelser: [
                        {
                            type: "VIRKSOMHETEN_ØNSKER_IKKE_SAMARBEID",
                            navn: "Virksomheten ønsker ikke forpliktende samarbeid med NAV om IA",
                        },
                        {
                            type: "VIRKSOMHETEN_HAR_IKKE_RESPONDERT",
                            navn: "Virksomheten har ikke respondert på forespørsel om forpliktende samarbeid",
                        },
                    ],
                },
            ],
        },
        {
            saksHendelsestype: "ENDRE_PROSESS",
            gyldigeÅrsaker: [],
        },
        {
            saksHendelsestype: "SLETT_PROSESS",
            gyldigeÅrsaker: [],
        },
        {
            saksHendelsestype: "NY_PROSESS",
            gyldigeÅrsaker: [],
        },
        {
            saksHendelsestype: "FULLFØR_PROSESS",
            gyldigeÅrsaker: [],
        },
        {
            saksHendelsestype: "AVBRYT_PROSESS",
            gyldigeÅrsaker: [],
        },
    ],
    lukket: false,
};

export const dummySakshistorikk: Sakshistorikk[] = [
    {
        saksnummer: "01K5BFZKXHVCSX0659EVJJ0Z29",
        opprettet: new Date("2025-09-17T09:27:09.489Z"),
        sistEndret: new Date(new Date("2025-11-14T13:53:10.898Z")),
        sakshendelser: [
            {
                status: "NY",
                hendelsestype: "OPPRETT_SAK_FOR_VIRKSOMHET",
                tidspunktForSnapshot: new Date("2025-09-17T09:27:09.489Z"),
                begrunnelser: [],
                eier: "S54321",
                hendelseOpprettetAv: "S54321",
            },
            {
                status: "VURDERES",
                hendelsestype: "VIRKSOMHET_VURDERES",
                tidspunktForSnapshot: new Date("2025-09-17T09:27:09.492Z"),
                begrunnelser: [],
                eier: "S54321",
                hendelseOpprettetAv: "S54321",
            },
            {
                status: "VURDERES",
                hendelsestype: "TA_EIERSKAP_I_SAK",
                tidspunktForSnapshot: new Date("2025-09-17T09:27:09.510Z"),
                begrunnelser: [],
                eier: "Y54321",
                hendelseOpprettetAv: "Y54321",
            },
            {
                status: "KONTAKTES",
                hendelsestype: "VIRKSOMHET_SKAL_KONTAKTES",
                tidspunktForSnapshot: new Date("2025-09-17T09:27:09.528Z"),
                begrunnelser: [],
                eier: "Y54321",
                hendelseOpprettetAv: "Y54321",
            },
            {
                status: "KARTLEGGES",
                hendelsestype: "VIRKSOMHET_KARTLEGGES",
                tidspunktForSnapshot: new Date("2025-09-17T09:27:09.545Z"),
                begrunnelser: [],
                eier: "Y54321",
                hendelseOpprettetAv: "Y54321",
            },
            {
                status: "KARTLEGGES",
                hendelsestype: "NY_PROSESS",
                tidspunktForSnapshot: new Date("2025-09-17T09:27:09.563Z"),
                begrunnelser: [],
                eier: "Y54321",
                hendelseOpprettetAv: "Y54321",
            },
            {
                status: "VI_BISTÅR",
                hendelsestype: "VIRKSOMHET_SKAL_BISTÅS",
                tidspunktForSnapshot: new Date("2025-09-17T09:27:09.583Z"),
                begrunnelser: [],
                eier: "Y54321",
                hendelseOpprettetAv: "Y54321",
            },
            {
                status: "VI_BISTÅR",
                hendelsestype: "TA_EIERSKAP_I_SAK",
                tidspunktForSnapshot: new Date("2025-10-15T11:10:26.103Z"),
                begrunnelser: [],
                eier: "Z123456",
                hendelseOpprettetAv: "Z123456",
            },
            {
                status: "VI_BISTÅR",
                hendelsestype: "NY_PROSESS",
                tidspunktForSnapshot: new Date("2025-10-17T06:30:07.098Z"),
                begrunnelser: [],
                eier: "Z123456",
                hendelseOpprettetAv: "Z123456",
            },
            {
                status: "VI_BISTÅR",
                hendelsestype: "NY_PROSESS",
                tidspunktForSnapshot: new Date("2025-11-10T11:07:32.812Z"),
                begrunnelser: [],
                eier: "Z123456",
                hendelseOpprettetAv: "Z123456",
            },
            {
                status: "VI_BISTÅR",
                hendelsestype: "NY_PROSESS",
                tidspunktForSnapshot: new Date("2025-11-10T11:07:45.014Z"),
                begrunnelser: [],
                eier: "Z123456",
                hendelseOpprettetAv: "Z123456",
            },
            {
                status: "VI_BISTÅR",
                hendelsestype: "NY_PROSESS",
                tidspunktForSnapshot: new Date("2025-11-10T11:08:07.054Z"),
                begrunnelser: [],
                eier: "Z123456",
                hendelseOpprettetAv: "Z123456",
            },
            {
                status: "VI_BISTÅR",
                hendelsestype: "NY_PROSESS",
                tidspunktForSnapshot: new Date("2025-11-10T11:08:14.202Z"),
                begrunnelser: [],
                eier: "Z123456",
                hendelseOpprettetAv: "Z123456",
            },
            {
                status: "VI_BISTÅR",
                hendelsestype: "NY_PROSESS",
                tidspunktForSnapshot: new Date("2025-11-10T11:08:19.339Z"),
                begrunnelser: [],
                eier: "Z123456",
                hendelseOpprettetAv: "Z123456",
            },
            {
                status: "VI_BISTÅR",
                hendelsestype: "NY_PROSESS",
                tidspunktForSnapshot: new Date("2025-11-10T11:08:34.781Z"),
                begrunnelser: [],
                eier: "Z123456",
                hendelseOpprettetAv: "Z123456",
            },
            {
                status: "VI_BISTÅR",
                hendelsestype: "NY_PROSESS",
                tidspunktForSnapshot: new Date("2025-11-10T11:08:53.421Z"),
                begrunnelser: [],
                eier: "Z123456",
                hendelseOpprettetAv: "Z123456",
            },
            {
                status: "VI_BISTÅR",
                hendelsestype: "FULLFØR_PROSESS",
                tidspunktForSnapshot: new Date("2025-11-10T11:09:24.115Z"),
                begrunnelser: [],
                eier: "Z123456",
                hendelseOpprettetAv: "Z123456",
            },
            {
                status: "VI_BISTÅR",
                hendelsestype: "FULLFØR_PROSESS",
                tidspunktForSnapshot: new Date("2025-11-10T11:09:44.390Z"),
                begrunnelser: [],
                eier: "Z123456",
                hendelseOpprettetAv: "Z123456",
            },
            {
                status: "VI_BISTÅR",
                hendelsestype: "FULLFØR_PROSESS",
                tidspunktForSnapshot: new Date("2025-11-10T11:10:04.035Z"),
                begrunnelser: [],
                eier: "Z123456",
                hendelseOpprettetAv: "Z123456",
            },
            {
                status: "VI_BISTÅR",
                hendelsestype: "NY_PROSESS",
                tidspunktForSnapshot: new Date("2025-11-10T11:10:15.838Z"),
                begrunnelser: [],
                eier: "Z123456",
                hendelseOpprettetAv: "Z123456",
            },
            {
                status: "VI_BISTÅR",
                hendelsestype: "NY_PROSESS",
                tidspunktForSnapshot: new Date("2025-11-10T11:10:24.342Z"),
                begrunnelser: [],
                eier: "Z123456",
                hendelseOpprettetAv: "Z123456",
            },
            {
                status: "VI_BISTÅR",
                hendelsestype: "AVBRYT_PROSESS",
                tidspunktForSnapshot: new Date("2025-11-10T11:10:34.530Z"),
                begrunnelser: [],
                eier: "Z123456",
                hendelseOpprettetAv: "Z123456",
            },
            {
                status: "VI_BISTÅR",
                hendelsestype: "SLETT_PROSESS",
                tidspunktForSnapshot: new Date("2025-11-10T11:10:43.530Z"),
                begrunnelser: [],
                eier: "Z123456",
                hendelseOpprettetAv: "Z123456",
            },
            {
                status: "VI_BISTÅR",
                hendelsestype: "NY_PROSESS",
                tidspunktForSnapshot: new Date("2025-11-10T14:03:08.021Z"),
                begrunnelser: [],
                eier: "Z123456",
                hendelseOpprettetAv: "Z123456",
            },
            {
                status: "VI_BISTÅR",
                hendelsestype: "NY_PROSESS",
                tidspunktForSnapshot: new Date("2025-11-14T11:50:16.332Z"),
                begrunnelser: [],
                eier: "Z123456",
                hendelseOpprettetAv: "Z123456",
            },
            {
                status: "VI_BISTÅR",
                hendelsestype: "ENDRE_PROSESS",
                tidspunktForSnapshot: new Date("2025-11-14T13:53:10.898Z"),
                begrunnelser: [],
                eier: "Z123456",
                hendelseOpprettetAv: "Z123456",
            },
        ],
        samarbeid: [
            {
                id: 2,
                saksnummer: "01K5BFZKXHVCSX0659EVJJ0Z29",
                navn: "Samarbeid uten navn",
                status: "AKTIV",
                sistEndret: new Date("2025-09-17T09:27:09.564Z"),
                opprettet: new Date("2025-09-17T09:27:09.564Z"),
            },
            {
                id: 4,
                saksnummer: "01K5BFZKXHVCSX0659EVJJ0Z29",
                navn: "jghm",
                status: "AKTIV",
                sistEndret: new Date("2025-10-17T06:30:07.114Z"),
                opprettet: new Date("2025-10-17T06:30:07.114Z"),
            },
            {
                id: 5,
                saksnummer: "01K5BFZKXHVCSX0659EVJJ0Z29",
                navn: "Samarbeid 74",
                status: "AKTIV",
                sistEndret: new Date("2025-11-10T11:07:32.854Z"),
                opprettet: new Date("2025-11-10T11:07:32.854Z"),
            },
            {
                id: 6,
                saksnummer: "01K5BFZKXHVCSX0659EVJJ0Z29",
                navn: "Motarbeid",
                status: "AKTIV",
                sistEndret: new Date("2025-11-10T11:07:45.028Z"),
                opprettet: new Date("2025-11-10T11:07:45.028Z"),
            },
            {
                id: 9,
                saksnummer: "01K5BFZKXHVCSX0659EVJJ0Z29",
                navn: "Demodata!",
                status: "AKTIV",
                sistEndret: new Date("2025-11-10T11:08:19.341Z"),
                opprettet: new Date("2025-11-10T11:08:19.341Z"),
            },
            {
                id: 11,
                saksnummer: "01K5BFZKXHVCSX0659EVJJ0Z29",
                navn: "Kanskje et kjempelangt åpent samarbeidsnavn også??",
                status: "AKTIV",
                sistEndret: new Date("2025-11-10T11:08:53.425Z"),
                opprettet: new Date("2025-11-10T11:08:53.425Z"),
            },
            {
                id: 10,
                saksnummer: "01K5BFZKXHVCSX0659EVJJ0Z29",
                navn: "Hva med et kjempelangt lukket samarbeidsnavn da???",
                status: "FULLFØRT",
                sistEndret: new Date("2025-11-10T11:09:24.142Z"),
                opprettet: new Date("2025-11-10T11:08:34.794Z"),
            },
            {
                id: 7,
                saksnummer: "01K5BFZKXHVCSX0659EVJJ0Z29",
                navn: "Lukk1.",
                status: "FULLFØRT",
                sistEndret: new Date("2025-11-10T11:09:44.405Z"),
                opprettet: new Date("2025-11-10T11:08:07.059Z"),
            },
            {
                id: 8,
                saksnummer: "01K5BFZKXHVCSX0659EVJJ0Z29",
                navn: "Enda en",
                status: "FULLFØRT",
                sistEndret: new Date("2025-11-10T11:10:04.060Z"),
                opprettet: new Date("2025-11-10T11:08:14.206Z"),
            },
            {
                id: 12,
                saksnummer: "01K5BFZKXHVCSX0659EVJJ0Z29",
                navn: "Hva med et avbrutt?",
                status: "AVBRUTT",
                sistEndret: new Date("2025-11-10T11:10:34.583Z"),
                opprettet: new Date("2025-11-10T11:10:15.844Z"),
            },
            {
                id: 14,
                saksnummer: "01K5BFZKXHVCSX0659EVJJ0Z29",
                navn: "kjempelangtsammenhengend e kjempelangtsammenhengen",
                status: "AKTIV",
                sistEndret: new Date("2025-11-10T14:03:08.051Z"),
                opprettet: new Date("2025-11-10T14:03:08.051Z"),
            },
            {
                id: 15,
                saksnummer: "01K5BFZKXHVCSX0659EVJJ0Z29",
                navn: "AAAAAAAAAAAAAA",
                status: "AKTIV",
                sistEndret: new Date("2025-11-14T13:53:10.943Z"),
                opprettet: new Date("2025-11-14T11:50:16.387Z"),
            },
        ],
    },
];

export const dummySamarbeid: IaSakProsess[] = [
    {
        id: 2,
        saksnummer: "01K5BFZKXHVCSX0659EVJJ0Z29",
        navn: "Samarbeid uten navn",
        status: "AKTIV",
        sistEndret: new Date("2025-09-17T09:27:09.564Z"),
        opprettet: new Date("2025-09-17T09:27:09.564Z"),
    },
    {
        id: 4,
        saksnummer: "01K5BFZKXHVCSX0659EVJJ0Z29",
        navn: "jghm",
        status: "AKTIV",
        sistEndret: new Date("2025-10-17T06:30:07.114Z"),
        opprettet: new Date("2025-10-17T06:30:07.114Z"),
    },
    {
        id: 5,
        saksnummer: "01K5BFZKXHVCSX0659EVJJ0Z29",
        navn: "Samarbeid 74",
        status: "AKTIV",
        sistEndret: new Date("2025-11-10T11:07:32.854Z"),
        opprettet: new Date("2025-11-10T11:07:32.854Z"),
    },
    {
        id: 6,
        saksnummer: "01K5BFZKXHVCSX0659EVJJ0Z29",
        navn: "Motarbeid",
        status: "AKTIV",
        sistEndret: new Date("2025-11-10T11:07:45.028Z"),
        opprettet: new Date("2025-11-10T11:07:45.028Z"),
    },
    {
        id: 9,
        saksnummer: "01K5BFZKXHVCSX0659EVJJ0Z29",
        navn: "Demodata!",
        status: "AKTIV",
        sistEndret: new Date("2025-11-10T11:08:19.341Z"),
        opprettet: new Date("2025-11-10T11:08:19.341Z"),
    },
    {
        id: 11,
        saksnummer: "01K5BFZKXHVCSX0659EVJJ0Z29",
        navn: "Kanskje et kjempelangt åpent samarbeidsnavn også??",
        status: "AKTIV",
        sistEndret: new Date("2025-11-10T11:08:53.425Z"),
        opprettet: new Date("2025-11-10T11:08:53.425Z"),
    },
    {
        id: 10,
        saksnummer: "01K5BFZKXHVCSX0659EVJJ0Z29",
        navn: "Hva med et kjempelangt lukket samarbeidsnavn da???",
        status: "FULLFØRT",
        sistEndret: new Date("2025-11-10T11:09:24.142Z"),
        opprettet: new Date("2025-11-10T11:08:34.794Z"),
    },
    {
        id: 7,
        saksnummer: "01K5BFZKXHVCSX0659EVJJ0Z29",
        navn: "Lukk1.",
        status: "FULLFØRT",
        sistEndret: new Date("2025-11-10T11:09:44.405Z"),
        opprettet: new Date("2025-11-10T11:08:07.059Z"),
    },
    {
        id: 8,
        saksnummer: "01K5BFZKXHVCSX0659EVJJ0Z29",
        navn: "Enda en",
        status: "FULLFØRT",
        sistEndret: new Date("2025-11-10T11:10:04.060Z"),
        opprettet: new Date("2025-11-10T11:08:14.206Z"),
    },
    {
        id: 12,
        saksnummer: "01K5BFZKXHVCSX0659EVJJ0Z29",
        navn: "Hva med et avbrutt?",
        status: "AVBRUTT",
        sistEndret: new Date("2025-11-10T11:10:34.583Z"),
        opprettet: new Date("2025-11-10T11:10:15.844Z"),
    },
    {
        id: 14,
        saksnummer: "01K5BFZKXHVCSX0659EVJJ0Z29",
        navn: "kjempelangtsammenhengend e kjempelangtsammenhengen",
        status: "AKTIV",
        sistEndret: new Date("2025-11-10T14:03:08.051Z"),
        opprettet: new Date("2025-11-10T14:03:08.051Z"),
    },
    {
        id: 15,
        saksnummer: "01K5BFZKXHVCSX0659EVJJ0Z29",
        navn: "AAAAAAAAAAAAAA",
        status: "AKTIV",
        sistEndret: new Date("2025-11-14T13:53:10.943Z"),
        opprettet: new Date("2025-11-14T11:50:16.387Z"),
    },
];

export const dummyNæringsstatistikk: Næringsstatistikk = {
    næring: "01",
    sisteGjeldendeKvartal: {
        årstall: 2025,
        kvartal: 2,
        prosent: 5,
        tapteDagsverk: 12500,
        muligeDagsverk: 250000,
        antallPersoner: 1000,
        erMaskert: false,
    },
    siste4Kvartal: {
        prosent: 5,
        tapteDagsverk: 50000,
        muligeDagsverk: 1000000,
        erMaskert: false,
        kvartaler: [
            {
                kvartal: 2,
                årstall: 2025,
            },
            {
                kvartal: 1,
                årstall: 2025,
            },
        ],
    },
};

export const dummyPubliseringsinfo: Publiseringsinfo = {
    sistePubliseringsdato: "2025-09-04",
    nestePubliseringsdato: "2025-11-27",
    fraTil: {
        fra: {
            kvartal: 3,
            årstall: 2024,
        },
        til: {
            kvartal: 2,
            årstall: 2025,
        },
    },
};

export const dummySykefraværsstatistikkSiste4Kvartal: VirkomshetsstatistikkSisteKvartal =
{
    orgnr: "840623927",
    arstall: 2025,
    kvartal: 2,
    antallPersoner: 470,
    tapteDagsverk: 3044.95550993731,
    muligeDagsverk: 125,
    sykefraværsprosent: 19,
    graderingsprosent: 37,
    maskert: false,
};

export const dummyVirksomhetsstatistikkSiste4Kvartal: VirksomhetsstatistikkSiste4Kvartaler =
{
    orgnr: "840623927",
    sykefraværsprosent: 19,
    graderingsprosent: 37,
    muligeDagsverk: 500,
    tapteDagsverk: 12179.8220397492,
    antallKvartaler: 2,
    kvartaler: [
        {
            kvartal: 1,
            årstall: 2025,
        },
        {
            kvartal: 2,
            årstall: 2025,
        },
    ],
};

export const dummyPlan: Plan = {
    id: "54af420a-5a38-46de-8346-8f2b616acedf",
    sistEndret: new Date("2025-12-17T13:15:41.261726"),
    //status: "AKTIV",
    temaer: [
        {
            id: 10,
            navn: "Partssamarbeid",
            inkludert: true,
            undertemaer: [
                {
                    id: 34,
                    navn: "Utvikle partssamarbeidet",
                    målsetning: "Styrke og strukturere samarbeidet mellom leder, tillitsvalgt og verneombud, samt øke kunnskap og ferdigheter for å jobbe systematisk og forebyggende med sykefravær og arbeidsmiljø.",
                    inkludert: true,
                    status: "PLANLAGT",
                    startDato: new Date("2025-12-17"),
                    sluttDato: new Date("2026-01-17"),
                    harAktiviteterISalesforce: false
                }
            ]
        },
        {
            id: 11,
            navn: "Sykefraværsarbeid",
            inkludert: true,
            undertemaer: [
                {
                    id: 35,
                    navn: "Sykefraværsrutiner",
                    målsetning: "Jobbe systematisk og forebyggende med sykefravær, samt forbedre rutiner og oppfølging av ansatte som er sykmeldte eller står i fare for å bli det.",
                    inkludert: true,
                    status: "PLANLAGT",
                    startDato: new Date("2025-12-17"),
                    sluttDato: new Date("2026-01-17"),
                    harAktiviteterISalesforce: false
                },
                {
                    id: 36,
                    navn: "Oppfølgingssamtaler",
                    målsetning: "Øke kompetanse og ferdigheter for hvordan man gjennomfører gode oppfølgingssamtaler, både gjennom teori og praksis.",
                    inkludert: false,
                    status: null,
                    startDato: null,
                    sluttDato: null,
                    harAktiviteterISalesforce: false
                },
                {
                    id: 37,
                    navn: "Tilretteleggings- og medvirkningsplikt",
                    målsetning: "Utvikle rutiner og kultur for tilrettelegging og medvirkning, samt kartlegging av tilretteleggingsmuligheter på arbeidsplassen.",
                    inkludert: true,
                    status: "PLANLAGT",
                    startDato: new Date("2025-12-17"),
                    sluttDato: new Date("2026-01-17"),
                    harAktiviteterISalesforce: false
                },
                {
                    id: 38,
                    navn: "Sykefravær - enkeltsaker",
                    målsetning: "Øke kompetanse og ferdigheter for hvordan man tar tak i, følger opp og løser enkeltsaker.",
                    inkludert: false,
                    status: null,
                    startDato: null,
                    sluttDato: null,
                    harAktiviteterISalesforce: false
                }
            ]
        },
        {
            id: 12,
            navn: "Arbeidsmiljø",
            inkludert: true,
            undertemaer: [
                {
                    id: 39,
                    navn: "Utvikle arbeidsmiljøet",
                    målsetning: "Øke anvendelse og kompetanse innen verktøy og bransjerettet kunnskap for å jobbe målrettet og kunnskapsbasert med eget arbeidsmiljø.",
                    inkludert: false,
                    status: null,
                    startDato: null,
                    sluttDato: null,
                    harAktiviteterISalesforce: false
                },
                {
                    id: 40,
                    navn: "Endring og omstilling",
                    målsetning: "Øke kompetansen for hvordan man ivaretar arbeidsmiljø og forebygger sykefravær under endring og omstilling.",
                    inkludert: true,
                    status: "PLANLAGT",
                    startDato: new Date("2025-12-17"),
                    sluttDato: new Date("2026-01-17"),
                    harAktiviteterISalesforce: false
                },
                {
                    id: 41,
                    navn: "Oppfølging av arbeidsmiljøundersøkelser",
                    målsetning: "Øke ferdigheter og gi støtte til hvordan man kan jobbe med forhold på arbeidsplassen som belyses i egne arbeidsmiljøundersøkelser.",
                    inkludert: false,
                    status: null,
                    startDato: null,
                    sluttDato: null,
                    harAktiviteterISalesforce: false
                },
                {
                    id: 42,
                    navn: "Livsfaseorientert personalpolitikk",
                    målsetning: "Utvikle kultur og personalpolitikk som ivaretar medarbeideres ulike behov, krav, begrensninger og muligheter i ulike livsfaser.",
                    inkludert: true,
                    status: "PLANLAGT",
                    startDato: new Date("2025-12-17"),
                    sluttDato: new Date("2026-01-17"),
                    harAktiviteterISalesforce: false
                },
                {
                    id: 43,
                    navn: "Psykisk helse",
                    målsetning: "Gi innsikt i hvordan psykiske utfordringer kan komme til uttrykk i arbeidshverdagen og øke ferdigheter for hvordan man møter medarbeidere med psykiske helseutfordringer.",
                    inkludert: false,
                    status: null,
                    startDato: null,
                    sluttDato: null,
                    harAktiviteterISalesforce: false
                },
                {
                    id: 44,
                    navn: "HelseIArbeid",
                    målsetning: "Øke kompetansen og få ansatte til å mestre jobb, selv med muskel/skjelett- og psykiske helseplager.",
                    inkludert: true,
                    status: "PLANLAGT",
                    startDato: new Date("2025-12-17"),
                    sluttDato: new Date("2026-01-17"),
                    harAktiviteterISalesforce: false
                }
            ]
        }
    ],
    sistPublisert: null,
    publiseringStatus: "IKKE_PUBLISERT",
    harEndringerSidenSistPublisert: false
}