import {IAProsessStatusEnum, SykefraversstatistikkVirksomhet, Virksomhet} from "../../domenetyper";
import {VirksomhetInformasjon} from "./VirksomhetInformasjon";
import {StyledIaSakOversikt} from "./IASakOversikt";
import styled from "styled-components";
import {StatistikkBoks} from "./StatistikkBoks";

const VerticalFlexboxDiv = styled.div`
    display: flex;
    flex-direction: column;
`;
const HorizontalFlexboxDiv = styled.div`
    display: flex;
    flex-direction: row;
    gap: 3rem;
`;

interface VirksomhetOversiktProps {
    virksomhet: Virksomhet,
    sykefraværsstatistikk : SykefraversstatistikkVirksomhet
}

export const VirksomhetOversikt = ({virksomhet, sykefraværsstatistikk }: VirksomhetOversiktProps) => {
    return (
        <VerticalFlexboxDiv>
            <h1>{virksomhet.navn}</h1>
            <HorizontalFlexboxDiv>
                <VerticalFlexboxDiv>
                    <VirksomhetInformasjon virksomhet={virksomhet}/>
                    <div style={{ display: "flex", flexDirection: "row", gap: "1rem" }}>
                        <StatistikkBoks verdi={sykefraværsstatistikk.sykefraversprosent} tittel="Sykefravær" bakgrunnsfarge={"#D47B00"} type="percent" inheritColor/>
                        <StatistikkBoks verdi={sykefraværsstatistikk.antallPersoner} tittel="Antall arbeidsforhold" bakgrunnsfarge={"#A0A0A0"} type="decimal" />
                        <StatistikkBoks verdi={sykefraværsstatistikk.muligeDagsverk} tittel="Avtalte dagsverk" bakgrunnsfarge={"#A0A0A0"} type="decimal" />
                        <StatistikkBoks verdi={sykefraværsstatistikk.tapteDagsverk} tittel="Tapte dagsverk" bakgrunnsfarge={"#A32A17"} type="decimal" inheritColor />
                    </div>
                </VerticalFlexboxDiv>
                <StyledIaSakOversikt
                    saksnummer={"IA_123456789"}
                    iaProsessStatus={IAProsessStatusEnum.Values.KARTLEGGING}
                    innsatsteam={false}
                />
            </HorizontalFlexboxDiv>
        </VerticalFlexboxDiv>
    )
}
