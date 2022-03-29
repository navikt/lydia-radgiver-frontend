import {ComponentMeta} from "@storybook/react";
import {StyledPrioriteringsTabell} from "./PrioriteringsTabell";
import {sykefraværsstatistikkMock} from "./mocks/sykefraværsstatistikkMock";

export default {
    title: "Prioriteringstabell",
    component: StyledPrioriteringsTabell,
} as ComponentMeta<typeof StyledPrioriteringsTabell>;

export const Hovedstory = () => (
    <StyledPrioriteringsTabell sykefraværsstatistikk={sykefraværsstatistikkMock}/>
);
