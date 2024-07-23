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

interface KartleggingRadInnhold {
    iaSak: IASak;
    kartlegging: IASakKartlegging;
    brukerRolle: "Superbruker" | "Saksbehandler" | "Lesetilgang" | undefined;
    brukerErEierAvSak: boolean;
    kartleggingstatus: "OPPRETTET" | "PÅBEGYNT" | "AVSLUTTET" | "SLETTET";
}

const StyledActionButton = styled(Button)`
    margin-right: 1rem;
`;

export const KartleggingRadInnhold = ({
    iaSak,
    kartlegging,
    brukerRolle,
    brukerErEierAvSak,
    kartleggingstatus,
}: KartleggingRadInnhold) => {
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
    const deltakereSomHarFullført = 1; // kartlegging.deltakereSomHarFullført // TODO: Viser altid, Bytt ut etter oppdatert endepunkt er på plass
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
                />
            </Accordion.Content>
        );
    }

    if (kartleggingstatus === "OPPRETTET") {
        return (
            <Accordion.Content>
                {(iaSak.status === "KARTLEGGES" ||
                    iaSak.status === "VI_BISTÅR") &&
                    brukerRolle !== "Lesetilgang" && (
                        <>
                            <StyledActionButton
                                onClick={() =>
                                    setBekreftStartKartleggingModalÅpen(true)
                                }
                            >
                                Start
                            </StyledActionButton>
                            {brukerErEierAvSak && (
                                <Button
                                    variant={"secondary"}
                                    onClick={() =>
                                        setSlettSpørreundersøkelseModalÅpen(
                                            true,
                                        )
                                    }
                                >
                                    Slett
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
                {(iaSak.status === "KARTLEGGES" ||
                    iaSak.status === "VI_BISTÅR") &&
                    brukerRolle !== "Lesetilgang" && (
                        <>
                            <StyledActionButton
                                variant={"secondary"}
                                onClick={() =>
                                    åpneKartleggingINyFane(
                                        kartlegging.kartleggingId,
                                        "PÅBEGYNT",
                                    )
                                }
                            >
                                Fortsett
                            </StyledActionButton>
                            {brukerErEierAvSak && (
                                <>
                                    <StyledActionButton
                                        onClick={() =>
                                            setBekreftFullførKartleggingModalÅpen(
                                                true,
                                            )
                                        }
                                    >
                                        Fullfør
                                    </StyledActionButton>
                                    <StyledActionButton
                                        variant={"danger"}
                                        onClick={() =>
                                            setSlettSpørreundersøkelseModalÅpen(
                                                true,
                                            )
                                        }
                                    >
                                        Slett
                                    </StyledActionButton>
                                </>
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
