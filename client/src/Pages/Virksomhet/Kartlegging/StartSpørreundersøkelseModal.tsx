import { IASak } from "../../../domenetyper/domenetyper";
import { IASakKartlegging } from "../../../domenetyper/iaSakKartlegging";
import { startKartlegging, useHentKartlegginger } from "../../../api/lydia-api";
import { BekreftValgModal } from "../../../components/Modal/BekreftValgModal";
import { åpneKartleggingINyFane } from "../../../util/navigasjon";
import { BodyShort, List } from "@navikt/ds-react";
import ListItem from "@navikt/ds-react/esm/list/ListItem";
import React from "react";

export function StartSpørreundersøkelseModal({
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
                <ListItem>
                    Deltakere må ha telefon med kamera for å scanne QR-koden.
                </ListItem>
                <ListItem>Det må være minst tre deltakere</ListItem>
                <ListItem>
                    For å se resultater må minst tre deltakere ha svart
                    spørsmålene.
                </ListItem>
            </List>
        </BekreftValgModal>
    );
}
