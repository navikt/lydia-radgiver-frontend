import {ComponentMeta} from "@storybook/react";
import Filtervisning from "./Filtervisning";
import {filterverdierMock} from "./mocks/filterverdierMock";
import "@navikt/ds-css";

export default {
    title: "Filtervisning",
    component: Filtervisning,
} as ComponentMeta<typeof Filtervisning>;

export const Hovedstory = () => (
    <Filtervisning
        søkPåNytt={() => {}}
        filterverdier={filterverdierMock}
        // eslint-disable-next-line @typescript-eslint/no-empty-function
        oppdaterSøkeverdier={() => {
        }}
    />
);
