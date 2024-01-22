import { IASak } from "../../../domenetyper/domenetyper";
import styled from "styled-components";
import { tabInnholdStyling } from "../../../styling/containere";
import { Button } from "@navikt/ds-react";
import { nyKartleggingPåSak } from "../../../api/lydia-api";

const Container = styled.div`
    height: 100%;
    display: flex;
    flex-direction: column;
    gap: 3rem;
    ${tabInnholdStyling};
`;
interface Props {
    iaSak: IASak;
}

export const KartleggingFane = ({ iaSak }: Props) => {
    const opprettKartlegging = () => {
        nyKartleggingPåSak(iaSak.orgnr, iaSak.saksnummer);
    };

    return (
        <Container>
            <Button onClick={opprettKartlegging}>Opprett</Button>
        </Container>
    );
};
