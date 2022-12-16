import styled from "styled-components";
import { StatistikkBoks } from "./StatistikkBoks";
import { SykefraversstatistikkVirksomhet } from "../../domenetyper";
import { formaterSomHeltall, formaterSomProsentMedEnDesimal } from "../../util/tallFormatering";
import { Loader } from "@navikt/ds-react";
import {
    useHentSykefraværsstatistikkForVirksomhet,
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

export const SykefraværsstatistikkVirksomhet = ({orgnummer}: Props) => {
    const {
        data: sykefraværsstatistikkSisteFireKvartal,
        loading: lasterSykefraværsstatistikkSisteFireKvartal
    } = useHentSykefraværsstatistikkForVirksomhet(orgnummer)

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
                        helpTekst="Antall arbeidsforhold i siste kvartal"
                        verdi={formaterSomHeltall(statistikkSisteFireKvartalNyesteUtgave.antallPersoner)}
                    />
                    <StatistikkBoks
                        tittel="Sykefravær"
                        helpTekst="Sykefraværsprosent siste 4 kvartal"
                        verdi={formaterSomProsentMedEnDesimal(statistikkSisteFireKvartalNyesteUtgave.sykefraversprosent)}
                        verdiSisteKvartal={sykefraværsstatistikkSisteKvartal?.sykefraversprosent
                            ? formaterSomProsentMedEnDesimal(sykefraværsstatistikkSisteKvartal.sykefraversprosent)
                            : undefined}
                    />
                </SubContainerForPrettyWrap>
                <SubContainerForPrettyWrap>
                    <StatistikkBoks
                        tittel="Mulige dagsverk"
                        helpTekst="Antall mulige dagsverk siste 4 kvartal"
                        verdi={formaterSomHeltall(statistikkSisteFireKvartalNyesteUtgave.muligeDagsverk)}
                        verdiSisteKvartal={sykefraværsstatistikkSisteKvartal?.muligeDagsverk
                            ? formaterSomHeltall(sykefraværsstatistikkSisteKvartal.muligeDagsverk)
                            : undefined}
                    />
                    <StatistikkBoks
                        tittel="Tapte dagsverk"
                        helpTekst="Antall tapte dagsverk siste 4 kvartal"
                        verdi={formaterSomHeltall(statistikkSisteFireKvartalNyesteUtgave.tapteDagsverk)}
                        verdiSisteKvartal={sykefraværsstatistikkSisteKvartal?.tapteDagsverk
                            ? formaterSomHeltall(sykefraværsstatistikkSisteKvartal.tapteDagsverk)
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
    (sykefraværsstatistikk: SykefraversstatistikkVirksomhet[]): SykefraversstatistikkVirksomhet =>
        sykefraværsstatistikk.sort(sorterStatistikkPåSisteÅrstallOgKvartal)[0]
