import {Virksomhet} from "../../../domenetyper";

export const virksomhetMock: Virksomhet = {
    orgnr: "999123456",
    adresse: ["Haugenstua 123", "Leilighet 501"],
    postnummer: "0187",
    poststed: "Oslo",
    navn: "Ola Halvorsen AS",
    neringsgrupper: [
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
    ],
    sektor: "Privat og offentlig næringsvirksomhet"
}
