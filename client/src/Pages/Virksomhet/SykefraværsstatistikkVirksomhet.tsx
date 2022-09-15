import {StatistikkBoks} from "./StatistikkBoks";
import styled from "styled-components";
import {SykefraversstatistikkVirksomhet} from "../../domenetyper";
import {formaterMedEnDesimal, formaterSomHeltall, formaterSomProsentMedEnDesimal} from "../../util/tallFormatering";

const HorisontalFlexMedGap = styled.div`
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    gap: 1rem;
`;

interface Props {
    sykefraværsstatistikk: SykefraversstatistikkVirksomhet;
}


export const SykefraværsstatistikkVirksomhet = ({
    sykefraværsstatistikk,
}: Props) => {
    return (
        <HorisontalFlexMedGap>
            <StatistikkBoks
                verdi={formaterSomProsentMedEnDesimal(sykefraværsstatistikk.sykefraversprosent)}
                tittel="Sykefravær"
            />
            <StatistikkBoks
                verdi={formaterSomHeltall(sykefraværsstatistikk.antallPersoner)}
                tittel="Antall arbeidsforhold"
            />
            <StatistikkBoks
                verdi={formaterMedEnDesimal(sykefraværsstatistikk.tapteDagsverk)}
                tittel="Tapte dagsverk"
            />
            <StatistikkBoks
                verdi={formaterMedEnDesimal(sykefraværsstatistikk.muligeDagsverk)}
                tittel="Mulige dagsverk"
            />
        </HorisontalFlexMedGap>
    );
};
