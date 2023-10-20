import { Meta, StoryObj } from "@storybook/react";
import { IASakOversikt } from "./IASakOversikt";
import {
    iaSakFullført,
    iaSakFullførtOgLukket,
    iaSakIkkeAktuell,
    iaSakIngenAktivitetPåOverEtKvartal,
    iaSakKartlegges,
    iaSakKontaktes,
    iaSakViBistår,
    iaSakVurderesMedEier,
    iaSakVurderesUtenEier,
} from "../../mocks/iaSakMock";
import { mswHandlers } from "../../../../../.storybook/mswHandlers";
import { rest } from "msw";
import { iaSakPath } from "../../../../api/lydia-api";

const meta = {
    title: "Virksomhet/Virksomhetsoversikt/IA-sak-oversikt (statusfelt)",
    component: IASakOversikt,
    parameters: {
        backgrounds: {
            default: "white",
        },
    },
} satisfies Meta<typeof IASakOversikt>;

export default meta;
type Story = StoryObj<typeof meta>;

export const IkkeAktiv: Story = {
    args: {
        orgnummer: "987654321",
    },
    parameters: {
        msw: [
            ...mswHandlers,
            rest.get(`${iaSakPath}/:orgnummer/aktiv`, (req, res, ctx) => {
                return res(ctx.json(iaSakViBistår));
            }),
        ],
    },
};

export const VurderesUtenEier: Story = {
    args: {
        ...IkkeAktiv.args,
        iaSak: iaSakVurderesUtenEier,
    },
    parameters: {
        msw: [
            ...mswHandlers,
            rest.get(`${iaSakPath}/:orgnummer/aktiv`, (req, res, ctx) => {
                return res(ctx.json(iaSakVurderesUtenEier));
            }),
        ],
    },
};

export const VurderesMedEierEier = {
    args: {
        ...IkkeAktiv.args,
        iaSak: iaSakVurderesMedEier,
    },
    parameters: {
        msw: [
            ...mswHandlers,
            rest.get(`${iaSakPath}/:orgnummer/aktiv`, (req, res, ctx) => {
                return res(ctx.json(iaSakVurderesMedEier));
            }),
        ],
    },
};

export const Kontaktes = {
    args: {
        ...IkkeAktiv.args,
        iaSak: iaSakKontaktes,
    },
    parameters: {
        msw: [
            ...mswHandlers,
            rest.get(`${iaSakPath}/:orgnummer/aktiv`, (req, res, ctx) => {
                return res(ctx.json(iaSakKontaktes));
            }),
        ],
    },
};

export const IkkeAktuell = {
    args: {
        ...IkkeAktiv.args,
        iaSak: iaSakIkkeAktuell,
    },
    parameters: {
        msw: [
            ...mswHandlers,
            rest.get(`${iaSakPath}/:orgnummer/aktiv`, (req, res, ctx) => {
                return res(ctx.json(iaSakIkkeAktuell));
            }),
        ],
    },
};

export const Kartlegges = {
    args: {
        ...IkkeAktiv.args,
        iaSak: iaSakKartlegges,
    },
    parameters: {
        msw: [
            ...mswHandlers,
            rest.get(`${iaSakPath}/:orgnummer/aktiv`, (req, res, ctx) => {
                return res(ctx.json(iaSakKartlegges));
            }),
        ],
    },
};

export const ViBistar = {
    args: {
        ...IkkeAktiv.args,
        iaSak: iaSakViBistår,
    },
    parameters: {
        msw: [
            ...mswHandlers,
            rest.get(`${iaSakPath}/:orgnummer/aktiv`, (req, res, ctx) => {
                return res(ctx.json(iaSakViBistår));
            }),
        ],
    },
};

export const Fullfort = {
    args: {
        ...IkkeAktiv.args,
        iaSak: iaSakFullført,
    },
    parameters: {
        msw: [
            ...mswHandlers,
            rest.get(`${iaSakPath}/:orgnummer/aktiv`, (req, res, ctx) => {
                return res(ctx.json(iaSakFullført));
            }),
        ],
    },
};

export const FullfortOgLukket = {
    args: {
        ...IkkeAktiv.args,
        iaSak: iaSakFullførtOgLukket,
    },
    parameters: {
        msw: [
            ...mswHandlers,
            rest.get(`${iaSakPath}/:orgnummer/aktiv`, (req, res, ctx) => {
                return res(ctx.json(iaSakFullførtOgLukket));
            }),
        ],
    },
};

export const IngenAktivitetPaLenge = {
    args: {
        ...IkkeAktiv.args,
        iaSak: iaSakIngenAktivitetPåOverEtKvartal,
    },
    parameters: {
        msw: [
            ...mswHandlers,
            rest.get(`${iaSakPath}/:orgnummer/aktiv`, (req, res, ctx) => {
                return res(ctx.json(iaSakIngenAktivitetPåOverEtKvartal));
            }),
        ],
    },
};
