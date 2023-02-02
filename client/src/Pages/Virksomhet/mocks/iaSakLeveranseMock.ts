interface IATjeneste {
    id: number,
    navn: string,
}

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

interface IATjenesteModul {
    id: number,
    iaTjeneste: number,
    navn: string,
}

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
