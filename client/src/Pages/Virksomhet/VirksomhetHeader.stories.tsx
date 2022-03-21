import {ComponentMeta} from "@storybook/react";
import {Virksomhet, VirksomhetHeader} from "./VirksomhetHeader";

export default {
    title: "VirksomhetHeader",
    component: VirksomhetHeader,
} as ComponentMeta<typeof VirksomhetHeader>;

const virksomhet: Virksomhet = {
    orgnr: "999123456",
    adresse: ["c/o Haugenstua", "Stedet mitt", "0977 Livet min"],
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