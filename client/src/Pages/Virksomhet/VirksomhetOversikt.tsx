import {SykefraversstatistikkVirksomhet, Virksomhet} from "../../domenetyper";
import {VirksomhetInformasjon} from "./VirksomhetInformasjon";
import {StyledIaSakOversikt} from "./IASakOversikt";
import styled from "styled-components";
import {SykefraværsstatistikkVirksomhet} from "./SykefraværsstatistikkVirksomhet";

const VerticalFlex = styled.div`
    display: flex;
    flex-direction: column;
`;

const HorisontalFlex = styled.div`
    display: flex;
    gap: 2rem;
    flex-direction: row;
`

const HorisontalFlexMedToppRamme = styled(HorisontalFlex)`
    border-top: 1px solid black;    
`;

const StyledVirksomhetsInformasjon = styled(VirksomhetInformasjon)`
    margin-top: 1rem;
    margin-bottom: 1rem;
`

interface VirksomhetOversiktProps {
    virksomhet: Virksomhet,
    sykefraværsstatistikk : SykefraversstatistikkVirksomhet
}

export const VirksomhetOversikt = ({virksomhet, sykefraværsstatistikk }: VirksomhetOversiktProps) => {
    return (
        <VerticalFlex>
            <h1>{virksomhet.navn}</h1>
            <HorisontalFlexMedToppRamme>
                <VerticalFlex>
                    <StyledVirksomhetsInformasjon virksomhet={virksomhet}/>
                    <SykefraværsstatistikkVirksomhet sykefraværsstatistikk={sykefraværsstatistikk}/>
                </VerticalFlex>
                <StyledIaSakOversikt
                    saksnummer={"IA_123456789"}
                    iaProsessStatus={sykefraværsstatistikk.status}
                    innsatsteam={false}
                />
            </HorisontalFlexMedToppRamme>
        </VerticalFlex>
    )
}
