import {Virksomhetsdetaljer} from "../src/domenetyper";
import {sykefraværsstatistikkMock} from "../src/Pages/Prioritering/mocks/sykefraværsstatistikkMock";
import {sorterStatistikkPåSisteÅrstallOgKvartal} from "../src/util/sortering";

const filtrerPåSisteKvartal =
    (sykefraværsstatistikk: Virksomhetsdetaljer[]): Virksomhetsdetaljer =>
        sykefraværsstatistikk.sort(sorterStatistikkPåSisteÅrstallOgKvartal)[0]

const årstall = [2022, 2021, 2020]
const kvartal = [1, 2, 3, 4]

const sykefraværsstatistikk = (år : number, kvartal : number) : Virksomhetsdetaljer => {
    return {...sykefraværsstatistikkMock[0], arstall: år, kvartal: kvartal }
}

const sykefraværsstatistikkListe : Virksomhetsdetaljer[] =
    årstall.flatMap(år =>
        kvartal.flatMap(k => sykefraværsstatistikk(år, k))
    )

test('kan finne siste kvartal fra en liste med sykefraværsstatistikk', () => {
    expect(sykefraværsstatistikkListe).toHaveLength(12)
    const sisteStatistikk = filtrerPåSisteKvartal(sykefraværsstatistikkListe)
    expect(sisteStatistikk.arstall).toBe(2022)
    expect(sisteStatistikk.kvartal).toBe(4)
});
