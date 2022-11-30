import styled from "styled-components";
import { StatistikkBoks } from "./StatistikkBoks";
import { SykefraversstatistikkVirksomhet } from "../../domenetyper";
import { formaterSomHeltall, formaterSomProsentMedEnDesimal } from "../../util/tallFormatering";

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
    sykefraværsstatistikk: SykefraversstatistikkVirksomhet;
}

export const SykefraværsstatistikkVirksomhet = ({sykefraværsstatistikk}: Props) => (
    <Container>
        <SubContainerForPrettyWrap>
            <StatistikkBoks
                verdi={formaterSomHeltall(sykefraværsstatistikk.antallPersoner)}
                tittel="Arbeidsforhold"
            />
            <StatistikkBoks
                verdi={formaterSomProsentMedEnDesimal(sykefraværsstatistikk.sykefraversprosent)}
                tittel="Sykefravær"
            />
        </SubContainerForPrettyWrap>
        <SubContainerForPrettyWrap>
            <StatistikkBoks
                verdi={formaterSomHeltall(sykefraværsstatistikk.muligeDagsverk)}
                tittel="Mulige dagsverk"
            />
            <StatistikkBoks
                verdi={formaterSomHeltall(sykefraværsstatistikk.tapteDagsverk)}
                tittel="Tapte dagsverk"
            />
        </SubContainerForPrettyWrap>
    </Container>
);
