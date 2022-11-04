import { ComponentMeta } from "@storybook/react";

import { Samarbeidshistorikk } from "./IASakshendelserOversikt";
import { samarbeidshistorikkMock } from "./mocks/iaSakHistorikkMock";

export default {
    title: "Virksomhet/Oversikt over hendelser på en IA-sak",
    component: Samarbeidshistorikk,
} as ComponentMeta<typeof Samarbeidshistorikk>;

export const FlereHendelser = () => (
    <Samarbeidshistorikk samarbeidshistorikk={samarbeidshistorikkMock} />
);


export const IngenHendelser = () => (
    <Samarbeidshistorikk samarbeidshistorikk={[]} />
);
