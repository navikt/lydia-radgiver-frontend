import { Accordion, BodyLong, Button } from "@navikt/ds-react";
import { BekreftValgModal } from "../../../components/Modal/BekreftValgModal";
import React, { useState } from "react";
import { IASak } from "../../../domenetyper/domenetyper";
import {
    slettKartlegging,
    startKartlegging,
    useHentKartlegginger,
} from "../../../api/lydia-api";
import { IASakKartlegging } from "../../../domenetyper/iaSakKartlegging";
import styled from "styled-components";
import { åpneKartleggingINyFane } from "../../../util/navigasjon";
import { lokalDatoMedKlokkeslett } from "../../../util/dato";

interface NyKartleggingRadProps {
    iaSak: IASak;
    kartlegging: IASakKartlegging;
    vertId: string;
}

const StyledActionButton = styled(Button)`
    margin-right: 1rem;
`;

export const NyKartleggingRad = ({
    iaSak,
    kartlegging,
    vertId,
}: NyKartleggingRadProps) => {
    const [
        bekreftStartKartleggingModalÅpen,
        setBekreftStartKartleggingModalÅpen,
    ] = useState(false);
    const [slettKartleggingModalÅpen, setSlettKartleggingModalÅpen] =
        useState(false);

    const { mutate: muterKartlegginger } = useHentKartlegginger(
        iaSak.orgnr,
        iaSak.saksnummer,
    );

    const startKartleggingen = () => {
        startKartlegging(
            iaSak.orgnr,
            iaSak.saksnummer,
            kartlegging.kartleggingId,
        ).then(() => {
            muterKartlegginger();
        });
    };

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
                <>
                    <StyledActionButton
                        variant={"secondary"}
                        onClick={() =>
                            setBekreftStartKartleggingModalÅpen(true)
                        }
                    >
                        Start kartlegging
                    </StyledActionButton>
                    <Button onClick={() => setSlettKartleggingModalÅpen(true)}>
                        Slett kartlegging
                    </Button>
                </>
            )}

            <BekreftValgModal
                jaTekst={"Fortsett"}
                onConfirm={() => {
                    startKartleggingen();
                    åpneKartleggingINyFane(kartlegging.kartleggingId, vertId);
                    setBekreftStartKartleggingModalÅpen(false);
                }}
                onCancel={() => {
                    setBekreftStartKartleggingModalÅpen(false);
                }}
                åpen={bekreftStartKartleggingModalÅpen}
                title={"Før du går videre..."}
            >
                <BodyLong>
                    <br />
                    Du er i ferd med å starte kartlegging med denne
                    virksomheten.
                    <br />
                    Sørg for at alle partene er representert før du starter.
                    <br />
                    Når du klikker fortsett åpnes det et nytt vindu du kan vise
                    til deltakerne i møtet.
                    <br />
                    Der vil deltakerne kunne koble til med sine enheter.
                </BodyLong>
            </BekreftValgModal>
            <BekreftValgModal
                onConfirm={slett}
                onCancel={() => {
                    setSlettKartleggingModalÅpen(false);
                }}
                åpen={slettKartleggingModalÅpen}
                title="Er du sikker på at du vil slette denne kartleggingen?"
                description={`Kartleggingen som slettes er "Kartlegging opprettet ${lokalDatoMedKlokkeslett(kartlegging.opprettetTidspunkt)}".`}
            />
        </Accordion.Content>
    );
};
