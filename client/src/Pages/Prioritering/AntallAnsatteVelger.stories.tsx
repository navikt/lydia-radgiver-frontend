import {AntallAnsatteVelger} from "./AntallAnsatteVelger";
import {ComponentMeta} from "@storybook/react";

export default {
    title: "Prioritering/Antall ansatte velger",
    component: AntallAnsatteVelger,
} as ComponentMeta<typeof AntallAnsatteVelger>

export const Hovedstory = () => (<AntallAnsatteVelger  antallAnsatte={{fra:NaN, til:NaN}} endreAntallAnsatte={(_) => {}}/>)