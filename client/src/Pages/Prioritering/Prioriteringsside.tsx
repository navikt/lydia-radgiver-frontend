import Filtervisning from "./Filtervisning";
import { PrioriteringsTabell } from "./PrioriteringsTabell";
import {useFilterverdier, useSykefraværsstatistikk} from "../../api/lydia-api";
import { SykefraversstatistikkVirksomhet } from "../../domenetyper";


const randomHeltall = () => Math.floor(Math.random() * 100);
const randomProsent = () => parseFloat((Math.random() * 100).toFixed(2));

const sykefraværStatistikkMock: SykefraversstatistikkVirksomhet[] = [
        {
            orgnr: '987654321',
            virksomhetsnavn: 'Generasjonsbaren',
            sektor: "Offentlig",
            neringsgruppe: "Kontortjenester",
            arstall: 2022,
            kvartal: 1,

            sykefraversprosent: randomProsent(),
            antallPersoner: randomHeltall(),
            muligeDagsverk: randomHeltall(),
            tapteDagsverk: randomHeltall(),
        },
        {
            orgnr: '123456789',
            virksomhetsnavn: 'Antibaren',
            sektor: "Offentlig",
            neringsgruppe: "Kontortjenester",
            arstall: 2022,
            kvartal: 1,
            sykefraversprosent: randomProsent(),
            antallPersoner: randomHeltall(),
            tapteDagsverk: randomHeltall(),
            muligeDagsverk: randomHeltall(),
        },
        {
            orgnr: '123789456',
            virksomhetsnavn: 'Jæger & Co',
            sektor: "Offentlig",
            neringsgruppe: "Kontortjenester",
            arstall: 2022,
            kvartal: 1,
            sykefraversprosent: randomProsent(),
            antallPersoner: randomHeltall(),
            tapteDagsverk: randomHeltall(),
            muligeDagsverk: randomHeltall(),
        }
    ]

const Prioriteringsside = () => {
    const { data : filterverdier, loading: loadingFilterverdier, error: errorFilterverdier } = useFilterverdier();
    const { data : sykefraversstatistikk, loading : loadingSykefraværsstatistikk, error : errorSykefraværsstatistikk} = useSykefraværsstatistikk();

    const isLoading = loadingFilterverdier || loadingSykefraværsstatistikk;
    const isError = errorFilterverdier || errorSykefraværsstatistikk;

    return (
        <>
            {filterverdier && <Filtervisning {...filterverdier} />}
            {/* TODO: erstatt mock med verdien fra useSykefraværsstatistikk */}
            {sykefraværStatistikkMock && <PrioriteringsTabell sykefraværsstatistikk={sykefraværStatistikkMock}/>}
            {isLoading && <p>Loading</p>}
            {isError && <p>Error</p>}
        </>
    )
}




export default Prioriteringsside;
