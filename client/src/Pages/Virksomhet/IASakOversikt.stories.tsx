import { ComponentMeta } from "@storybook/react";

import { IASakOversikt } from "./IASakOversikt";
import {
    iaSakIkkeAktuell,
    iaSakKontaktes,
    iaSakVurderesMedEier,
    iaSakVurderesUtenEier,
} from "./mocks/iaSakMock";
import { rest } from "msw";
import { iaSakPath, iaSakPostNyHendelsePath } from "../../api/lydia-api";
import { FeilmeldingBanner } from "../FeilmeldingBanner";

export default {
    title: "Virksomhet/Oversikt over IA-sak",
    component: IASakOversikt,
} as ComponentMeta<typeof IASakOversikt>;

const orgnummer = "987654321";

export const IkkeAktiv = () => <IASakOversikt orgnummer={"987654321"} />;

IkkeAktiv.parameters = {
    msw: {
        handlers: [
            rest.post(`${iaSakPath}/:orgnummer`, (req, res, ctx) => {
                return res(ctx.json(iaSakVurderesUtenEier));
            }),
        ],
    },
};

export const VurderesUtenEier = () => (
    <IASakOversikt iaSak={iaSakVurderesUtenEier} orgnummer={orgnummer} />
);

VurderesUtenEier.parameters = {
    msw: {
        handlers: [
            rest.post(`${iaSakPostNyHendelsePath}`, (req, res, ctx) => {
                return res(ctx.json(iaSakVurderesMedEier));
            }),
        ],
    },
};

export const VurderesUtenEierMedFeilmelding = () => (
    <>
        <FeilmeldingBanner />
        <IASakOversikt iaSak={iaSakVurderesUtenEier} orgnummer={orgnummer} />
    </>
);

VurderesUtenEierMedFeilmelding.parameters = {
    msw: {
        handlers: [
            rest.post(`${iaSakPath}/:orgnummer`, (req, res, ctx) => {
                return res(ctx.status(415, "Dette er ikke lov........."));
            }),
        ],
    },
};

export const VurderesMedEierEier = () => (
    <IASakOversikt iaSak={iaSakVurderesMedEier} orgnummer={"987654321"} />
);

export const Kontaktes = () => (
    <IASakOversikt iaSak={iaSakKontaktes} orgnummer={"987654321"} />
);

export const IkkeAktuell = () => (
    <IASakOversikt iaSak={iaSakIkkeAktuell} orgnummer={"987654321"} />
);
