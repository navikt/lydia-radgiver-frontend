import styled from "styled-components";
import { Statistikkboks } from "./Statistikkboks";
import { Kvartal, KvartalFraTil, Virksomhetsdetaljer } from "../../../../domenetyper";
import { formaterSomHeltall, formaterSomProsentMedEnDesimal } from "../../../../util/tallFormatering";
import { Loader } from "@navikt/ds-react";
import {
    useHentGjeldendePeriodeForVirksomhetSiste4Kvartal,
    useHentVirksomhetsdetaljer,
    useHentSykefraværsstatistikkForVirksomhetSisteKvartal
} from "../../../../api/lydia-api";
import { sorterKvartalStigende, sorterStatistikkPåSisteÅrstallOgKvartal } from "../../../../util/sortering";
import { getGjeldendePeriodeTekst } from "../../../../util/gjeldendePeriodeSisteFireKvartal";

const Container = styled.div`
  display: grid;
  gap: 1rem;
  grid-template-columns: repeat(auto-fit, minmax(${230 / 16}rem, 1fr));
`;

interface Props {
    orgnummer: string;
}

export const Sykefraværsstatistikk = ({ orgnummer }: Props) => {
    const {
        data: sykefraværsstatistikkSiste4Kvartal,
        loading: lasterSykefraværsstatistikkSiste4Kvartal,
    } = useHentVirksomhetsdetaljer(orgnummer)

    const {
        data: gjeldendePeriodeSisteFireKvartal,
    } = useHentGjeldendePeriodeForVirksomhetSiste4Kvartal()

    const {
        data: sykefraværsstatistikkSisteKvartal,
        loading: lasterSykefraværsstatistikkSisteKvartal,
    } = useHentSykefraværsstatistikkForVirksomhetSisteKvartal(orgnummer)

    if (lasterSykefraværsstatistikkSiste4Kvartal || lasterSykefraværsstatistikkSisteKvartal) {
        return (
            <Loader title={"Laster inn statistikk for virksomhet"}
                    variant={"interaction"}
                    size={"xlarge"}
            />
        )
    } else if (sykefraværsstatistikkSiste4Kvartal && sykefraværsstatistikkSiste4Kvartal.length > 0) {
        const statistikkSiste4KvartalNyesteUtgave = finnSisteUtgaveAvStatistikk(sykefraværsstatistikkSiste4Kvartal)
        const sisteFireKvartalInfo = hvilkeKvartalHarVi(statistikkSiste4KvartalNyesteUtgave, gjeldendePeriodeSisteFireKvartal);

        return (
            <Container>
                <Statistikkboks
                    tittel="Arbeidsforhold"
                    helpTekst={
                        sykefraværsstatistikkSisteKvartal
                            ? `Antall arbeidsforhold per ${sykefraværsstatistikkSisteKvartal?.kvartal}. kvartal ${sykefraværsstatistikkSisteKvartal?.arstall}`
                            : "Antall arbeidsforhold siste kvartal"
                    }
                    verdi={formaterSomHeltall(statistikkSiste4KvartalNyesteUtgave.antallPersoner)}
                />
                <Statistikkboks
                    tittel="Sykefravær"
                    helpTekst={`Sykefraværsprosent ${sisteFireKvartalInfo}`}
                    verdi={formaterSomProsentMedEnDesimal(statistikkSiste4KvartalNyesteUtgave.sykefraversprosent)}
                    verdiSisteKvartal={sykefraværsstatistikkSisteKvartal?.sykefraversprosent
                        ? {
                            verdi: formaterSomProsentMedEnDesimal(sykefraværsstatistikkSisteKvartal.sykefraversprosent),
                            år: sykefraværsstatistikkSisteKvartal.arstall,
                            kvartal: sykefraværsstatistikkSisteKvartal.kvartal
                        }
                        : undefined}
                />
                <Statistikkboks
                    tittel="Mulige dagsverk"
                    helpTekst={`Antall mulige dagsverk ${sisteFireKvartalInfo}`}
                    verdi={formaterSomHeltall(statistikkSiste4KvartalNyesteUtgave.muligeDagsverk)}
                    verdiSisteKvartal={sykefraværsstatistikkSisteKvartal?.muligeDagsverk
                        ? {
                            verdi: formaterSomHeltall(sykefraværsstatistikkSisteKvartal.muligeDagsverk),
                            år: sykefraværsstatistikkSisteKvartal.arstall,
                            kvartal: sykefraværsstatistikkSisteKvartal.kvartal
                        }
                        : undefined}
                />
                <Statistikkboks
                    tittel="Tapte dagsverk"
                    helpTekst={`Antall tapte dagsverk ${sisteFireKvartalInfo}`}
                    verdi={formaterSomHeltall(statistikkSiste4KvartalNyesteUtgave.tapteDagsverk)}
                    verdiSisteKvartal={sykefraværsstatistikkSisteKvartal?.tapteDagsverk
                        ? {
                            verdi: formaterSomHeltall(sykefraværsstatistikkSisteKvartal.tapteDagsverk),
                            år: sykefraværsstatistikkSisteKvartal.arstall,
                            kvartal: sykefraværsstatistikkSisteKvartal.kvartal
                        }
                        : undefined}
                />
            </Container>
        );
    } else {
        return <p>Kunne ikke hente sykefraværsstatistikk for virksomheten</p>
    }
};

// TODO: bruk noe lignende et Either-pattern for å håndtere eventuell tomme lister her
const finnSisteUtgaveAvStatistikk =
    (sykefraværsstatistikk: Virksomhetsdetaljer[]): Virksomhetsdetaljer =>
        sykefraværsstatistikk.sort(sorterStatistikkPåSisteÅrstallOgKvartal)[0]


const hvilkeKvartalHarVi = (statistikk: Virksomhetsdetaljer, gjeldendePeriode: KvartalFraTil | undefined) => {
    let kvartalstrenger = "";

    if (statistikk.antallKvartaler === 4) {
        kvartalstrenger = ` siste fire kvartaler${getGjeldendePeriodeTekst(gjeldendePeriode)}`
    } else {
        kvartalstrenger += statistikk.kvartaler.sort(sorterKvartalStigende).map((kvartal: Kvartal) => {
            return ` ${kvartal.kvartal}. kvartal ${kvartal.årstall}`
        })
    }

    return "basert på" + kvartalstrenger;
}
