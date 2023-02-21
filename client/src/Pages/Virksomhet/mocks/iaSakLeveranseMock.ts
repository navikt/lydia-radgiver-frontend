import { ulid } from "ulid";
import {
    IASakLeveranserPerTjeneste,
    IASakLeveranseStatusEnum,
    IATjeneste,
    IATjenesteModul
} from "../../../domenetyper/iaLeveranse";

const saksnummer = ulid()

export const IATjenester: IATjeneste[] = [
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

export const IATjenesteModuler: IATjenesteModul[] = [
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

export const iaSakLeveranser: IASakLeveranserPerTjeneste[] = [
    {
        iaTjeneste: IATjenester[0],
        leveranser: [
            {
                id: 1,
                saksnummer: saksnummer,
                modul: IATjenesteModuler[0],
                frist: new Date(),
                status: IASakLeveranseStatusEnum.enum.UNDER_ARBEID,
                fullført: null,
            }, {
                id: 2,
                saksnummer: saksnummer,
                modul: IATjenesteModuler[1],
                frist: new Date(),
                status: IASakLeveranseStatusEnum.enum.UNDER_ARBEID,
                fullført: null,
            }, {
                id: 3,
                saksnummer: saksnummer,
                modul: IATjenesteModuler[2],
                frist: new Date(),
                status: IASakLeveranseStatusEnum.enum.UNDER_ARBEID,
                fullført: null,
            }, {
                id: 4,
                saksnummer: saksnummer,
                modul: IATjenesteModuler[3],
                frist: new Date(),
                status: IASakLeveranseStatusEnum.enum.LEVERT,
                fullført: new Date(),
            },],
    },
    {
        iaTjeneste: IATjenester[1],
        leveranser: [
            {
                id: 5,
                saksnummer: saksnummer,
                modul: IATjenesteModuler[4],
                frist: new Date(),
                status: IASakLeveranseStatusEnum.enum.UNDER_ARBEID,
                fullført: null,
            }, {
                id: 6,
                saksnummer: saksnummer,
                modul: IATjenesteModuler[5],
                frist: new Date(),
                status: IASakLeveranseStatusEnum.enum.UNDER_ARBEID,
                fullført: null,
            }, {
                id: 7,
                saksnummer: saksnummer,
                modul: IATjenesteModuler[6],
                frist: new Date(),
                status: IASakLeveranseStatusEnum.enum.UNDER_ARBEID,
                fullført: null,
            }, {
                id: 8,
                saksnummer: saksnummer,
                modul: IATjenesteModuler[7],
                frist: new Date(),
                status: IASakLeveranseStatusEnum.enum.UNDER_ARBEID,
                fullført: null,
            }, {
                id: 9,
                saksnummer: saksnummer,
                modul: IATjenesteModuler[8],
                frist: new Date(),
                status: IASakLeveranseStatusEnum.enum.UNDER_ARBEID,
                fullført: null,
            }, {
                id: 10,
                saksnummer: saksnummer,
                modul: IATjenesteModuler[9],
                frist: new Date(),
                status: IASakLeveranseStatusEnum.enum.LEVERT,
                fullført: new Date(),
            },],
    },
    {
        iaTjeneste: IATjenester[2],
        leveranser: [
            {
                id: 11,
                saksnummer: saksnummer,
                modul: IATjenesteModuler[10],
                frist: new Date(),
                status: IASakLeveranseStatusEnum.enum.UNDER_ARBEID,
                fullført: null,
            }],
    }
]
