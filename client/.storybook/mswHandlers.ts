import { rest } from "msw";
import { brukerMedVeldigLangtNavn } from "../src/Pages/Prioritering/mocks/innloggetAnsattMock";
import {
    iaSakHistorikkPath, innloggetAnsattPath,
    leveransePath,
    modulerPath,
    publiseringsinfoPath,
    siste4kvartalerPath, sistekvartalPath,
    sykefraværsstatistikkPath,
    tjenesterPath
} from "../src/api/lydia-api";
import {
    gjeldendePeriodePubliseringsinfo,
    sykefraværsstatistikkSisteKvartalMock,
    virksomhetsstatistikkSiste4KvartalerMock
} from "../src/Pages/Prioritering/mocks/sykefraværsstatistikkMock";
import { samarbeidshistorikkMock } from "../src/Pages/Virksomhet/mocks/iaSakHistorikkMock";
import { iaTjenester, leveranserPerIATjeneste, moduler } from "../src/Pages/Virksomhet/mocks/leveranseMock";

export const mswHandlers = [
    rest.get(`/${innloggetAnsattPath}`, (req, res, ctx) => {
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
]

