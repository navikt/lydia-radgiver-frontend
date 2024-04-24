import { Accordion, Button } from "@navikt/ds-react";
import React, { useState } from "react";
import { IASak } from "../../../domenetyper/domenetyper";
import { IASakKartlegging } from "../../../domenetyper/iaSakKartlegging";
import styled from "styled-components";
import { åpneKartleggingINyFane } from "../../../util/navigasjon";
import { KartleggingResultat } from "./KartleggingResultat";
import { SlettKartleggingModal } from "./SlettKartleggingModal";
import { StartSpørreundersøkelseModal } from "./StartSpørreundersøkelseModal";
import { FullførSpørreundersøkelseModal } from "./FullførSpørreundersøkelseModal";

interface NyKartleggingRadProps {
    iaSak: IASak;
    kartlegging: IASakKartlegging;
    vertId: string;
    brukerRolle: "Superbruker" | "Saksbehandler" | "Lesetilgang" | undefined;
    visSomProsent: boolean;
    kartleggingstatus: "OPPRETTET" | "PÅBEGYNT" | "AVSLUTTET" | "SLETTET";
}

const StyledActionButton = styled(Button)`
    margin-right: 1rem;
`;

export const KartleggingRadInnhold = ({
    iaSak,
    kartlegging,
    vertId,
    brukerRolle,
    kartleggingstatus,
    visSomProsent,
}: NyKartleggingRadProps) => {
    const [
        bekreftFullførKartleggingModalÅpen,
        setBekreftFullførKartleggingModalÅpen,
    ] = useState(false);
    const [
        slettSpørreundersøkelseModalÅpen,
        setSlettSpørreundersøkelseModalÅpen,
    ] = useState(false);
    const [
        bekreftStartKartleggingModalÅpen,
        setBekreftStartKartleggingModalÅpen,
    ] = useState(false);

    const MINIMUM_ANTALL_DELTAKERE = 3;
    const deltakereSomHarFullført = 4; // kartlegging.deltakereSomHarFullført
    const harNokDeltakere = deltakereSomHarFullført >= MINIMUM_ANTALL_DELTAKERE;

    if (kartleggingstatus === "SLETTET") {
        return null;
    }

    if (kartleggingstatus === "AVSLUTTET") {
        return (
            <Accordion.Content>
                <KartleggingResultat
                    iaSak={iaSak}
                    kartleggingId={kartlegging.kartleggingId}
                    visSomProsent={visSomProsent}
                />
            </Accordion.Content>
        );
    }

    if (kartleggingstatus === "OPPRETTET") {
        return (
            <Accordion.Content>
                {iaSak.status === "KARTLEGGES" &&
                    brukerRolle !== "Lesetilgang" && (
                        <>
                            <StyledActionButton
                                variant={"secondary"}
                                onClick={() =>
                                    setBekreftStartKartleggingModalÅpen(true)
                                }
                            >
                                Start kartlegging
                            </StyledActionButton>
                            {brukerRolle && (
                                <Button
                                    onClick={() =>
                                        setSlettSpørreundersøkelseModalÅpen(
                                            true,
                                        )
                                    }
                                >
                                    Slett kartlegging
                                </Button>
                            )}
                        </>
                    )}
                <StartSpørreundersøkelseModal
                    iaSak={iaSak}
                    spørreundersøkelse={kartlegging}
                    erModalÅpen={bekreftStartKartleggingModalÅpen}
                    lukkModal={() => setBekreftStartKartleggingModalÅpen(false)}
                />

                {brukerRolle && (
                    <SlettKartleggingModal
                        iaSak={iaSak}
                        spørreundersøkelse={kartlegging}
                        erModalÅpen={slettSpørreundersøkelseModalÅpen}
                        lukkModal={() =>
                            setSlettSpørreundersøkelseModalÅpen(false)
                        }
                    />
                )}
            </Accordion.Content>
        );
    }

    if (kartleggingstatus === "PÅBEGYNT") {
        return (
            <Accordion.Content>
                {iaSak.status === "KARTLEGGES" &&
                    brukerRolle !== "Lesetilgang" && (
                        <>
                            <StyledActionButton
                                variant={"secondary"}
                                onClick={() =>
                                    åpneKartleggingINyFane(
                                        kartlegging.kartleggingId,
                                        vertId,
                                        "PÅBEGYNT",
                                    )
                                }
                            >
                                Fortsett
                            </StyledActionButton>
                            <StyledActionButton
                                onClick={() =>
                                    setBekreftFullførKartleggingModalÅpen(true)
                                }
                            >
                                Fullfør
                            </StyledActionButton>
                            {brukerRolle && (
                                <Button
                                    onClick={() =>
                                        setSlettSpørreundersøkelseModalÅpen(
                                            true,
                                        )
                                    }
                                >
                                    Slett kartlegging
                                </Button>
                            )}
                            <FullførSpørreundersøkelseModal
                                iaSak={iaSak}
                                harNokDeltakere={harNokDeltakere}
                                spørreundersøkelse={kartlegging}
                                erModalÅpen={bekreftFullførKartleggingModalÅpen}
                                lukkModal={() =>
                                    setBekreftFullførKartleggingModalÅpen(false)
                                }
                            />
                        </>
                    )}

                {brukerRolle && (
                    <SlettKartleggingModal
                        iaSak={iaSak}
                        spørreundersøkelse={kartlegging}
                        erModalÅpen={slettSpørreundersøkelseModalÅpen}
                        lukkModal={() =>
                            setSlettSpørreundersøkelseModalÅpen(false)
                        }
                    />
                )}
            </Accordion.Content>
        );
    }
};
