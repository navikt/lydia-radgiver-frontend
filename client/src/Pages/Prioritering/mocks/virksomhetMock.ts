import {Virksomhet} from "../../Virksomhet/VirksomhetHeader";

export const virksomhetMock: Virksomhet = {
    orgnr: "999123456",
    adresse: ["c/o Haugenstua", "Stedet mitt", "0977 Livet min"],
    navn: "Seriøs Business",
    neringsgrupper: [
        {
            navn: "Offentlig administrasjon og forsvar, og trygdeordninger underlagt offentlig forvaltning",
            kode: "50.221"
        }
    ]
}
