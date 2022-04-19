import {ComponentMeta} from "@storybook/react";

import {StyledIASakshendelserOversikt} from "./IASakshendelserOversikt";
import {sakshendelserMock} from "./mocks/iaSakshendelserMock";

export default {
    title: "Virksomhet/Oversikt over hendelser på en IA-sak",
    component: StyledIASakshendelserOversikt,
} as ComponentMeta<typeof StyledIASakshendelserOversikt>;

export const FlereHendelser = () => (
    <StyledIASakshendelserOversikt sakshendelser={sakshendelserMock}/>
);


export const IngenHendelser = () => (
    <StyledIASakshendelserOversikt sakshendelser={[]}/>
);
