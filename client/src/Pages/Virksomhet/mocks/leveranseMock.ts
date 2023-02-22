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
    }, {
        id: 2,
        navn: "Forebyggende arbeidsmiljøarbeid",
    }, {
        id: 3,
        navn: "HelseIArbeid",
    }
]

export const moduler: Modul[] = [
    // 1 - "Redusere sykefravær"
    {
        id: 1,
        iaTjeneste: 1,
        navn: "Videreutvikle sykefraværsrutiner",
    }, {
        id: 2,
        iaTjeneste: 1,
        navn: "Oppfølgingssamtalen",
    }, {
        id: 3,
        iaTjeneste: 1,
        navn: "Tilretteleggingsplikt og medvirkningsplikt",
    }, {
        id: 4,
        iaTjeneste: 1,
        navn: "Langvarige og/eller hyppig gjentakende sykefravær",
    },
    // 2 - "Forebyggende arbeidsmiljøarbeid"
    {
        id: 5,
        iaTjeneste: 2,
        navn: "Utvikle partssamarbeid",
    }, {
        id: 6,
        iaTjeneste: 2,
        navn: "Enkel arbeidsmiljøkartlegging",
    }, {
        id: 7,
        iaTjeneste: 2,
        navn: "Kontinuerlig (arbeidsmiljø)forbedring",
    }, {
        id: 8,
        iaTjeneste: 2,
        navn: "Endring og omstilling",
    }, {
        id: 9,
        iaTjeneste: 2,
        navn: "Oppfølging av arbeidsmiljøundersøkelse",
    }, {
        id: 10,
        iaTjeneste: 2,
        navn: "Livsfaseorientert personalpolitikk",
    },
    // 3 - "HelseIArbeid"
    {
        id: 11,
        iaTjeneste: 3,
        navn: "Bedriftstiltaket",
    },
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
