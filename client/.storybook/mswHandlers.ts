import { rest } from "msw";
import { brukerMedVeldigLangtNavn } from "../src/Pages/Prioritering/mocks/innloggetAnsattMock";
import {
    iaSakHistorikkPath, innloggetAnsattPath,
    leveransePath, mineIATjenesterPath,
    modulerPath, næringPath,
    publiseringsinfoPath, salesforceUrlPath,
    siste4kvartalerPath, sistekvartalPath,
    sykefraværsstatistikkPath,
    tjenesterPath,
} from "../src/api/lydia-api";
import {
    gjeldendePeriodePubliseringsinfo, sykefraværsstatistikkNæringMock,
    sykefraværsstatistikkSisteKvartalMock,
    virksomhetsstatistikkSiste4KvartalerMock
} from "../src/Pages/Prioritering/mocks/sykefraværsstatistikkMock";
import { samarbeidshistorikkMock } from "../src/Pages/Virksomhet/mocks/iaSakHistorikkMock";
import { iaTjenester, leveranserPerIATjeneste, moduler } from "../src/Pages/Virksomhet/mocks/leveranseMock";
import { mineIATjenesterMock } from "../src/Pages/IATjenesteoversikt/mineIATjenesterMock";

export const mswHandlers = [
    rest.get(`${innloggetAnsattPath}`, (req, res, ctx) => {
        return res(ctx.json(brukerMedVeldigLangtNavn));
    }),
    rest.get(`${sykefraværsstatistikkPath}/:orgnummer/${sistekvartalPath}`, (req, res, ctx) => {
        return res(
            ctx.json(sykefraværsstatistikkSisteKvartalMock[0])
        );
    }),
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
    rest.get(`${iaSakHistorikkPath}/:orgnummer`, (req, res, ctx) => {
        return res(
            ctx.json(samarbeidshistorikkMock)
        );
    }),
    rest.get(`${leveransePath}/:orgnummer/:saksnummer`, (req, res, ctx) => {
        return res(
            ctx.json(leveranserPerIATjeneste)
        );
    }),
    rest.get(`${mineIATjenesterPath}`, (req, res, ctx) => {
        return res(
            ctx.json(mineIATjenesterMock)
        );
    }),
    rest.get(tjenesterPath, (req, res, ctx) => {
        return res(
            ctx.json(iaTjenester)
        );
    }),
    rest.get(modulerPath, (req, res, ctx) => {
        return res(
            ctx.json(moduler)
        );
    }),
    rest.get(`${sykefraværsstatistikkPath}/${næringPath}/:naringskode`, (req, res, ctx) => {
        return res(
            ctx.json(sykefraværsstatistikkNæringMock)
        );
    }),
    rest.get(`${salesforceUrlPath}/:orgnummer`, (req, res, ctx) => {
        return res(
            ctx.json({
                orgnr: req.params.orgnummer,
                url: "https://www.salesforce.com"
            })
        );
    }),
]
