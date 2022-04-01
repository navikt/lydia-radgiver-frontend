import {ComponentMeta} from "@storybook/react";
import {VirksomhetHeader} from "./VirksomhetHeader";
import {Virksomhet} from "../../domenetyper";

export default {
    title: "VirksomhetHeader",
    component: VirksomhetHeader,
} as ComponentMeta<typeof VirksomhetHeader>;

const virksomhet: Virksomhet = {
    organisasjonsnummer: "999123456",
    beliggenhetsadresse: ["c/o Haugenstua", "Stedet mitt", "0977 Livet min"],
    navn: "Ola Halvorsen",
    neringsgrupper: [
        {
            navn: "Offentlig administrasjon og forsvar, og trygdeordninger underlagt offentlig forvaltning",
            kode: "50.221"
        }
    ]
}

export const Header = () => (
    <VirksomhetHeader virksomhet={virksomhet}/>
);