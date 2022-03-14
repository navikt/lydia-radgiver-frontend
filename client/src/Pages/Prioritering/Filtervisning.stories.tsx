import { ComponentMeta } from "@storybook/react";
import Filtervisning from "./Filtervisning";
import { filterverdierMock } from "./filterverdierMock";
import "@navikt/ds-css";

export default {
  title: "Filtervisning",
  component: Filtervisning,
} as ComponentMeta<typeof Filtervisning>;

export const Hovedstory = () => (
  <Filtervisning
    filterverdier={filterverdierMock}
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    oppdaterSøkeverdier={() => {}}
  />
);
