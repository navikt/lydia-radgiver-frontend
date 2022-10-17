import { ComponentMeta } from "@storybook/react";
import { Paginering } from "./Paginering";
import { useState } from "react";
import { ANTALL_RESULTATER_PER_SIDE } from "./Prioriteringsside";

export default {
    title: "Prioritering/Paginering",
    component: Paginering,
} as ComponentMeta<typeof Paginering>;

export const Hovedstory = () => {
    const [side, setSide] = useState(1);
    const antallTreffPåSide = side === 10 ? 10 : ANTALL_RESULTATER_PER_SIDE;

    const endreSide = (side: number) => {
        setSide(side)
    }

    return <Paginering side={side} endreSide={endreSide} antallTreffPåSide={antallTreffPåSide} />
}
