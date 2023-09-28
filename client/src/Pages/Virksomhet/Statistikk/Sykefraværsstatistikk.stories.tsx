import { Meta } from "@storybook/react";
import { rest } from "msw";
import {
    gjeldendePeriodePubliseringsinfo,
    sykefraværsstatistikkBransjeMock,
    sykefraværsstatistikkNæringMock,
    sykefraværsstatistikkSisteKvartalMock,
    virksomhetsstatistikkSiste4KvartalerMock
} from "../../Prioritering/mocks/sykefraværsstatistikkMock";
import { Sykefraværsstatistikk } from "./Sykefraværsstatistikk";
import {
    bransjePath,
    næringPath,
    publiseringsinfoPath,
    siste4kvartalerPath,
    sistekvartalPath,
    sykefraværsstatistikkPath
} from "../../../api/lydia-api";
import {Næring} from "../../../domenetyper/virksomhet";

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
const jordbruk: Næring = {
    navn: "Jordbruk",
    kode: "01"
}

export const Hovedstory = () =>
    <Sykefraværsstatistikk orgnummer={orgnummer} bransje={"BRANSJE"} næring={jordbruk} />

Hovedstory.parameters = {
    msw: {
        handlers: [
            rest.get(`${sykefraværsstatistikkPath}/:orgnummer/${siste4kvartalerPath}`, (req, res, ctx) => {
                return res(
                    ctx.json(virksomhetsstatistikkSiste4KvartalerMock[0])
                );
            }),
            rest.get(`${sykefraværsstatistikkPath}/:orgnummer/${sistekvartalPath}`, (req, res, ctx) => {
                return res(
                    ctx.json(sykefraværsstatistikkSisteKvartalMock[0])
                );
            }),
            rest.get(`${sykefraværsstatistikkPath}/${næringPath}/:naringskode`, (req, res, ctx) => {
                return res(
                    ctx.json(sykefraværsstatistikkNæringMock)
                );
            }),
            rest.get(`${sykefraværsstatistikkPath}/${bransjePath}/:bransjekode`, (req, res, ctx) => {
                return res(
                    ctx.json(sykefraværsstatistikkBransjeMock)
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

export const ForVirksomhetUtenBransje = () =>
    <Sykefraværsstatistikk orgnummer={orgnummer} bransje={null} næring={jordbruk} />

ForVirksomhetUtenBransje.parameters = {
    msw: {
        handlers: [
            rest.get(`${sykefraværsstatistikkPath}/:orgnummer/${siste4kvartalerPath}`, (req, res, ctx) => {
                return res(
                    ctx.json(
                        virksomhetsstatistikkSiste4KvartalerMock[2],
                    )
                );
            }),
            rest.get(`${sykefraværsstatistikkPath}/:orgnummer/${sistekvartalPath}`, (req, res, ctx) => {
                return res(
                    ctx.json(sykefraværsstatistikkSisteKvartalMock[0])
                );
            }),
            rest.get(`${sykefraværsstatistikkPath}/${næringPath}/:naringskode`, (req, res, ctx) => {
                return res(
                    ctx.json(sykefraværsstatistikkNæringMock)
                );
            }),
            rest.get(`${sykefraværsstatistikkPath}/${bransjePath}/:bransjekode`, (req, res, ctx) => {
                return res(
                    ctx.json(sykefraværsstatistikkBransjeMock)
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
    <Sykefraværsstatistikk orgnummer={orgnummer} bransje={"BRANSJE"} næring={jordbruk} />

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
            rest.get(`${sykefraværsstatistikkPath}/:orgnummer/${sistekvartalPath}`, (req, res, ctx) => {
                return res(
                    ctx.json(sykefraværsstatistikkSisteKvartalMock[0])
                );
            }),
            rest.get(`${sykefraværsstatistikkPath}/${næringPath}/:naringskode`, (req, res, ctx) => {
                return res(
                    ctx.json(sykefraværsstatistikkNæringMock)
                );
            }),
            rest.get(`${sykefraværsstatistikkPath}/${bransjePath}/:bransjekode`, (req, res, ctx) => {
                return res(
                    ctx.json(sykefraværsstatistikkBransjeMock)
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