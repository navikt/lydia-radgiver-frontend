import { IASak } from "../../../domenetyper/domenetyper";
import { IASakKartlegging } from "../../../domenetyper/iaSakKartlegging";
import styled from "styled-components";
import {
    avsluttKartlegging,
} from "../../../api/lydia-api/kartlegging";
import { useHentIASaksStatus } from "../../../api/lydia-api/sak";
import { useHentBehovsvurderingerMedProsess } from "../../../api/lydia-api/kartlegging";
import { BekreftValgModal } from "../../../components/Modal/BekreftValgModal";
import { BodyLong } from "@navikt/ds-react";
import React from "react";
import { IaSakProsess } from "../../../domenetyper/iaSakProsess";

const EkstraInfoTekstIModal = styled.div`
    margin-top: 1rem;
`;

export function FullførSpørreundersøkelseModal({
    iaSak,
    samarbeid,
    behovsvurdering,
    erModalÅpen,
    lukkModal,
    harNokDeltakere,
}: {
    iaSak: IASak;
    samarbeid: IaSakProsess;
    behovsvurdering: IASakKartlegging;
    erModalÅpen: boolean;
    harNokDeltakere: boolean;
    lukkModal: () => void;
}) {
    const { mutate: muterKartlegginger } = useHentBehovsvurderingerMedProsess(
        iaSak.orgnr,
        iaSak.saksnummer,
        samarbeid.id,
    );
    const { mutate: oppdaterSaksStatus } = useHentIASaksStatus(
        iaSak.orgnr,
        iaSak.saksnummer,
    );

    const fullførSpørreundersøkelse = () => {
        avsluttKartlegging(
            iaSak.orgnr,
            iaSak.saksnummer,
            behovsvurdering.kartleggingId,
        ).then(() => {
            muterKartlegginger();
            oppdaterSaksStatus();
        });
    };

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
