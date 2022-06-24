import {ComponentMeta} from "@storybook/react";
import { StyledFiltervisning } from "./Filtervisning";
import {filterverdierMock} from "./mocks/filterverdierMock";
import "@navikt/ds-css";

export default {
    title: "Prioritering/Filtervisning",
    component: StyledFiltervisning,
} as ComponentMeta<typeof StyledFiltervisning>;

export const Hovedstory = () => (
    <StyledFiltervisning
        // eslint-disable-next-line @typescript-eslint/no-empty-function
        søkPåNytt={() => {}}
        filterverdier={filterverdierMock}
        // eslint-disable-next-line @typescript-eslint/no-empty-function
        oppdaterSøkeverdier={() => {}}
    />
);
