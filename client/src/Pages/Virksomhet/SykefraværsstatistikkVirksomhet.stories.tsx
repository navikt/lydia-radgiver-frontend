import { ComponentMeta } from "@storybook/react";
import { rest } from "msw";
import { sykefraværsstatistikkMock } from "../Prioritering/mocks/sykefraværsstatistikkMock";
import { SykefraværsstatistikkVirksomhet } from "./SykefraværsstatistikkVirksomhet";
import { siste4kvartalerPath, sykefraværsstatistikkPath } from "../../api/lydia-api";

export default {
    title: "Virksomhet/Sykefraværsstatistikk for en virksomhet",
    component: SykefraværsstatistikkVirksomhet,
    parameters: {
        backgrounds: {
            default: 'white'
        }
    }
} as ComponentMeta<typeof SykefraværsstatistikkVirksomhet>;

const orgnummer = "999123456"

export const Hovedstory = () =>
    <SykefraværsstatistikkVirksomhet orgnummer={orgnummer} />

Hovedstory.parameters = {
    msw: {
        handlers: {
            others: [
                rest.get(`${sykefraværsstatistikkPath}/:orgnummer/${siste4kvartalerPath}`, (req, res, ctx) => {
                    return res(
                        ctx.json([sykefraværsstatistikkMock[0]])
                    );
                }),
            ],
        }
    },
};

export const MedStatistikkFraKunToKvartal = () =>
    <SykefraværsstatistikkVirksomhet orgnummer={orgnummer} />

MedStatistikkFraKunToKvartal.parameters = {
    msw: {
        handlers: {
            others: [
                rest.get(`${sykefraværsstatistikkPath}/:orgnummer/${siste4kvartalerPath}`, (req, res, ctx) => {
                    return res(
                        ctx.json([
                            sykefraværsstatistikkMock[2],
                        ])
                    );
                }),
            ],
        }
    },
};
