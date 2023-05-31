import { Meta } from "@storybook/react";
import { rest } from "msw";
import {
    gjeldendePeriodePubliseringsinfo,
    virksomhetsstatistikkSiste4KvartalerMock
} from "../../../Prioritering/mocks/sykefraværsstatistikkMock";
import { Sykefraværsstatistikk } from "./Sykefraværsstatistikk";
import { publiseringsinfoPath, siste4kvartalerPath, sykefraværsstatistikkPath } from "../../../../api/lydia-api";

export default {
    title: "Virksomhet/Virksomhetsoversikt/Sykefraværsstatistikk for en virksomhet",
    component: Sykefraværsstatistikk,
    parameters: {
        backgrounds: {
            default: 'white'
        }
    }
} as Meta<typeof Sykefraværsstatistikk>;

const orgnummer = "999123456"

export const Hovedstory = () =>
    <Sykefraværsstatistikk orgnummer={orgnummer} />

Hovedstory.parameters = {
    msw: {
        handlers: [
            rest.get(`${sykefraværsstatistikkPath}/:orgnummer/${siste4kvartalerPath}`, (req, res, ctx) => {
                return res(
                    ctx.json(virksomhetsstatistikkSiste4KvartalerMock[0])
                );
            }),
            rest.get(`${sykefraværsstatistikkPath}/${publiseringsinfoPath}`, (req, res, ctx) => {
                return res(
                    ctx.json(gjeldendePeriodePubliseringsinfo)
                );
            }),
        ],
    },
};

export const MedStatistikkFraKunToKvartal = () =>
    <Sykefraværsstatistikk orgnummer={orgnummer} />

MedStatistikkFraKunToKvartal.parameters = {
    msw: {
        handlers: [
            rest.get(`${sykefraværsstatistikkPath}/:orgnummer/${siste4kvartalerPath}`, (req, res, ctx) => {
                return res(
                    ctx.json(
                        virksomhetsstatistikkSiste4KvartalerMock[2],
                    )
                );
            }),
            rest.get(`${sykefraværsstatistikkPath}/${publiseringsinfoPath}`, (req, res, ctx) => {
                return res(
                    ctx.json(gjeldendePeriodePubliseringsinfo)
                );
            }),
        ],
    },
};
