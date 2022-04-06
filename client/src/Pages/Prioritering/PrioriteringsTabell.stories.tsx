import {ComponentMeta} from "@storybook/react";
import {StyledPrioriteringsTabell} from "./PrioriteringsTabell";
import {sykefraværsstatistikkMock} from "./mocks/sykefraværsstatistikkMock";
import {useState} from "react";

export default {
    title: "Prioritering/Prioriteringstabell",
    component: StyledPrioriteringsTabell,
} as ComponentMeta<typeof StyledPrioriteringsTabell>;
export const Hovedstory = () => {
    const antallSider = 4
    const antalPerSide = 5
    const [side, setSide] = useState(1)
    return (
        <StyledPrioriteringsTabell
            sykefraværsstatistikk={sykefraværsstatistikkMock.slice((side - 1) * antalPerSide, side * antalPerSide)}
            endreSide={(side) => {
                setSide(side)
            }}
            side={side}
            antallSider={antallSider}
        />
    );
};
