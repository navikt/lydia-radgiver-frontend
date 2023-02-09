import {ComponentMeta} from "@storybook/react";
import { PeriodeVelger } from "./PeriodeVelger";

export default {
    title: "Periode velger",
    component: PeriodeVelger,
} as ComponentMeta<typeof PeriodeVelger>;

export const Hovedstory = () => (<PeriodeVelger erSynlig={true} endrePeriode={() => {console.log} } />)
