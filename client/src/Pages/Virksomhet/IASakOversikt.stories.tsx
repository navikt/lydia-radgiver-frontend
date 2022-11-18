import { ComponentMeta } from "@storybook/react";
import { useState } from "react";
import { rest } from "msw";
import { IASakOversikt } from "./IASakOversikt";
import {
    iaSakFullført,
    iaSakFullførtOgLukket,
    iaSakIkkeAktuell,
    iaSakKartlegges,
    iaSakKontaktes,
    iaSakViBistår,
    iaSakVurderesMedEier,
    iaSakVurderesUtenEier,
} from "./mocks/iaSakMock";
import { iaSakPath, iaSakPostNyHendelsePath } from "../../api/lydia-api";
import { FeilmeldingBanner } from "../FeilmeldingBanner";
import { IASak } from "../../domenetyper";

export default {
    title: "Virksomhet/Oversikt over IA-sak",
    component: IASakOversikt,
} as ComponentMeta<typeof IASakOversikt>;

const orgnummer = "987654321";

export const IkkeAktiv = () => {
    const [sak, setSak] = useState<IASak>()
    return <IASakOversikt orgnummer={orgnummer} iaSak={sak} muterState={() => {
        setSak(iaSakVurderesUtenEier)
    }
    } />;
};

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
    <IASakOversikt iaSak={iaSakVurderesMedEier} orgnummer={orgnummer} />
);

export const Kontaktes = () => (
    <IASakOversikt iaSak={iaSakKontaktes} orgnummer={orgnummer} />
);

export const IkkeAktuell = () => (
    <IASakOversikt iaSak={iaSakIkkeAktuell} orgnummer={orgnummer} />
);

export const Kartlegges = () => (
    <IASakOversikt iaSak={iaSakKartlegges} orgnummer={orgnummer} />
);

export const ViBistar = () => (
    <IASakOversikt iaSak={iaSakViBistår} orgnummer={orgnummer} />
);

export const Fullfort = () => (
    <IASakOversikt iaSak={iaSakFullført} orgnummer={orgnummer} />
);

export const FullfortOgLukket = () => (
    <IASakOversikt iaSak={iaSakFullførtOgLukket} orgnummer={orgnummer} />
);

export const IkkeAktivSomSuperbruker = () => {
    const [sak, setSak] = useState<IASak>()
    return <IASakOversikt orgnummer={orgnummer} iaSak={sak} muterState={() => {
        setSak(iaSakVurderesUtenEier)
    }
    } />;
};

IkkeAktivSomSuperbruker.parameters = {
    msw: {
        handlers: [
            rest.post(`${iaSakPath}/:orgnummer`, (req, res, ctx) => {
                return res(ctx.json(iaSakVurderesUtenEier));
            }),
        ],
    },
};

