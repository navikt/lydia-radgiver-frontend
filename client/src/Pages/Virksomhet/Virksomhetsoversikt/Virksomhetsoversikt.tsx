import styled from "styled-components";
import { Heading } from "@navikt/ds-react";
import { IASak } from "../../../domenetyper/domenetyper";
import { IASakOversikt } from "./IASakStatus/IASakOversikt";
import { VirksomhetInformasjon } from "./VirksomhetInformasjon";
import { contentSpacing } from "../../../styling/contentSpacing";
import { BrregStatus } from "./BrregStatus";
import { Virksomhet } from "../../../domenetyper/virksomhet";
import VirksomhetinfoHeader from "./VirksomhetsinfoHeader";
import { erIDev } from "../../../components/Dekoratør/Dekoratør";

const OversiktsContainer = styled.div`
    display: flex;
    flex-direction: column;

    padding-bottom: ${contentSpacing.mobileY};
`;

const VirksomhetsnavnContainer = styled.div`
    display: flex;
    flex-wrap: wrap;
    column-gap: 1rem;

    span {
        margin-bottom: 0.25rem;
        margin-top: 0.25rem;
    }
`;

const VirksomhetsinfoContainer = styled.div`
    display: flex;
    flex-wrap: wrap;
    gap: 2rem;
`;

interface Props {
    virksomhet: Virksomhet;
    iaSak?: IASak;
}

export const Virksomhetsoversikt = ({ virksomhet, iaSak }: Props) => {
    if (erIDev) {
        // TODO: Fjern "Virksomhetsoversikt" og rename "NyVirksomhetsoversikt" til "Virksomhetsoversikt" når det er klart for produksjon
        return <NyVirksomhetsoversikt virksomhet={virksomhet} iaSak={iaSak} />;
    }

    return (
        <OversiktsContainer>
            <VirksomhetsnavnContainer>
                <Heading level={"2"} size={"large"}>
                    {virksomhet.navn}
                </Heading>
                <BrregStatus status={virksomhet.status} />
            </VirksomhetsnavnContainer>
            <VirksomhetsinfoContainer>
                <VirksomhetInformasjon virksomhet={virksomhet} />
                <IASakOversikt iaSak={iaSak} orgnummer={virksomhet.orgnr} />
            </VirksomhetsinfoContainer>
        </OversiktsContainer>
    );
}

function NyVirksomhetsoversikt({ virksomhet, iaSak }: Props) {
    /* return (
        <VirksomhetinfoHeader iaSak={iaSak} virksomhet={virksomhet} />
    ); */
    return (
        <OversiktsContainer>
            <VirksomhetinfoHeader iaSak={iaSak} virksomhet={virksomhet} />
            <VirksomhetsinfoContainer>
                <VirksomhetInformasjon virksomhet={virksomhet} />
                <IASakOversikt iaSak={iaSak} orgnummer={virksomhet.orgnr} />
            </VirksomhetsinfoContainer>
        </OversiktsContainer>
    );
}