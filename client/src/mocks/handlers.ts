import {rest, RestHandler} from "msw";
import {filterverdierMock} from "../Pages/Prioritering/mocks/filterverdierMock";
import {sykefraværsstatistikkMock} from "../Pages/Prioritering/mocks/sykefraværsstatistikkMock";
import {samarbeidshistorikkMock} from "../Pages/Virksomhet/mocks/iaSakHistorikkMock";
import {brukerMedGyldigToken, iaSakFraHendelse, iaSakFraStatistikk, sykefraværRespons, virksomheterMock} from "./mocks";
import {IANySakshendelseDto, VirksomhetSøkeresultat} from "../domenetyper";
import {sakshendelserMock} from "../Pages/Virksomhet/mocks/iaSakshendelserMock";

function getJson<T>(path: string, data: T) {
    return rest.get(path, async (req, res, ctx) => {
        return res(ctx.delay(500), ctx.status(200), ctx.json<T>(data))
    })
}

export const handlers: RestHandler[] = [
    getJson("/innloggetAnsatt", brukerMedGyldigToken),
    getJson("/api/sykefraversstatistikk/filterverdier", filterverdierMock),
    getJson("/api/sykefraversstatistikk", sykefraværRespons),
    rest.get("/api/virksomhet/finn", async (req, res, ctx) => {
        const q = req.url.searchParams.get('q')?.toLocaleLowerCase()
        return res(ctx.status(200), ctx.json<VirksomhetSøkeresultat[]>(virksomheterMock.filter((e) => q && e.navn.toLocaleLowerCase().indexOf(q) !== -1).map((e) => {
            return {orgnr: e.orgnr, navn: e.navn}
        })))
    }),
    rest.get("/api/sykefraversstatistikk/:orgnummer", async (req, res, ctx) => {
        const {orgnummer} = req.params
        return res(ctx.status(200), ctx.json(
            [sykefraværsstatistikkMock.find((e) => {
                return e.orgnr === orgnummer
            })]
        ))
    }),
    rest.get("/api/virksomhet/:orgnummer", async (req, res, ctx) => {
        const {orgnummer} = req.params
        return res(ctx.status(200), ctx.json(
            virksomheterMock.find((e) => {
                return e.orgnr == orgnummer
            })
        ))
    }),
    rest.get("/api/iasak/radgiver/:orgnummer", async (req, res, ctx) => {
        const {orgnummer} = req.params
        const statistikk = sykefraværsstatistikkMock.find((e) => {
            return e.orgnr === orgnummer
        })!!
        return res(ctx.status(200), ctx.json(iaSakFraStatistikk(statistikk)))
    }),
    rest.get("/api/iasak/radgiver/historikk/:orgnummer", async (req, res, ctx) => {
        return res(ctx.status(200), ctx.json(samarbeidshistorikkMock))
    }),
    rest.post("/api/iasak/radgiver/hendelse", async (req, res, ctx) => {
        const hendelse = await req.json<IANySakshendelseDto>()
        return res(ctx.status(200), ctx.json(iaSakFraHendelse(hendelse.hendelsesType)))
    }),
    rest.post("/api/iasak/radgiver/:orgnummer", async (req, res, ctx) => {
        const hendelse = sakshendelserMock[0]
        return res(ctx.status(200), ctx.json(iaSakFraHendelse(hendelse.hendelsestype)))
    })
]