import styled from "styled-components";
import { StatistikkBoks } from "./StatistikkBoks";
import { SykefraversstatistikkVirksomhet } from "../../domenetyper";
import { formaterSomHeltall, formaterSomProsentMedEnDesimal } from "../../util/tallFormatering";
import { Loader } from "@navikt/ds-react";
import { useHentSykefraværsstatistikkForVirksomhet } from "../../api/lydia-api";
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

    if (lasterSykefraværsstatistikkSisteFireKvartal) {
        return (
            <Loader title={"Laster inn statistikk for virksomhet"}
                    variant={"interaction"}
                    size={"xlarge"}
            />
        )
    } else if (sykefraværsstatistikkSisteFireKvartal && sykefraværsstatistikkSisteFireKvartal.length > 0) {
        const statistikkForSisteKvartal = filtrerPåSisteKvartal(sykefraværsstatistikkSisteFireKvartal)

        return (
            <Container>
                <SubContainerForPrettyWrap>
                    <StatistikkBoks
                        verdi={formaterSomHeltall(statistikkForSisteKvartal.antallPersoner)}
                        tittel="Arbeidsforhold"
                    />
                    <StatistikkBoks
                        verdi={formaterSomProsentMedEnDesimal(statistikkForSisteKvartal.sykefraversprosent)}
                        tittel="Sykefravær"
                    />
                </SubContainerForPrettyWrap>
                <SubContainerForPrettyWrap>
                    <StatistikkBoks
                        verdi={formaterSomHeltall(statistikkForSisteKvartal.muligeDagsverk)}
                        tittel="Mulige dagsverk"
                    />
                    <StatistikkBoks
                        verdi={formaterSomHeltall(statistikkForSisteKvartal.tapteDagsverk)}
                        tittel="Tapte dagsverk"
                    />
                </SubContainerForPrettyWrap>
            </Container>
        );
    } else {
        return <p>Kunne ikke hente sykefraværsstatistikk for virksomheten</p>
    }
};

// TODO: bruk noe lignende et Either-pattern for å håndtere eventuell tomme lister her
const filtrerPåSisteKvartal =
    (sykefraværsstatistikk: SykefraversstatistikkVirksomhet[]): SykefraversstatistikkVirksomhet =>
        sykefraværsstatistikk.sort(sorterStatistikkPåSisteÅrstallOgKvartal)[0]
