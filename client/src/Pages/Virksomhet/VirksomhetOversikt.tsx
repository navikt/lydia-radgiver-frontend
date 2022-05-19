import {
    IASak,
    IASakshendelse,
    SykefraversstatistikkVirksomhet,
    Virksomhet,
} from "../../domenetyper";
import { VirksomhetInformasjon } from "./VirksomhetInformasjon";
import styled from "styled-components";
import { SykefraværsstatistikkVirksomhet } from "./SykefraværsstatistikkVirksomhet";
import { StyledIASakshendelserOversikt } from "./IASakshendelserOversikt";
import { IASakOversikt } from "./IASakOversikt";
import {Detail, Heading} from "@navikt/ds-react";

const VerticalFlex = styled.div`
    display: flex;
    flex-direction: column;
`;

const HorisontalFlex = styled.div`
    display: flex;
    gap: 2rem;
    flex-direction: row;
`;

const HorisontalFlexMedToppRamme = styled(HorisontalFlex)`
    border-top: 1px solid black;
`;

const StyledVirksomhetsInformasjon = styled(VirksomhetInformasjon)`
    justify-content: space-between;
    margin-top: 1rem;
    margin-bottom: 1rem;
`;

interface VirksomhetOversiktProps {
    virksomhet: Virksomhet;
    sykefraværsstatistikk: SykefraversstatistikkVirksomhet;
    iaSak?: IASak;
    sakshendelser: IASakshendelse[];
    muterState?: () => void;
}

export const VirksomhetOversikt = ({
    virksomhet,
    sykefraværsstatistikk,
    iaSak,
    sakshendelser,
    muterState,
}: VirksomhetOversiktProps) => {
    return (
        <>
            <VerticalFlex>
                <div style={{display:"flex", alignItems: "flex-end", flexDirection: "row"}}>
                    <Heading level={"2"} size={"large"} style={{flex: "3"}}>
                        {virksomhet.navn}
                    </Heading>
                    {
                        virksomhet.sektor && (
                        <Detail size={"medium"} style={{color: "#707070", flex: "1"}}>
                            Sektor: {virksomhet.sektor}
                        </Detail>)
                    }

                </div>
                <HorisontalFlexMedToppRamme>
                    <VerticalFlex style={{ flex: 3 }}>
                        <StyledVirksomhetsInformasjon virksomhet={virksomhet} />
                        <SykefraværsstatistikkVirksomhet
                            sykefraværsstatistikk={sykefraværsstatistikk}
                        />
                    </VerticalFlex>
                    <IASakOversikt
                        iaSak={iaSak}
                        orgnummer={virksomhet.orgnr}
                        muterState={muterState}
                    />
                </HorisontalFlexMedToppRamme>
            </VerticalFlex>
            <br />
            <StyledIASakshendelserOversikt sakshendelser={sakshendelser} />
        </>
    );
};
