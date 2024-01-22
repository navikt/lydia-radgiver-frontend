import { IASak } from "../../../domenetyper/domenetyper";
import styled from "styled-components";
import { tabInnholdStyling } from "../../../styling/containere";
import { BodyShort, Button, Heading } from "@navikt/ds-react";
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
            <div>
                <Heading level="3" size="large" spacing={true}>
                    IA-Kartlegging
                </Heading>
                <BodyShort>
                    Her legger du inn og får oversikt over kartleggingene til
                    saken. Du må være på status “Kartlegges” for å jobbe med
                    kartlegginger.
                </BodyShort>
            </div>
            {iaSak.status === "KARTLEGGES" && (
                <Button onClick={opprettKartlegging}>Opprett</Button>
            )}
        </Container>
    );
};
