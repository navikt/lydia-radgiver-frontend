import { ComponentMeta } from "@storybook/react";

import {BegrunnelseModal} from "./BegrunnelseModal";
import {Modal} from "@navikt/ds-react";

Modal.setAppElement = () => null;

export default {
    title: "Virksomhet/Begrunnelse for å velge 'Ikke aktuell'",
    component: BegrunnelseModal,
} as ComponentMeta<typeof BegrunnelseModal>;

export const BegrunnelseModalStory = () => (
    <BegrunnelseModal/>
);


