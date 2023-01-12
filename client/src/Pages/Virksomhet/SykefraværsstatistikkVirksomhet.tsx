import styled from "styled-components";
import { StatistikkBoks } from "./StatistikkBoks";
import { Kvartal, SykefraversstatistikkVirksomhetSiste4Kvartal } from "../../domenetyper";
import { formaterSomHeltall, formaterSomProsentMedEnDesimal } from "../../util/tallFormatering";
import { Loader } from "@navikt/ds-react";
import {
    useHentSykefraværsstatistikkForVirksomhetSiste4Kvartal,
    useHentSykefraværsstatistikkForVirksomhetSisteKvartal
} from "../../api/lydia-api";
import { sorterKvartalStigende, sorterStatistikkPåSisteÅrstallOgKvartal } from "../../util/sortering";

const Container = styled.div`
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
`;

const SubContainerForPrettyWrap = styled.div`
  flex: 1;
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
`;

interface Props {
    orgnummer: string;
}

export const SykefraværsstatistikkVirksomhet = ({ orgnummer }: Props) => {
    const {
        data: sykefraværsstatistikkSiste4Kvartal,
        loading: lasterSykefraværsstatistikkSiste4Kvartal
    } = useHentSykefraværsstatistikkForVirksomhetSiste4Kvartal(orgnummer)

    const {
        data: sykefraværsstatistikkSisteKvartal,
        loading: lasterSykefraværsstatistikkSisteKvartal
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
        const sisteFireKvartalInfo = hvilkeKvartalHarVi(statistikkSiste4KvartalNyesteUtgave);

        return (
            <Container>
                <SubContainerForPrettyWrap>
                    <StatistikkBoks
                        tittel="Arbeidsforhold"
                        helpTekst={
                            sykefraværsstatistikkSisteKvartal
                                ? `Antall arbeidsforhold per ${sykefraværsstatistikkSisteKvartal?.kvartal}. kvartal ${sykefraværsstatistikkSisteKvartal?.arstall}`
                                : "Antall arbeidsforhold siste kvartal"
                        }
                        verdi={formaterSomHeltall(statistikkSiste4KvartalNyesteUtgave.antallPersoner)}
                    />
                    <StatistikkBoks
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
                </SubContainerForPrettyWrap>
                <SubContainerForPrettyWrap>
                    <StatistikkBoks
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
                    <StatistikkBoks
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
                </SubContainerForPrettyWrap>
            </Container>
        );
    } else {
        return <p>Kunne ikke hente sykefraværsstatistikk for virksomheten</p>
    }
};

// TODO: bruk noe lignende et Either-pattern for å håndtere eventuell tomme lister her
const finnSisteUtgaveAvStatistikk =
    (sykefraværsstatistikk: SykefraversstatistikkVirksomhetSiste4Kvartal[]): SykefraversstatistikkVirksomhetSiste4Kvartal =>
        sykefraværsstatistikk.sort(sorterStatistikkPåSisteÅrstallOgKvartal)[0]


const hvilkeKvartalHarVi = (statistikk: SykefraversstatistikkVirksomhetSiste4Kvartal) => {
    let kvartalstrenger = "";

    if (statistikk.antallKvartaler === 4) {
        kvartalstrenger = ` siste fire kvartaler (4. kvartal 2021 til 3. kvartal 2022)`
    } else {
        kvartalstrenger += statistikk.kvartaler.sort(sorterKvartalStigende).map((kvartal: Kvartal) => {
            return ` ${kvartal.kvartal}. kvartal ${kvartal.årstall}`
        })
    }

    return "basert på" + kvartalstrenger;
}
