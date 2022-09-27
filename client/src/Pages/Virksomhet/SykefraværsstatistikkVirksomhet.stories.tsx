import { ComponentMeta } from "@storybook/react";
import { sykefraværsstatistikkMock } from "../Prioritering/mocks/sykefraværsstatistikkMock";
import { SykefraværsstatistikkVirksomhet } from "./SykefraværsstatistikkVirksomhet";

export default {
    title: "Virksomhet/Sykefraværsstatistikk for en virksomhet",
    component: SykefraværsstatistikkVirksomhet,
} as ComponentMeta<typeof SykefraværsstatistikkVirksomhet>;

export const Hovedstory = () =>
    <SykefraværsstatistikkVirksomhet sykefraværsstatistikk={sykefraværsstatistikkMock[0]} />

export const StatistikkUtenDesimaler = () =>
    <SykefraværsstatistikkVirksomhet sykefraværsstatistikk={sykefraværsstatistikkMock[1]} />
