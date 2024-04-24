import { IASak } from "../../../domenetyper/domenetyper";
import { IASakKartlegging } from "../../../domenetyper/iaSakKartlegging";
import { slettKartlegging, useHentKartlegginger } from "../../../api/lydia-api";
import { BekreftValgModal } from "../../../components/Modal/BekreftValgModal";
import { lokalDatoMedKlokkeslett } from "../../../util/dato";
import React from "react";

export function SlettKartleggingModal({
    iaSak,
    spørreundersøkelse,
    erModalÅpen,
    lukkModal,
}: {
    iaSak: IASak;
    spørreundersøkelse: IASakKartlegging;
    erModalÅpen: boolean;
    lukkModal: () => void;
}) {
    const { mutate: muterKartlegginger } = useHentKartlegginger(
        iaSak.orgnr,
        iaSak.saksnummer,
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
            title="Er du sikker på at du vil slette denne kartleggingen?"
            description={`Kartleggingen som slettes er "Kartlegging opprettet ${lokalDatoMedKlokkeslett(spørreundersøkelse.opprettetTidspunkt)}".`}
        />
    );
}
