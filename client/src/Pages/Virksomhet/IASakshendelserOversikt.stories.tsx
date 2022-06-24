import {ComponentMeta} from "@storybook/react";

import {StyledSamarbeidshistorikk} from "./IASakshendelserOversikt";
import {samarbeidshistorikkMock} from "./mocks/iaSakHistorikkMock";

export default {
    title: "Virksomhet/Oversikt over hendelser på en IA-sak",
    component: StyledSamarbeidshistorikk,
} as ComponentMeta<typeof StyledSamarbeidshistorikk>;

export const FlereHendelser = () => (
    <StyledSamarbeidshistorikk samarbeidshistorikk={samarbeidshistorikkMock}/>
);


export const IngenHendelser = () => (
    <StyledSamarbeidshistorikk samarbeidshistorikk={[]}/>
);
