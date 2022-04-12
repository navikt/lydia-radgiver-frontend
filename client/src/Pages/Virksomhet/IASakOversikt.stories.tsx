import {ComponentMeta} from "@storybook/react";

import {StyledIaSakOversikt} from "./IASakOversikt";
import {iaSakIkkeAktuell, iaSakKontaktes, iaSakVurderes} from "./mocks/iaSakMock";

export default {
    title: "Virksomhet/Oversikt over IA-sak",
    component: StyledIaSakOversikt,
} as ComponentMeta<typeof StyledIaSakOversikt>;

export const IkkeAktiv = () => (
    <StyledIaSakOversikt />
);

export const Vurderes = () => (
    <StyledIaSakOversikt iaSak={iaSakVurderes}/>
);

export const Kontaktes = () => (
    <StyledIaSakOversikt iaSak={iaSakKontaktes}/>
);

export const IkkeAktuell = () => (
    <StyledIaSakOversikt iaSak={iaSakIkkeAktuell}/>
);
