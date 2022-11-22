import { ComponentMeta, ComponentStory } from "@storybook/react";
import { useState } from "react";
import { rest } from "msw";
import { IASakOversikt, IASakOversiktProps } from "./IASakOversikt";
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
    return (
        <IASakOversikt
            orgnummer={orgnummer}
            iaSak={sak}
            muterState={() => {setSak(iaSakVurderesUtenEier)}}
        />
    );
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

const Template: ComponentStory<typeof IASakOversikt> = ({iaSak}: IASakOversiktProps) => {
    return <IASakOversikt iaSak={iaSak} orgnummer={orgnummer} />
}

export const VurderesMedEierEier = Template.bind({});
VurderesMedEierEier.args = {iaSak: iaSakVurderesMedEier};

export const Kontaktes = Template.bind({});
Kontaktes.args = {iaSak: iaSakKontaktes};

export const IkkeAktuell = Template.bind({});
IkkeAktuell.args = {iaSak: iaSakIkkeAktuell};

export const Kartlegges = Template.bind({});
Kartlegges.args = {iaSak: iaSakKartlegges};

export const ViBistar = Template.bind({});
ViBistar.args = {iaSak: iaSakViBistår};

export const Fullfort = Template.bind({});
Fullfort.args = {iaSak: iaSakFullført};

export const FullfortOgLukket = Template.bind({});
FullfortOgLukket.args = {iaSak: iaSakFullførtOgLukket};


export const IkkeAktivSomSuperbruker = () => {
    const [sak, setSak] = useState<IASak>()
    return (
        <IASakOversikt
            orgnummer={orgnummer}
            iaSak={sak}
            muterState={() => {setSak(iaSakVurderesUtenEier)}}
        />
    );
};
