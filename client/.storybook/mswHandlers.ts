import { http, HttpResponse } from "msw";
import { brukerMedVeldigLangtNavn } from "../src/Pages/Prioritering/mocks/innloggetAnsattMock";
import {
    iaSakHistorikkPath,
    innloggetAnsattPath,
    næringPath,
    publiseringsinfoPath,
    salesforceUrlPath,
    siste4kvartalerPath,
    sistekvartalPath,
    sykefraværsstatistikkPath,
} from "../src/api/lydia-api/paths";
import {
    gjeldendePeriodePubliseringsinfo,
    sykefraværsstatistikkNæringMock,
    sykefraværsstatistikkSisteKvartalMock,
    virksomhetsstatistikkSiste4KvartalerMock,
} from "../src/Pages/Prioritering/mocks/sykefraværsstatistikkMock";
import { samarbeidshistorikkMock } from "../src/Pages/Virksomhet/mocks/iaSakHistorikkMock";

export const mswHandlers = [
    http.get(`${innloggetAnsattPath}`, () => {
        return HttpResponse.json(brukerMedVeldigLangtNavn);
    }),
    http.get(
        `${sykefraværsstatistikkPath}/:orgnummer/${sistekvartalPath}`,
        () => {
            return HttpResponse.json(sykefraværsstatistikkSisteKvartalMock[0]);
        },
    ),
    http.get(
        `${sykefraværsstatistikkPath}/:orgnummer/${siste4kvartalerPath}`,
        () => {
            return HttpResponse.json(
                virksomhetsstatistikkSiste4KvartalerMock[0],
            );
        },
    ),
    http.get(`${sykefraværsstatistikkPath}/${publiseringsinfoPath}`, () => {
        return HttpResponse.json(gjeldendePeriodePubliseringsinfo);
    }),
    http.get(`${iaSakHistorikkPath}/:orgnummer`, () => {
        return HttpResponse.json(samarbeidshistorikkMock);
    }),
    http.get(`${sykefraværsstatistikkPath}/${næringPath}/:naringskode`, () => {
        return HttpResponse.json(sykefraværsstatistikkNæringMock);
    }),
    http.get(`${salesforceUrlPath}/:orgnummer`, ({ params }) => {
        return HttpResponse.json({
            orgnr: params.orgnummer,
            url: "https://www.salesforce.com",
        });
    }),
];
