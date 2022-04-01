import {ComponentMeta} from "@storybook/react";
import {VirksomhetHeader} from "./VirksomhetHeader";
import {Virksomhet} from "../../domenetyper";

export default {
    title: "VirksomhetHeader",
    component: VirksomhetHeader,
} as ComponentMeta<typeof VirksomhetHeader>;

const virksomhet: Virksomhet = {
    orgnr: "999123456",
    adresse: ["c/o Haugenstua", "Stedet mitt"],
    postnummer: "0977",
    poststed: "Livet min",
    navn: "Ola Halvorsen",
    neringsgrupper: [
        {
            navn: "Offentlig administrasjon og forsvar, og trygdeordninger underlagt offentlig forvaltning",
            kode: "50.221"
        },
        {
            navn: "En annen næring",
            kode: "23.321"
        }
    ]
}

export const Header = () => (
    <VirksomhetHeader virksomhet={virksomhet}/>
);