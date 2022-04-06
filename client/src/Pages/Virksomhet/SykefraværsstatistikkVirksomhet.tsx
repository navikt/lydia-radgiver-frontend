import {StatistikkBoks} from "./StatistikkBoks";
import styled from "styled-components";
import {SykefraversstatistikkVirksomhet} from "../../domenetyper";


const HorisontalFlexMedGap = styled.div`
    display: flex;
    flex-direction: row;
    gap: 1rem;
`;

interface Props {
    sykefraværsstatistikk : SykefraversstatistikkVirksomhet
}

const prosentSomDesimal = (prosent: number) => prosent / 100

export const SykefraværsstatistikkVirksomhet = ({ sykefraværsstatistikk } : Props ) => {
    return (
    <HorisontalFlexMedGap>
        <StatistikkBoks verdi={prosentSomDesimal(sykefraværsstatistikk.sykefraversprosent)} tittel="Sykefravær" bakgrunnsfarge={"#D47B00"} type="percent" inheritColor/>
        <StatistikkBoks verdi={sykefraværsstatistikk.antallPersoner} tittel="Antall arbeidsforhold" bakgrunnsfarge={"#A0A0A0"} type="decimal" />
        <StatistikkBoks verdi={sykefraværsstatistikk.tapteDagsverk} tittel="Tapte dagsverk" bakgrunnsfarge={"#A32A17"} type="decimal" inheritColor />
        <StatistikkBoks verdi={sykefraværsstatistikk.muligeDagsverk} tittel="Mulige dagsverk" bakgrunnsfarge={"#A0A0A0"} type="decimal" />
    </HorisontalFlexMedGap>
    )
}
