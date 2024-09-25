import { IASak } from "../../../domenetyper/domenetyper";
import { IASakKartlegging } from "../../../domenetyper/iaSakKartlegging";
import {
    startKartlegging,
    useHentBehovsvurderingerMedProsess,
} from "../../../api/lydia-api";
import { BekreftValgModal } from "../../../components/Modal/BekreftValgModal";
import { åpneKartleggingINyFane } from "../../../util/navigasjon";
import { BodyShort, List } from "@navikt/ds-react";
import React from "react";
import { IaSakProsess } from "../../../domenetyper/iaSakProsess";

export function StartSpørreundersøkelseModal({
    iaSak,
    spørreundersøkelse,
    erModalÅpen,
    lukkModal,
    samarbeid,
}: {
    iaSak: IASak;
    spørreundersøkelse: IASakKartlegging;
    erModalÅpen: boolean;
    lukkModal: () => void;
    samarbeid: IaSakProsess;
}) {
    const { mutate: muterKartlegginger } = useHentBehovsvurderingerMedProsess(
        iaSak.orgnr,
        iaSak.saksnummer,
        samarbeid.id,
    );

    const startKartleggingen = () => {
        startKartlegging(
            iaSak.orgnr,
            iaSak.saksnummer,
            spørreundersøkelse.kartleggingId,
        ).then(() => {
            muterKartlegginger();
        });
    };

    return (
        <BekreftValgModal
            jaTekst={"Start"}
            onConfirm={() => {
                startKartleggingen();
                åpneKartleggingINyFane(
                    spørreundersøkelse.kartleggingId,
                    "OPPRETTET",
                );
                lukkModal();
            }}
            onCancel={() => lukkModal()}
            åpen={erModalÅpen}
            title={"Start behovsvurdering"}
        >
            <br />
            <BodyShort weight={"semibold"}>
                Før du starter behovsvurderingen, husk at:
            </BodyShort>
            <List>
                <List.Item>
                    Deltakere må ha telefon med kamera for å scanne QR-koden.
                </List.Item>
                <List.Item>Det må være minst tre deltakere</List.Item>
                <List.Item>
                    For å se resultater må minst tre deltakere ha svart på
                    spørsmålene.
                </List.Item>
            </List>
        </BekreftValgModal>
    );
}
