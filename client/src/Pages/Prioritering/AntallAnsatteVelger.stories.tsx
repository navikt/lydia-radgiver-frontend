import {AntallAnsatteVelger} from "./AntallAnsatteVelger";
import {ComponentMeta} from "@storybook/react";

export default {
    title: "Prioritering/Antall ansatte velger",
    component: AntallAnsatteVelger,
} as ComponentMeta<typeof AntallAnsatteVelger>

// eslint-disable-next-line @typescript-eslint/no-empty-function,@typescript-eslint/no-unused-vars
export const Hovedstory = () => (<AntallAnsatteVelger  antallAnsatte={{fra:NaN, til:NaN}} endreAntallAnsatte={(_) => {}}/>)
