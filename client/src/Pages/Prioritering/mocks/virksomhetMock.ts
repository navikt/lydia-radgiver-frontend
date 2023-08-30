import {VirksomhetSøkeresultat} from "../../../domenetyper/domenetyper";
import { Virksomhet, VirksomhetStatusBrregEnum } from "../../../domenetyper/virksomhet";

export const virksomhetMock: Virksomhet = {
    orgnr: "999123456",
    adresse: ["Haugenstua 123", "Leilighet 501"],
    postnummer: "0187",
    poststed: "Oslo",
    navn: "Ola Halvorsen AS",
    næringsundergruppe1: {
        navn: "Offentlig administrasjon og forsvar, og trygdeordninger underlagt offentlig forvaltning",
        kode: "50.221"
    },
    næringsundergruppe2: {
        navn: "En annen næring",
        kode: "23.321"
    },
    næringsundergruppe3: {
        navn: "Produksjon av ikke-jernholdige metaller ellers",
        kode: "24.450"
    },
    sektor: "Privat og offentlig næringsvirksomhet",
    status: "AKTIV",
}

export const virksomhetAutocompleteMock: VirksomhetSøkeresultat[] = [
    {
        navn: "Kebabbiten",
        orgnr: "123123123"
    },
    {
        navn: "NAV",
        orgnr: "333333333"
    },
    {
        navn: "Polizen",
        orgnr: "666666666"
    },
    {
        navn: "Kongens undersotter",
        orgnr: "232323232"
    },
    {
        navn: "Haugenstua Kro",
        orgnr: "999999999"
    }
]

export const slettetVirksomhetMock: Virksomhet = {
    ...virksomhetMock,
    status: VirksomhetStatusBrregEnum.enum.SLETTET
}

export const fjernetVirksomhetMock: Virksomhet = {
    ...virksomhetMock,
    status: VirksomhetStatusBrregEnum.enum.FJERNET
}
