import { ComponentMeta } from "@storybook/react";
import { rest } from "msw";
import {
    gjeldendePeriodeSiste4Kvartal,
    virksomhetsstatistikkSiste4KvartalerMock
} from "../../../Prioritering/mocks/sykefraværsstatistikkMock";
import { Sykefraværsstatistikk } from "./Sykefraværsstatistikk";
import { gjeldendePeriodePath, siste4kvartalerPath, sykefraværsstatistikkPath } from "../../../../api/lydia-api";

export default {
    title: "Virksomhet/Sykefraværsstatistikk for en virksomhet",
    component: Sykefraværsstatistikk,
    parameters: {
        backgrounds: {
            default: 'white'
        }
    }
} as ComponentMeta<typeof Sykefraværsstatistikk>;

const orgnummer = "999123456"

export const Hovedstory = () =>
    <Sykefraværsstatistikk orgnummer={orgnummer} />

Hovedstory.parameters = {
    msw: {
        handlers: {
            others: [
                rest.get(`${sykefraværsstatistikkPath}/:orgnummer/${siste4kvartalerPath}`, (req, res, ctx) => {
                    return res(
                        ctx.json(virksomhetsstatistikkSiste4KvartalerMock[0])
                    );
                }),
                rest.get(`${sykefraværsstatistikkPath}/${gjeldendePeriodePath}`, (req, res, ctx) => {
                    return res(
                        ctx.json(gjeldendePeriodeSiste4Kvartal)
                    );
                }),
            ],
        }
    },
};

export const MedStatistikkFraKunToKvartal = () =>
    <Sykefraværsstatistikk orgnummer={orgnummer} />

MedStatistikkFraKunToKvartal.parameters = {
    msw: {
        handlers: {
            others: [
                rest.get(`${sykefraværsstatistikkPath}/:orgnummer/${siste4kvartalerPath}`, (req, res, ctx) => {
                    return res(
                        ctx.json(
                            virksomhetsstatistikkSiste4KvartalerMock[2],
                        )
                    );
                }),
                rest.get(`${sykefraværsstatistikkPath}/${gjeldendePeriodePath}`, (req, res, ctx) => {
                    return res(
                        ctx.json(gjeldendePeriodeSiste4Kvartal)
                    );
                }),
            ],
        }
    },
};
