import {ComponentMeta} from "@storybook/react";

import {StyledIaSakOversikt} from "./IASakOversikt";
import {iaSakIkkeAktuell, iaSakKontaktes, iaSakVurderesMedEier, iaSakVurderesUtenEier} from "./mocks/iaSakMock";

export default {
    title: "Virksomhet/Oversikt over IA-sak",
    component: StyledIaSakOversikt,
} as ComponentMeta<typeof StyledIaSakOversikt>;

export const IkkeAktiv = () => (
    <StyledIaSakOversikt />
);

export const VurderesUtenEier = () => (
    <StyledIaSakOversikt iaSak={iaSakVurderesUtenEier}/>
);

export const VurderesMedEierEier = () => (
    <StyledIaSakOversikt iaSak={iaSakVurderesMedEier}/>
);

export const Kontaktes = () => (
    <StyledIaSakOversikt iaSak={iaSakKontaktes}/>
);

export const IkkeAktuell = () => (
    <StyledIaSakOversikt iaSak={iaSakIkkeAktuell}/>
);
