import {IASak, IASakshendelse, SykefraversstatistikkVirksomhet, Virksomhet} from "../../domenetyper";
import {VirksomhetInformasjon} from "./VirksomhetInformasjon";
import styled from "styled-components";
import {SykefraværsstatistikkVirksomhet} from "./SykefraværsstatistikkVirksomhet";
import {StyledIASakshendelserOversikt} from "./IASakshendelserOversikt";
import {IASakOversikt} from "./IASakOversikt";
import {Heading} from "@navikt/ds-react";

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
            <Heading level={"2"} size={"large"}>{virksomhet.navn}</Heading>
            <HorisontalFlexMedToppRamme>
                <VerticalFlex>
                    <StyledVirksomhetsInformasjon virksomhet={virksomhet}/>
                    <SykefraværsstatistikkVirksomhet sykefraværsstatistikk={sykefraværsstatistikk}/>
                </VerticalFlex>
                <IASakOversikt iaSak={iaSak} orgnummer={virksomhet.orgnr}/>
            </HorisontalFlexMedToppRamme>
            <br />
            <StyledIASakshendelserOversikt sakshendelser={sakshendelser}/>
        </VerticalFlex>
    )
}
