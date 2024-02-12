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
    return (
        <Container>
            <Rad>
                Kartlegging opprettet den {lokalDato(kartlegging.opprettetTidspunkt)} av {kartlegging.opprettetAv}
                <BodyShort> Sist endret: {lokalDato(kartlegging.opprettetTidspunkt)}</BodyShort>
            </Rad>

        </Container>
    );
};
