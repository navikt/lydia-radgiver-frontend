import { ComponentMeta } from "@storybook/react";
import { fjernetVirksomhetMock, slettetVirksomhetMock, virksomhetMock } from "../Prioritering/mocks/virksomhetMock";
import { VirksomhetsVisning } from "./VirksomhetsVisning";

export default {
    title: "Virksomhet/Visning av en virksomhet",
    component: VirksomhetsVisning,
} as ComponentMeta<typeof VirksomhetsVisning>;

export const Hovedstory = () => (
    <VirksomhetsVisning
        virksomhet={virksomhetMock}
        // iaSak={iaSakKontaktes}
    />
);

export const VirksomhetSomErSlettet = () => (
    <VirksomhetsVisning
        virksomhet={slettetVirksomhetMock}
        // iaSak={iaSakKontaktes}
    />
);

export const VirksomhetSomErFjernet = () => (
    <VirksomhetsVisning
        virksomhet={fjernetVirksomhetMock}
        // iaSak={iaSakKontaktes}
    />
);

export const VirksomhetMedSakSomErLukket = () => (
    <VirksomhetsVisning
        virksomhet={virksomhetMock}
        // iaSak={iaSakFullførtOgLukket}
    />
);
