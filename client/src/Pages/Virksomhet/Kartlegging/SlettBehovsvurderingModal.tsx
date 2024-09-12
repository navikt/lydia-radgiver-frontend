import { IASak } from "../../../domenetyper/domenetyper";
import { IASakKartlegging } from "../../../domenetyper/iaSakKartlegging";
import {
    slettKartlegging,
    useHentBehovsvurderingerMedProsess,
} from "../../../api/lydia-api";
import { BekreftValgModal } from "../../../components/Modal/BekreftValgModal";
import { lokalDatoMedKlokkeslett } from "../../../util/dato";
import React from "react";
import { IaSakProsess } from "../../../domenetyper/iaSakProsess";

export function SlettBehovsvurderingModal({
    iaSak,
    behovsvurdering,
    samarbeid,
    erModalÅpen,
    lukkModal,
}: {
    iaSak: IASak;
    samarbeid: IaSakProsess;
    behovsvurdering: IASakKartlegging;
    erModalÅpen: boolean;
    lukkModal: () => void;
}) {
    const { mutate: muterBehovsvurderinger } =
        useHentBehovsvurderingerMedProsess(
            iaSak.orgnr,
            iaSak.saksnummer,
            samarbeid.id,
        );
    const slett = () => {
        slettKartlegging(
            iaSak.orgnr,
            iaSak.saksnummer,
            behovsvurdering.kartleggingId,
        ).then(() => {
            muterBehovsvurderinger();
            lukkModal();
        });
    };

    return (
        <BekreftValgModal
            onConfirm={slett}
            onCancel={() => lukkModal()}
            åpen={erModalÅpen}
            title="Er du sikker på at du vil slette denne behovsvurderingen?"
            description={`Behovsvurderingen som slettes er "Behovsvurdering opprettet ${lokalDatoMedKlokkeslett(behovsvurdering.opprettetTidspunkt)}".`}
        />
    );
}
