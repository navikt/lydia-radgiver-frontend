import {ComponentMeta} from "@storybook/react";
import {PrioriteringsTabell} from "./PrioriteringsTabell";
import {sykefraværsstatistikkMock} from "./mocks/sykefraværsstatistikkMock";

export default {
    title: "Prioriteringstabell",
    component: PrioriteringsTabell,
} as ComponentMeta<typeof PrioriteringsTabell>;

export const Hovedstory = () => (
    <PrioriteringsTabell sykefraværsstatistikk={sykefraværsstatistikkMock}/>
);