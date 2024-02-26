import { Accordion, Button } from "@navikt/ds-react";
import React, { useState } from "react";
import { KartleggingResultat } from "./KartleggingResultat";
import { IASak } from "../../../domenetyper/domenetyper";
import { slettKartlegging, useHentKartlegginger } from "../../../api/lydia-api";
import { BekreftValgModal } from "../../../components/Modal/BekreftValgModal";
import { IASakKartlegging } from "../../../domenetyper/iaSakKartlegging";
import { lokalDatoMedKlokkeslett } from "../../../util/dato";

interface AvsluttetKartleggingProps {
    iaSak: IASak;
    kartlegging: IASakKartlegging;
}

export const FullførtKartleggingRad = ({
    iaSak,
    kartlegging,
}: AvsluttetKartleggingProps) => {
    const [slettKartleggingModalÅpen, setSlettKartleggingModalÅpen] =
        useState(false);

    const { mutate: muterKartlegginger } = useHentKartlegginger(
        iaSak.orgnr,
        iaSak.saksnummer,
    );
    const slett = () => {
        slettKartlegging(
            iaSak.orgnr,
            iaSak.saksnummer,
            kartlegging.kartleggingId,
        ).then(() => {
            muterKartlegginger();
            setSlettKartleggingModalÅpen(false);
        });
    };

    return (
        <Accordion.Content>
            {iaSak.status === "KARTLEGGES" && (
                <Button onClick={() => setSlettKartleggingModalÅpen(true)}>
                    Slett kartlegging
                </Button>
            )}
            <BekreftValgModal
                onConfirm={slett}
                onCancel={() => {
                    setSlettKartleggingModalÅpen(false);
                }}
                åpen={slettKartleggingModalÅpen}
                title="Er du sikker på at du vil slette denne kartleggingen?"
                description={`Kartleggingen som slettes er "Kartlegging opprettet ${lokalDatoMedKlokkeslett(kartlegging.opprettetTidspunkt)}".`}
            />
            <KartleggingResultat
                iaSak={iaSak}
                kartleggingId={kartlegging.kartleggingId}
            />
        </Accordion.Content>
    );
};
