import {ComponentMeta} from "@storybook/react";

import {StyledIaSakOversikt} from "./IASakOversikt";
import {iaSakIkkeAktuell, iaSakKontaktes, iaSakVurderesMedEier, iaSakVurderesUtenEier} from "./mocks/iaSakMock";
import {rest} from "msw";
import {iaSakPath, iaSakPostNyHendelsePath} from "../../api/lydia-api";

export default {
    title: "Virksomhet/Oversikt over IA-sak",
    component: StyledIaSakOversikt,
} as ComponentMeta<typeof StyledIaSakOversikt>;

const orgnummer = "987654321"

export const IkkeAktiv = () => (
    <StyledIaSakOversikt orgnummer={"987654321"}/>
);

IkkeAktiv.parameters = {
    msw: {
        handlers: [
            rest.post(`${iaSakPath}/:orgnummer`, (req, res, ctx) => {
                return res(
                    ctx.json(iaSakVurderesUtenEier)
                )
            }),
        ]
    },
}

export const VurderesUtenEier = () => (
    <StyledIaSakOversikt iaSak={iaSakVurderesUtenEier} orgnummer={orgnummer}/>
);

VurderesUtenEier.parameters = {
    msw: {
        handlers: [
            rest.post(`${iaSakPostNyHendelsePath}`, (req, res, ctx) => {
                return res(
                    ctx.json(iaSakVurderesMedEier)
                )
            }),
        ]
    },
}

export const VurderesMedEierEier = () => (
    <StyledIaSakOversikt iaSak={iaSakVurderesMedEier} orgnummer={"987654321"}/>
);

export const Kontaktes = () => (
    <StyledIaSakOversikt iaSak={iaSakKontaktes} orgnummer={"987654321"}/>
);

export const IkkeAktuell = () => (
    <StyledIaSakOversikt iaSak={iaSakIkkeAktuell} orgnummer={"987654321"}/>
);
