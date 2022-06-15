import {ComponentMeta} from "@storybook/react";
import {StyledPrioriteringsTabell} from "./PrioriteringsTabell";
import {sykefraværsstatistikkMock} from "./mocks/sykefraværsstatistikkMock";
import {useState} from "react";

export default {
    title: "Prioritering/Prioriteringstabell",
    component: StyledPrioriteringsTabell,
} as ComponentMeta<typeof StyledPrioriteringsTabell>;

function repeatArray<T>(arr : T[], repeats : number) : T[] {
    return Array.from({ length: repeats }, () => arr).flat();
}

export const Hovedstory = () => {
    const sykefraværsstatistikk = repeatArray(sykefraværsstatistikkMock, 5)
    const antallPerSide = 5
    const totaltAntallResultaterISøk = sykefraværsstatistikk.length
    const [side, setSide] = useState(1)
    return (
        <StyledPrioriteringsTabell
            sykefraværsstatistikk={sykefraværsstatistikk.slice((side - 1) * antallPerSide, side * antallPerSide)}
            endreSide={(side) => {
                setSide(side)
            }}
            side={side}
            totaltAntallResultaterISøk={totaltAntallResultaterISøk}
        />
    );
};
