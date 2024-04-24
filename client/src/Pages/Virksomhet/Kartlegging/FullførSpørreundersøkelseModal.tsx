import { IASak } from "../../../domenetyper/domenetyper";
import { IASakKartlegging } from "../../../domenetyper/iaSakKartlegging";
import styled from "styled-components";
import {
    avsluttKartlegging,
    useHentKartlegginger,
} from "../../../api/lydia-api";
import { BekreftValgModal } from "../../../components/Modal/BekreftValgModal";
import { BodyLong } from "@navikt/ds-react";
import React from "react";

const EkstraInfoTekstIModal = styled.div`
    margin-top: 1rem;
`;

export function FullførSpørreundersøkelseModal({
    iaSak,
    spørreundersøkelse,
    erModalÅpen,
    lukkModal,
    harNokDeltakere,
}: {
    iaSak: IASak;
    spørreundersøkelse: IASakKartlegging;
    erModalÅpen: boolean;
    harNokDeltakere: boolean;
    lukkModal: () => void;
}) {
    const { mutate: muterKartlegginger } = useHentKartlegginger(
        iaSak.orgnr,
        iaSak.saksnummer,
    );

    const fullførSpørreundersøkelse = () => {
        avsluttKartlegging(
            iaSak.orgnr,
            iaSak.saksnummer,
            spørreundersøkelse.kartleggingId,
        ).then(() => {
            muterKartlegginger();
        });
    };

    return (
        <BekreftValgModal
            onConfirm={fullførSpørreundersøkelse}
            onCancel={() => lukkModal()}
            åpen={erModalÅpen}
            title={"Er du sikker på at du vil fullføre kartleggingen?"}
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
