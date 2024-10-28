import styled from "styled-components";
import { BekreftValgModal } from "../../../components/Modal/BekreftValgModal";
import { BodyLong } from "@navikt/ds-react";
import React from "react";

const EkstraInfoTekstIModal = styled.div`
    margin-top: 1rem;
`;

export function FullførSpørreundersøkelseModal({
    erModalÅpen,
    lukkModal,
    harNokDeltakere,
    fullførSpørreundersøkelse,
}: {
    erModalÅpen: boolean;
    harNokDeltakere: boolean;
    lukkModal: () => void;
    fullførSpørreundersøkelse: () => void;
}) {
    return (
        <BekreftValgModal
            onConfirm={fullførSpørreundersøkelse}
            onCancel={() => lukkModal()}
            åpen={erModalÅpen}
            title={"Er du sikker på at du vil fullføre behovsvurderingen?"}
        >
            {harNokDeltakere && (
                <EkstraInfoTekstIModal>
                    <BodyLong>
                        Minst 3 deltakere må ha svart for å kunne vise
                        resultater.
                    </BodyLong>
                </EkstraInfoTekstIModal>
            )}
        </BekreftValgModal>
    );
}
