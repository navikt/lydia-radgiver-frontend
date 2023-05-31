import { rest } from "msw";
import { brukerMedVeldigLangtNavn } from "../src/Pages/Prioritering/mocks/innloggetAnsattMock";
import {
    iaSakHistorikkPath, leveransePath, modulerPath,
    publiseringsinfoPath,
    siste4kvartalerPath,
    sykefraværsstatistikkPath, tjenesterPath
} from "../src/api/lydia-api";
import {
    gjeldendePeriodePubliseringsinfo,
    sykefraværsstatistikkSisteKvartalMock,
    virksomhetsstatistikkSiste4KvartalerMock
} from "../src/Pages/Prioritering/mocks/sykefraværsstatistikkMock";
import { samarbeidshistorikkMock } from "../src/Pages/Virksomhet/mocks/iaSakHistorikkMock";
import { iaTjenester, leveranserPerIATjeneste, moduler } from "../src/Pages/Virksomhet/mocks/leveranseMock";

export const mswHandlers = {
    innloggetAnsatt: [
        rest.get('/innloggetAnsatt', (req, res, ctx) => {
            return res(ctx.json(brukerMedVeldigLangtNavn));
        }),
    ],
    sykefraværsstatistikkSisteKvartal: [
        rest.get(`${sykefraværsstatistikkPath}/:orgnummer/sistetilgjengeligekvartal`, (req, res, ctx) => {
            return res(
                ctx.json(sykefraværsstatistikkSisteKvartalMock[0])
            );
        }),
    ],
    sykefraværsstatistikkSiste4Kvartal: [
        rest.get(`${sykefraværsstatistikkPath}/:orgnummer/${siste4kvartalerPath}`, (req, res, ctx) => {
            return res(
                ctx.json(virksomhetsstatistikkSiste4KvartalerMock[0])
            );
        }),
    ],
    gjeldendePeriodeSiste4Kvartal: [
        rest.get(`${sykefraværsstatistikkPath}/${publiseringsinfoPath}`, (req, res, ctx) => {
            return res(
                ctx.json(gjeldendePeriodePubliseringsinfo)
            );
        }),
    ],
    samarbeidshistorikk: [
        rest.get(`${iaSakHistorikkPath}/:orgnummer`, (req, res, ctx) => {
            return res(
                ctx.json(samarbeidshistorikkMock)
            );
        }),
    ],
    leveranser: [
        rest.get(`${leveransePath}/:orgnummer/:saksnummer`, (req, res, ctx) => {
            return res(
                ctx.json(leveranserPerIATjeneste)
            );
        }),
    ],
    tjenester: [
        rest.get(tjenesterPath, (req, res, ctx) => {
            return res(
                ctx.json(iaTjenester)
            );
        }),
    ],
    moduler: [
        rest.get(modulerPath, (req, res, ctx) => {
            return res(
                ctx.json(moduler)
            );
        }),
    ]
}
