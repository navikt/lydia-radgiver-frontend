import {ComponentMeta} from "@storybook/react";

import {StyledIASakshendelserOversikt} from "./IASakshendelserOversikt";
import {opprettelseHendelse, taEierskapHendelse, vurderesHendelse, kontaktesHendelse} from "./mocks/iaSakshendelserMock";

export default {
    title: "Virksomhet/Oversikt over hendelser på en IA-sak",
    component: StyledIASakshendelserOversikt,
} as ComponentMeta<typeof StyledIASakshendelserOversikt>;

export const FlereHendelser = () => (
    <StyledIASakshendelserOversikt sakshendelser={[
        opprettelseHendelse,
        vurderesHendelse,
        taEierskapHendelse,
        kontaktesHendelse
    ]}/>
);


export const IngenHendelser = () => (
    <StyledIASakshendelserOversikt sakshendelser={[]}/>
);
