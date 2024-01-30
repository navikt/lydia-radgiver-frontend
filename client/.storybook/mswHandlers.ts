import { http, HttpResponse } from "msw";
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
    http.get(`${innloggetAnsattPath}`, () => {
        return HttpResponse.json(brukerMedVeldigLangtNavn);
    }),
    http.get(`${sykefraværsstatistikkPath}/:orgnummer/${sistekvartalPath}`, () => {
        return HttpResponse.json(sykefraværsstatistikkSisteKvartalMock[0]);
    }),
    http.get(`${sykefraværsstatistikkPath}/:orgnummer/${siste4kvartalerPath}`, () => {
        return HttpResponse.json(virksomhetsstatistikkSiste4KvartalerMock[0]);
    }),
    http.get(`${sykefraværsstatistikkPath}/${publiseringsinfoPath}`, () => {
        return HttpResponse.json(gjeldendePeriodePubliseringsinfo);
    }),
    http.get(`${iaSakHistorikkPath}/:orgnummer`, () => {
        return HttpResponse.json(samarbeidshistorikkMock);
    }),
    http.get(`${leveransePath}/:orgnummer/:saksnummer`, () => {
        return HttpResponse.json(leveranserPerIATjeneste);
    }),
    http.get(`${mineIATjenesterPath}`, () => {
        return HttpResponse.json(mineIATjenesterMock);
    }),
    http.get(tjenesterPath, () => {
        return HttpResponse.json(iaTjenester);
    }),
    http.get(modulerPath, () => {
        return HttpResponse.json(moduler);
    }),
    http.get(`${sykefraværsstatistikkPath}/${næringPath}/:naringskode`, () => {
        return HttpResponse.json(sykefraværsstatistikkNæringMock);
    }),
    http.get(`${salesforceUrlPath}/:orgnummer`, ({ params }) => {
        return HttpResponse.json({
            orgnr: params.orgnummer,
            url: "https://www.salesforce.com"
        });
    }),
]
