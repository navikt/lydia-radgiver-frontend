import { ComponentMeta } from "@storybook/react";

import { Samarbeidshistorikk } from "./Samarbeidshistorikk";
import { samarbeidshistorikkMock } from "../mocks/iaSakHistorikkMock";

export default {
    title: "Virksomhet/Samarbeidshistorikk for en IA-sak",
    component: Samarbeidshistorikk,
} as ComponentMeta<typeof Samarbeidshistorikk>;

export const FlereHendelser = () => (
    <Samarbeidshistorikk samarbeidshistorikk={samarbeidshistorikkMock} />
);


export const IngenHendelser = () => (
    <Samarbeidshistorikk samarbeidshistorikk={[]} />
);
