import { IASak } from "../../../domenetyper/domenetyper";
import { IASakKartlegging } from "../../../domenetyper/iaSakKartlegging";
import {
    slettKartlegging,
    useHentNyeKartlegginger,
} from "../../../api/lydia-api";
import { BekreftValgModal } from "../../../components/Modal/BekreftValgModal";
import { lokalDatoMedKlokkeslett } from "../../../util/dato";
import React from "react";
import { IaSakProsess } from "../../../domenetyper/iaSakProsess";

export function SlettKartleggingModal({
    iaSak,
    spørreundersøkelse,
    samarbeid,
    erModalÅpen,
    lukkModal,
}: {
    iaSak: IASak;
    samarbeid: IaSakProsess;
    spørreundersøkelse: IASakKartlegging;
    erModalÅpen: boolean;
    lukkModal: () => void;
}) {
    const { mutate: muterKartlegginger } = useHentNyeKartlegginger(
        iaSak.orgnr,
        iaSak.saksnummer,
        samarbeid.id,
    );
    const slett = () => {
        slettKartlegging(
            iaSak.orgnr,
            iaSak.saksnummer,
            spørreundersøkelse.kartleggingId,
        ).then(() => {
            muterKartlegginger();
            lukkModal();
        });
    };

    return (
        <BekreftValgModal
            onConfirm={slett}
            onCancel={() => lukkModal()}
            åpen={erModalÅpen}
            title="Er du sikker på at du vil slette denne behovsvurderingen?"
            description={`Behovsvurderingen som slettes er "Behovsvurdering opprettet ${lokalDatoMedKlokkeslett(spørreundersøkelse.opprettetTidspunkt)}".`}
        />
    );
}
