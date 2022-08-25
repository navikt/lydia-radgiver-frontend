import {rest, RestHandler} from "msw";
import {filterverdierMock} from "../Pages/Prioritering/mocks/filterverdierMock";
import {sykefraværsstatistikkMock} from "../Pages/Prioritering/mocks/sykefraværsstatistikkMock";
import {iaSakKartlegges} from "../Pages/Virksomhet/mocks/iaSakMock";
import {samarbeidshistorikkMock} from "../Pages/Virksomhet/mocks/iaSakHistorikkMock";
import {brukerMedGyldigToken, sykefraværRespons, virksomheterMock} from "./mocks";

function getJson<T>(path: string, data: T) {
    return rest.get(path, async (req, res, ctx) => {
        return res(ctx.status(200), ctx.json<T>(data))
    })
}

export const handlers : RestHandler[] = [
    getJson("/innloggetAnsatt", brukerMedGyldigToken),
    getJson("/api/sykefraversstatistikk/filterverdier", filterverdierMock),
    getJson("/api/sykefraversstatistikk", sykefraværRespons),
    rest.get("/api/sykefraversstatistikk/:orgnummer", async (req, res, ctx) => {
        const {orgnummer} = req.params
        return res(ctx.status(200), ctx.json(
            [sykefraværsstatistikkMock.find((e) => {return e.orgnr === orgnummer})]
        ))
    }),
    rest.get("/api/virksomhet/:orgnummer", async (req, res, ctx) => {
        const {orgnummer} = req.params
        return res(ctx.status(200), ctx.json(
            virksomheterMock.find((e) => {return e.orgnr == orgnummer})
        ))
    }),
    rest.get("/api/iasak/radgiver/:orgnummer", async (req, res, ctx) => {
        return res(ctx.status(200), ctx.json([iaSakKartlegges]))
    }),
    rest.get("/api/iasak/radgiver/historikk/:orgnummer", async (req, res, ctx) => {
        return res(ctx.status(200), ctx.json(samarbeidshistorikkMock))
    })
]