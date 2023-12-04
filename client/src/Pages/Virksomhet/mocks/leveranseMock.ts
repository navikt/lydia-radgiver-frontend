import { ulid } from "ulid";
import {
    LeveranserPerIATjeneste,
    LeveranseStatusEnum,
    IATjeneste,
    Modul
} from "../../../domenetyper/leveranse";

const saksnummer = ulid()

export const iaTjenester: IATjeneste[] = [
    {
        id: 1,
        navn: "Redusere sykefravær",
        deaktivert: false,
    }, {
        id: 2,
        navn: "Forebyggende arbeidsmiljøarbeid",
        deaktivert: false,
    }, {
        id: 3,
        navn: "HelseIArbeid",
        deaktivert: false,
    }, {
        id: 4,
        navn: "Utvikle partssamarbeid",
        deaktivert: false,
    }
]

export const moduler: Modul[] = [
    // 1 - "Redusere sykefravær"
    {
        id: 1,
        iaTjeneste: 1,
        navn: "Videreutvikle sykefraværsrutiner",
        deaktivert: true,
    }, {
        id: 2,
        iaTjeneste: 1,
        navn: "Oppfølgingssamtalen",
        deaktivert: true,
    }, {
        id: 3,
        iaTjeneste: 1,
        navn: "Tilretteleggingsplikt og medvirkningsplikt",
        deaktivert: true,
    }, {
        id: 4,
        iaTjeneste: 1,
        navn: "Langvarige og/eller hyppig gjentakende sykefravær",
        deaktivert: true,
    }, {
        id: 15,
        iaTjeneste: 1,
        navn: "Redusere sykefravær",
        deaktivert: false,
    },
    // 2 - "Forebyggende arbeidsmiljøarbeid"
    {
        id: 5,
        iaTjeneste: 2,
        navn: "Utvikle partssamarbeid",
        deaktivert: true,
    }, {
        id: 6,
        iaTjeneste: 2,
        navn: "Enkel arbeidsmiljøkartlegging",
        deaktivert: true,
    }, {
        id: 7,
        iaTjeneste: 2,
        navn: "Kontinuerlig (arbeidsmiljø)forbedring",
        deaktivert: true,
    }, {
        id: 8,
        iaTjeneste: 2,
        navn: "Endring og omstilling",
        deaktivert: true,
    }, {
        id: 9,
        iaTjeneste: 2,
        navn: "Oppfølging av arbeidsmiljøundersøkelse",
        deaktivert: true,
    }, {
        id: 10,
        iaTjeneste: 2,
        navn: "Livsfaseorientert personalpolitikk",
        deaktivert: true,
    },
    {
        id: 14,
        iaTjeneste: 2,
        navn: "Sees i morgen",
        deaktivert: true,
    },
    {
        id: 16,
        iaTjeneste: 2,
        navn: "Forebyggende arbeidsmiljøarbeid",
        deaktivert: false,
    },
    // 3 - "HelseIArbeid"
    {
        id: 11,
        iaTjeneste: 3,
        navn: "Muskel- og skjelett",
        deaktivert: true,
    },
    {
        id: 12,
        iaTjeneste: 3,
        navn: "Smertemestring og arbeidsmiljø",
        deaktivert: true,
    },
    {
        id: 13,
        iaTjeneste: 3,
        navn: "Psykisk helse",
        deaktivert: true,
    },
    {
        id: 17,
        iaTjeneste: 3,
        navn: "HelseIArbeid",
        deaktivert: false,
    }, {
        id: 18,
        iaTjeneste: 4,
        navn: "Utvikle partssamarbeid",
        deaktivert: false,
    }

]

export const leveranserPerIATjeneste: LeveranserPerIATjeneste[] = [
    {
        iaTjeneste: iaTjenester[0],
        leveranser: [
            {
                id: 1,
                saksnummer: saksnummer,
                modul: moduler[0],
                frist: new Date(),
                status: LeveranseStatusEnum.enum.UNDER_ARBEID,
                fullført: null,
            }, {
                id: 2,
                saksnummer: saksnummer,
                modul: moduler[1],
                frist: new Date(),
                status: LeveranseStatusEnum.enum.UNDER_ARBEID,
                fullført: null,
            }, {
                id: 3,
                saksnummer: saksnummer,
                modul: moduler[2],
                frist: new Date(),
                status: LeveranseStatusEnum.enum.UNDER_ARBEID,
                fullført: null,
            }, {
                id: 4,
                saksnummer: saksnummer,
                modul: moduler[3],
                frist: new Date(),
                status: LeveranseStatusEnum.enum.LEVERT,
                fullført: new Date(),
            },],
    },
    {
        iaTjeneste: iaTjenester[1],
        leveranser: [
            {
                id: 5,
                saksnummer: saksnummer,
                modul: moduler[4],
                frist: new Date(),
                status: LeveranseStatusEnum.enum.UNDER_ARBEID,
                fullført: null,
            }, {
                id: 6,
                saksnummer: saksnummer,
                modul: moduler[5],
                frist: new Date(),
                status: LeveranseStatusEnum.enum.UNDER_ARBEID,
                fullført: null,
            }, {
                id: 7,
                saksnummer: saksnummer,
                modul: moduler[6],
                frist: new Date(),
                status: LeveranseStatusEnum.enum.UNDER_ARBEID,
                fullført: null,
            }, {
                id: 8,
                saksnummer: saksnummer,
                modul: moduler[7],
                frist: new Date(),
                status: LeveranseStatusEnum.enum.UNDER_ARBEID,
                fullført: null,
            }, {
                id: 9,
                saksnummer: saksnummer,
                modul: moduler[8],
                frist: new Date(),
                status: LeveranseStatusEnum.enum.UNDER_ARBEID,
                fullført: null,
            }, {
                id: 10,
                saksnummer: saksnummer,
                modul: moduler[9],
                frist: new Date(),
                status: LeveranseStatusEnum.enum.LEVERT,
                fullført: new Date(),
            },],
    },
    {
        iaTjeneste: iaTjenester[2],
        leveranser: [
            {
                id: 11,
                saksnummer: saksnummer,
                modul: moduler[10],
                frist: new Date(),
                status: LeveranseStatusEnum.enum.UNDER_ARBEID,
                fullført: null,
            }],
    }
]
