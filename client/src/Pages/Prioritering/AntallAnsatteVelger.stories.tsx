import {AntallArbeidsforholdVelger} from "./AntallArbeidsforholdVelger";
import {ComponentMeta} from "@storybook/react";

export default {
    title: "Prioritering/Antall ansatte velger",
    component: AntallArbeidsforholdVelger,
} as ComponentMeta<typeof AntallArbeidsforholdVelger>

// eslint-disable-next-line @typescript-eslint/no-empty-function,@typescript-eslint/no-unused-vars
export const Hovedstory = () => (<AntallArbeidsforholdVelger antallArbeidsforhold={{fra:NaN, til:NaN}} endreAntallArbeidsforhold={(_) => {}}/>)
