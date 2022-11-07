import { ComponentMeta } from "@storybook/react";
import { AntallArbeidsforholdVelger } from "./AntallArbeidsforholdVelger";

export default {
    title: "Prioritering/Antall arbeidsforhold-velger",
    component: AntallArbeidsforholdVelger,
} as ComponentMeta<typeof AntallArbeidsforholdVelger>

export const Hovedstory = () => (
    <AntallArbeidsforholdVelger
        antallArbeidsforhold={{fra: NaN, til: NaN}}
        endreAntallArbeidsforhold={() => { return }}
    />
)
