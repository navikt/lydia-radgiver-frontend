import {
    IASak,
    Sakshistorikk,
    SykefraversstatistikkVirksomhet,
    Virksomhet, VirksomhetStatusEnum,
} from "../../domenetyper";
import {VirksomhetInformasjon} from "./VirksomhetInformasjon";
import styled from "styled-components";
import {SykefraværsstatistikkVirksomhet} from "./SykefraværsstatistikkVirksomhet";
import {StyledSamarbeidshistorikk} from "./IASakshendelserOversikt";
import {IASakOversikt} from "./IASakOversikt";
import {Detail, Heading, Tag} from "@navikt/ds-react";

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
    samarbeidshistorikk: Sakshistorikk[];
    muterState?: () => void;
}

export const VirksomhetOversikt = ({
   virksomhet,
   sykefraværsstatistikk,
   iaSak,
   samarbeidshistorikk,
   muterState,
}: VirksomhetOversiktProps) => {
    return (
        <>
            <VerticalFlex>
                <div style={{display: "flex", alignItems: "flex-end", flexDirection: "row"}}>
                    <span style={{flex: "3", display: "flex", flexDirection: "row"}}>
                        <Heading level={"2"} size={"large"}>
                            {virksomhet.navn}
                        </Heading>
                        {
                            (virksomhet.status == VirksomhetStatusEnum.enum.FJERNET
                                || virksomhet.status == VirksomhetStatusEnum.enum.SLETTET)
                            && <Tag variant={"warning"}
                                    size={"medium"}
                                    style={{
                                        marginLeft: "1rem", alignSelf: "center", textTransform: "lowercase",
                                        background: "#E5E5E5",
                                        borderColor: "#8F8F8F"
                                    }}>
                                {virksomhet.status}
                            </Tag>
                        }
                    </span>
                    {
                        virksomhet.sektor && (
                            <Detail size={"medium"} style={{color: "#707070", flex: "1"}}>
                                Sektor: {virksomhet.sektor}
                            </Detail>)
                    }

                </div>
                <HorisontalFlexMedToppRamme>
                    <VerticalFlex style={{flex: 3}}>
                        <StyledVirksomhetsInformasjon virksomhet={virksomhet}/>
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
            <br/>
            <StyledSamarbeidshistorikk samarbeidshistorikk={samarbeidshistorikk}/>
        </>
    );
};
