import { ComponentMeta } from "@storybook/react";
import { fjernetVirksomhetMock, slettetVirksomhetMock, virksomhetMock } from "../Prioritering/mocks/virksomhetMock";
import { VirksomhetsVisning } from "./VirksomhetsVisning";
import { iaSakFullførtOgLukket, iaSakKontaktes } from "./mocks/iaSakMock";
import { samarbeidshistorikkMock, samarbeidshistorikkMockMedFlereSaker } from "./mocks/iaSakHistorikkMock";

export default {
    title: "Virksomhet/Visning av en virksomhet",
    component: VirksomhetsVisning,
} as ComponentMeta<typeof VirksomhetsVisning>;

export const EnSak = () => (
    <VirksomhetsVisning
        virksomhet={virksomhetMock}
        iaSak={iaSakKontaktes}
        samarbeidshistorikk={samarbeidshistorikkMock}
    />
);

export const FlereSaker = () => (
    <VirksomhetsVisning
        virksomhet={virksomhetMock}
        iaSak={iaSakKontaktes}
        samarbeidshistorikk={
            samarbeidshistorikkMockMedFlereSaker
        }
    />
);

export const VirksomhetSomErSlettet = () => (
    <VirksomhetsVisning
        virksomhet={slettetVirksomhetMock}
        iaSak={iaSakKontaktes}
        samarbeidshistorikk={samarbeidshistorikkMock}
    />
);

export const VirksomhetSomErFjernet = () => (
    <VirksomhetsVisning
        virksomhet={fjernetVirksomhetMock}
        iaSak={iaSakKontaktes}
        samarbeidshistorikk={samarbeidshistorikkMock}
    />
);

export const VirksomhetMedSakSomErLukket = () => (
    <VirksomhetsVisning
        virksomhet={virksomhetMock}
        iaSak={iaSakFullførtOgLukket}
        samarbeidshistorikk={samarbeidshistorikkMock}
    />
);
