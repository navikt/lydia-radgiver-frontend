import {ComponentMeta} from "@storybook/react";
import {virksomhetMock} from "../Prioritering/mocks/virksomhetMock";
import {VirksomhetOversikt} from "./VirksomhetOversikt";
import {sykefraværsstatistikkMock} from "../Prioritering/mocks/sykefraværsstatistikkMock";
import {iaSakKontaktes} from "./mocks/iaSakMock";
import {samarbeidshistorikkMock, samarbeidshistorikkMockMedFlereSaker} from "./mocks/iaSakHistorikkMock";

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
