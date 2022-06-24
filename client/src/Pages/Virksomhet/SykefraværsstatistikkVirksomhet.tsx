import { StatistikkBoks } from "./StatistikkBoks";
import styled from "styled-components";
import { SykefraversstatistikkVirksomhet } from "../../domenetyper";

const HorisontalFlexMedGap = styled.div`
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    gap: 1rem;
`;

interface Props {
    sykefraværsstatistikk: SykefraversstatistikkVirksomhet;
}

const prosentSomDesimal = (prosent: number) => prosent / 100;

export const SykefraværsstatistikkVirksomhet = ({
    sykefraværsstatistikk,
}: Props) => {
    return (
        <HorisontalFlexMedGap>
            <StatistikkBoks
                verdi={prosentSomDesimal(
                    sykefraværsstatistikk.sykefraversprosent
                )}
                tittel="Sykefravær"
                type="percent"
            />
            <StatistikkBoks
                verdi={sykefraværsstatistikk.antallPersoner}
                tittel="Antall arbeidsforhold"
                type="decimal"
            />
            <StatistikkBoks
                verdi={sykefraværsstatistikk.tapteDagsverk}
                tittel="Tapte dagsverk"
                type="decimal"
            />
            <StatistikkBoks
                verdi={sykefraværsstatistikk.muligeDagsverk}
                tittel="Mulige dagsverk"
                type="decimal"
            />
        </HorisontalFlexMedGap>
    );
};
