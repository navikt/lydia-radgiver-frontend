import { ulid } from "ulid";
import {
    IASakLeveranse,
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

export const iaSakLeveranser: IASakLeveranse[] = [
    {
        id: 1,
        saksnummer: saksnummer,
        modul: {
            id: IATjenesteModuler[0].id,
            iaTjeneste: IATjenester[0],
            navn: IATjenesteModuler[0].navn
        },
        frist: new Date(),
        status: IASakLeveranseStatusEnum.enum.UNDER_ARBEID,
    }, {
        id: 2,
        saksnummer: saksnummer,
        modul: {
            id: IATjenesteModuler[1].id,
            iaTjeneste: IATjenester[0],
            navn: IATjenesteModuler[1].navn
        },
        frist: new Date(),
        status: IASakLeveranseStatusEnum.enum.UNDER_ARBEID,
    }, {
        id: 3,
        saksnummer: saksnummer,
        modul: {
            id: IATjenesteModuler[2].id,
            iaTjeneste: IATjenester[0],
            navn: IATjenesteModuler[2].navn
        },
        frist: new Date(),
        status: IASakLeveranseStatusEnum.enum.UNDER_ARBEID,
    }, {
        id: 4,
        saksnummer: saksnummer,
        modul: {
            id: IATjenesteModuler[3].id,
            iaTjeneste: IATjenester[0],
            navn: IATjenesteModuler[3].navn
        },
        frist: new Date(),
        status: IASakLeveranseStatusEnum.enum.LEVERT,
    }, {
        id: 5,
        saksnummer: saksnummer,
        modul: {
            id: IATjenesteModuler[4].id,
            iaTjeneste: IATjenester[1],
            navn: IATjenesteModuler[4].navn
        },
        frist: new Date(),
        status: IASakLeveranseStatusEnum.enum.UNDER_ARBEID,
    }, {
        id: 6,
        saksnummer: saksnummer,
        modul: {
            id: IATjenesteModuler[5].id,
            iaTjeneste: IATjenester[1],
            navn: IATjenesteModuler[5].navn
        },
        frist: new Date(),
        status: IASakLeveranseStatusEnum.enum.UNDER_ARBEID,
    }, {
        id: 7,
        saksnummer: saksnummer,
        modul: {
            id: IATjenesteModuler[6].id,
            iaTjeneste: IATjenester[1],
            navn: IATjenesteModuler[6].navn
        },
        frist: new Date(),
        status: IASakLeveranseStatusEnum.enum.UNDER_ARBEID,
    }, {
        id: 8,
        saksnummer: saksnummer,
        modul: {
            id: IATjenesteModuler[7].id,
            iaTjeneste: IATjenester[1],
            navn: IATjenesteModuler[7].navn
        },
        frist: new Date(),
        status: IASakLeveranseStatusEnum.enum.UNDER_ARBEID,
    }, {
        id: 9,
        saksnummer: saksnummer,
        modul: {
            id: IATjenesteModuler[8].id,
            iaTjeneste: IATjenester[1],
            navn: IATjenesteModuler[8].navn
        },
        frist: new Date(),
        status: IASakLeveranseStatusEnum.enum.UNDER_ARBEID,
    }, {
        id: 10,
        saksnummer: saksnummer,
        modul: {
            id: IATjenesteModuler[9].id,
            iaTjeneste: IATjenester[1],
            navn: IATjenesteModuler[9].navn
        },
        frist: new Date(),
        status: IASakLeveranseStatusEnum.enum.LEVERT,
    }, {
        id: 11,
        saksnummer: saksnummer,
        modul: {
            id: IATjenesteModuler[10].id,
            iaTjeneste: IATjenester[2],
            navn: IATjenesteModuler[10].navn
        },
        frist: new Date(),
        status: IASakLeveranseStatusEnum.enum.UNDER_ARBEID,
    },
]
