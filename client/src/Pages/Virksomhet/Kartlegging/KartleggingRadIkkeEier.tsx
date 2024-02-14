import { IASakKartlegging } from "../../../domenetyper/iaSakKartlegging";
import { BodyShort } from "@navikt/ds-react";
import { lokalDato } from "../../../util/dato";
import styled from "styled-components";
import { tabInnholdStyling } from "../../../styling/containere";

const Container = styled.div`
    ${tabInnholdStyling};
    margin-bottom: 2rem;
`;

const Rad = styled.div`
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
`;

export interface Props {
    kartlegging: IASakKartlegging
}

export const KartleggingRadIkkeEier = ({ kartlegging }: Props) => {
    const dato = kartlegging.status === "AVSLUTTET" ? kartlegging.endretTidspunkt : kartlegging.opprettetTidspunkt;
    return (
        <Container>
            <Rad>
                Kartlegging {kartlegging.status.toLowerCase()} den {dato && lokalDato(dato)} av {kartlegging.opprettetAv}
                {kartlegging.status !== "AVSLUTTET" &&
                    <BodyShort> Sist endret: {lokalDato(kartlegging.opprettetTidspunkt)}</BodyShort>
                }
            </Rad>
        </Container>
    );
};
