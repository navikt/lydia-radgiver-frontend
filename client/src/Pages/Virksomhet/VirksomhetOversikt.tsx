import {IASak, IASakshendelse, SykefraversstatistikkVirksomhet, Virksomhet} from "../../domenetyper";
import {VirksomhetInformasjon} from "./VirksomhetInformasjon";
import {StyledIaSakOversikt} from "./IASakOversikt";
import styled from "styled-components";
import {SykefraværsstatistikkVirksomhet} from "./SykefraværsstatistikkVirksomhet";
import {StyledIASakshendelserOversikt} from "./IASakshendelserOversikt";
import {sakshendelserMock} from "./mocks/iaSakshendelserMock";

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
    sykefraværsstatistikk : SykefraversstatistikkVirksomhet,
    iaSak?: IASak
    sakshendelser: IASakshendelse[]
}

export const VirksomhetOversikt = ({virksomhet, sykefraværsstatistikk, iaSak, sakshendelser }: VirksomhetOversiktProps) => {
    return (
        <VerticalFlex>
            <h1>{virksomhet.navn}</h1>
            <HorisontalFlexMedToppRamme>
                <VerticalFlex>
                    <StyledVirksomhetsInformasjon virksomhet={virksomhet}/>
                    <SykefraværsstatistikkVirksomhet sykefraværsstatistikk={sykefraværsstatistikk}/>
                </VerticalFlex>
                <StyledIaSakOversikt iaSak={iaSak}/>
            </HorisontalFlexMedToppRamme>
            <br />
            <StyledIASakshendelserOversikt sakshendelser={sakshendelser}/>
        </VerticalFlex>
    )
}
