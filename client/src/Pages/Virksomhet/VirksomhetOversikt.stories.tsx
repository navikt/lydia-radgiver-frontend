import { ComponentMeta } from "@storybook/react";
import { fjernetVirksomhetMock, slettetVirksomhetMock, virksomhetMock } from "../Prioritering/mocks/virksomhetMock";
import { VirksomhetOversikt } from "./VirksomhetOversikt";
import { sykefraværsstatistikkMock } from "../Prioritering/mocks/sykefraværsstatistikkMock";
import {iaSakFullførtOgLukket, iaSakKontaktes} from "./mocks/iaSakMock";
import { samarbeidshistorikkMock, samarbeidshistorikkMockMedFlereSaker } from "./mocks/iaSakHistorikkMock";

export default {
    title: "Virksomhet/Oversikt over en virksomhet",
    component: VirksomhetOversikt,
} as ComponentMeta<typeof VirksomhetOversikt>;

export const EnSak = () => (
    <VirksomhetOversikt
        virksomhet={virksomhetMock}
        sykefraværsstatistikk={sykefraværsstatistikkMock[0]}
        iaSak={iaSakKontaktes}
        samarbeidshistorikk={samarbeidshistorikkMock}
    />
);

export const FlereSaker = () => (
    <VirksomhetOversikt
        virksomhet={virksomhetMock}
        sykefraværsstatistikk={sykefraværsstatistikkMock[0]}
        iaSak={iaSakKontaktes}
        samarbeidshistorikk={
            samarbeidshistorikkMockMedFlereSaker
        }
    />
);

export const VirksomhetSomErSlettet = () => (
    <VirksomhetOversikt
        virksomhet={slettetVirksomhetMock}
        sykefraværsstatistikk={sykefraværsstatistikkMock[0]}
        iaSak={iaSakKontaktes}
        samarbeidshistorikk={samarbeidshistorikkMock}
    />
);

export const VirksomhetSomErFjernet = () => (
    <VirksomhetOversikt
        virksomhet={fjernetVirksomhetMock}
        sykefraværsstatistikk={sykefraværsstatistikkMock[0]}
        iaSak={iaSakKontaktes}
        samarbeidshistorikk={samarbeidshistorikkMock}
    />
);

export const VirksomhetMedSakSomErLukket = () => (
    <VirksomhetOversikt
        virksomhet={virksomhetMock}
        sykefraværsstatistikk={sykefraværsstatistikkMock[0]}
        iaSak={iaSakFullførtOgLukket}
        samarbeidshistorikk={samarbeidshistorikkMock}
    />
);
