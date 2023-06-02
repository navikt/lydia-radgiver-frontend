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

const meta = {
    title: "Virksomhet/Virksomhetsoversikt/IA-sak-oversikt (statusfelt)",
    component: IASakOversikt,
    parameters: {
        backgrounds: {
            default: 'white'
        }
    }
} satisfies Meta<typeof IASakOversikt>;

export default meta;
type Story = StoryObj<typeof meta>;

export const IkkeAktiv: Story = {
    args: {
        orgnummer: "987654321",
    },
};

export const VurderesUtenEier: Story = {
    args: {
        ...IkkeAktiv.args,
        iaSak: iaSakVurderesUtenEier,
    },
};

export const VurderesMedEierEier = {
    args: {
        ...IkkeAktiv.args,
        iaSak: iaSakVurderesMedEier,
    }
};

export const Kontaktes = {
    args: {
        ...IkkeAktiv.args,
        iaSak: iaSakKontaktes,
    }
};


export const IkkeAktuell = {
    args: {
        ...IkkeAktiv.args,
        iaSak: iaSakIkkeAktuell,
    }
};

export const Kartlegges = {
    args: {
        ...IkkeAktiv.args,
        iaSak: iaSakKartlegges,
    }
};

export const ViBistar = {
    args: {
        ...IkkeAktiv.args,
        iaSak: iaSakViBistår,
    }
};

export const Fullfort = {
    args: {
        ...IkkeAktiv.args,
        iaSak: iaSakFullført,
    }
};

export const FullfortOgLukket = {
    args: {
        ...IkkeAktiv.args,
        iaSak: iaSakFullførtOgLukket,
    }
};

export const IngenAktivitetPaLenge: Story = {
    args: {
        ...IkkeAktiv.args,
        iaSak: iaSakIngenAktivitetPåOverEtKvartal,
    }
}
