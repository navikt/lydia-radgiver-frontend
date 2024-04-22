import { Accordion, BodyShort, Button, List } from "@navikt/ds-react";
import { BekreftValgModal } from "../../../components/Modal/BekreftValgModal";
import React, { useState } from "react";
import { IASak } from "../../../domenetyper/domenetyper";
import {
    slettKartlegging,
    startKartlegging, useHentBrukerinformasjon,
    useHentKartlegginger,
} from "../../../api/lydia-api";
import { IASakKartlegging } from "../../../domenetyper/iaSakKartlegging";
import styled from "styled-components";
import { åpneKartleggingINyFane } from "../../../util/navigasjon";
import { lokalDatoMedKlokkeslett } from "../../../util/dato";
import ListItem from "@navikt/ds-react/esm/list/ListItem";

interface NyKartleggingRadProps {
    iaSak: IASak;
    kartlegging: IASakKartlegging;
    vertId: string;
    brukerErEierAvSak: boolean;
}

const StyledActionButton = styled(Button)`
    margin-right: 1rem;
`;

export const NyKartleggingRad = ({
    iaSak,
    kartlegging,
    vertId,
    brukerErEierAvSak,
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

    const {data:brukerInfo} = useHentBrukerinformasjon()

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
            {iaSak.status === "KARTLEGGES" && (brukerInfo?.rolle !== "Lesetilgang") &&(
                <>
                    <StyledActionButton
                        variant={"secondary"}
                        onClick={() =>
                            setBekreftStartKartleggingModalÅpen(true)
                        }
                    >
                        Start kartlegging
                    </StyledActionButton>
                    {brukerErEierAvSak &&
                        <Button onClick={() => setSlettKartleggingModalÅpen(true)}>
                            Slett kartlegging
                        </Button>
                    }
                </>
            )}

            <BekreftValgModal
                jaTekst={"Start"}
                onConfirm={() => {
                    startKartleggingen();
                    åpneKartleggingINyFane(
                        kartlegging.kartleggingId,
                        vertId,
                        "OPPRETTET",
                    );
                    setBekreftStartKartleggingModalÅpen(false);
                }}
                onCancel={() => {
                    setBekreftStartKartleggingModalÅpen(false);
                }}
                åpen={bekreftStartKartleggingModalÅpen}
                title={"Start kartlegging"}
            >
                <br />
                <BodyShort weight={"semibold"}>Før du starter kartlegging, husk at:</BodyShort>
                <List>
                    <ListItem>
                        Deltakere må ha telefon med kamera for å scanne QR-koden.
                    </ListItem>
                    <ListItem>
                        Det må være minst tre deltakere
                    </ListItem>
                    <ListItem>
                        For å se resultater må minst tre deltakere ha svart spørsmålene.
                    </ListItem>
                </List>
            </BekreftValgModal>
            {brukerErEierAvSak &&
                <BekreftValgModal
                    onConfirm={slett}
                    onCancel={() => {
                        setSlettKartleggingModalÅpen(false);
                    }}
                    åpen={slettKartleggingModalÅpen}
                    title="Er du sikker på at du vil slette denne kartleggingen?"
                    description={`Kartleggingen som slettes er "Kartlegging opprettet ${lokalDatoMedKlokkeslett(kartlegging.opprettetTidspunkt)}".`}
                />
            }
        </Accordion.Content>
    );
};
