import styled from "styled-components";
import { StatistikkBoks } from "./StatistikkBoks";
import { SykefraversstatistikkVirksomhetSiste4Kvartal } from "../../domenetyper";
import { formaterSomHeltall, formaterSomProsentMedEnDesimal } from "../../util/tallFormatering";
import { Loader } from "@navikt/ds-react";
import {
    useHentSykefraværsstatistikkForVirksomhetSiste4Kvartal,
    useHentSykefraværsstatistikkForVirksomhetSisteKvartal
} from "../../api/lydia-api";
import { sorterStatistikkPåSisteÅrstallOgKvartal } from "../../util/sortering";

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
        data: sykefraværsstatistikkSisteFireKvartal,
        loading: lasterSykefraværsstatistikkSisteFireKvartal
    } = useHentSykefraværsstatistikkForVirksomhetSiste4Kvartal(orgnummer)

    const {
        data: sykefraværsstatistikkSisteKvartal,
        loading: lasterSykefraværsstatistikkSisteKvartal
    } = useHentSykefraværsstatistikkForVirksomhetSisteKvartal(orgnummer)

    if (lasterSykefraværsstatistikkSisteFireKvartal || lasterSykefraværsstatistikkSisteKvartal) {
        return (
            <Loader title={"Laster inn statistikk for virksomhet"}
                    variant={"interaction"}
                    size={"xlarge"}
            />
        )
    } else if (sykefraværsstatistikkSisteFireKvartal && sykefraværsstatistikkSisteFireKvartal.length > 0) {
        const statistikkSisteFireKvartalNyesteUtgave = finnSisteUtgaveAvStatistikk(sykefraværsstatistikkSisteFireKvartal)

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
                        verdi={formaterSomHeltall(statistikkSisteFireKvartalNyesteUtgave.antallPersoner)}
                    />
                    <StatistikkBoks
                        tittel="Sykefravær"
                        helpTekst="Sykefraværsprosent siste 4 kvartal"
                        verdi={formaterSomProsentMedEnDesimal(statistikkSisteFireKvartalNyesteUtgave.sykefraversprosent)}
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
                        helpTekst="Antall mulige dagsverk siste 4 kvartal"
                        verdi={formaterSomHeltall(statistikkSisteFireKvartalNyesteUtgave.muligeDagsverk)}
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
                        helpTekst="Antall tapte dagsverk siste 4 kvartal"
                        verdi={formaterSomHeltall(statistikkSisteFireKvartalNyesteUtgave.tapteDagsverk)}
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
