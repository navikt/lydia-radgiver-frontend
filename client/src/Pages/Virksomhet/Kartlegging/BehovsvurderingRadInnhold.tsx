import { Accordion, Button } from "@navikt/ds-react";
import React, { useState } from "react";
import { IASak } from "../../../domenetyper/domenetyper";
import { IASakKartlegging } from "../../../domenetyper/iaSakKartlegging";
import styled from "styled-components";
import { åpneKartleggingINyFane } from "../../../util/navigasjon";
import { BehovsvurderingResultat } from "./BehovsvurderingResultat";
import { SlettBehovsvurderingModal } from "./SlettBehovsvurderingModal";
import { StartSpørreundersøkelseModal } from "./StartSpørreundersøkelseModal";
import { FullførSpørreundersøkelseModal } from "./FullførSpørreundersøkelseModal";
import EksportVisning from "./EksportVisning";
import { FlyttTilAnnenProsess } from "./FlyttTilAnnenProsess";
import { IaSakProsess } from "../../../domenetyper/iaSakProsess";

const ExportVisningContainer = styled.div`
    display: flex;
    justify-content: right;
`;

const StyledActionButton = styled(Button)`
    margin-right: 1rem;
`;

export const BehovsvurderingRadInnhold = ({
    iaSak,
    behovsvurdering,
    samarbeid,
    brukerRolle,
    brukerErEierAvSak,
    behovsvurderingStatus,
}: {
    iaSak: IASak;
    behovsvurdering: IASakKartlegging;
    samarbeid: IaSakProsess;
    brukerRolle: "Superbruker" | "Saksbehandler" | "Lesetilgang" | undefined;
    brukerErEierAvSak: boolean;
    behovsvurderingStatus: "OPPRETTET" | "PÅBEGYNT" | "AVSLUTTET" | "SLETTET";
}) => {
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

    const [erIEksportMode, setErIEksportMode] = useState(false);

    const MINIMUM_ANTALL_DELTAKERE = 3;
    const deltakereSomHarFullført = 1; // kartlegging.deltakereSomHarFullført // TODO: Viser altid, Bytt ut etter oppdatert endepunkt er på plass
    const harNokDeltakere = deltakereSomHarFullført >= MINIMUM_ANTALL_DELTAKERE;

    if (iaSak !== undefined) {
        if (behovsvurderingStatus === "SLETTET") {
            return null;
        }

        if (behovsvurderingStatus === "AVSLUTTET") {
            return (
                <Accordion.Content>
                    <ExportVisningContainer>
                        {brukerErEierAvSak && (
                            <FlyttTilAnnenProsess
                                gjeldendeSamarbeid={samarbeid}
                                iaSak={iaSak}
                                behovsvurdering={behovsvurdering}
                                dropdownSize="small"
                            />
                        )}
                        <EksportVisning
                            iaSak={iaSak}
                            kartlegging={behovsvurdering}
                            erIEksportMode={erIEksportMode}
                            setErIEksportMode={setErIEksportMode}
                        />
                    </ExportVisningContainer>
                    <BehovsvurderingResultat
                        iaSak={iaSak}
                        behovsvurderingId={behovsvurdering.kartleggingId}
                    />
                </Accordion.Content>
            );
        }

        if (behovsvurderingStatus === "OPPRETTET") {
            return (
                <Accordion.Content>
                    {(iaSak.status === "KARTLEGGES" ||
                        iaSak.status === "VI_BISTÅR") &&
                        brukerRolle !== "Lesetilgang" && (
                            <>
                                <StyledActionButton
                                    onClick={() =>
                                        setBekreftStartKartleggingModalÅpen(
                                            true,
                                        )
                                    }
                                >
                                    Start
                                </StyledActionButton>
                                {brukerErEierAvSak && (
                                    <StyledActionButton
                                        variant={"secondary"}
                                        onClick={() =>
                                            setSlettSpørreundersøkelseModalÅpen(
                                                true,
                                            )
                                        }
                                    >
                                        Slett
                                    </StyledActionButton>
                                )}
                                <FlyttTilAnnenProsess
                                    gjeldendeSamarbeid={samarbeid}
                                    iaSak={iaSak}
                                    behovsvurdering={behovsvurdering}
                                />
                            </>
                        )}
                    <StartSpørreundersøkelseModal
                        iaSak={iaSak}
                        spørreundersøkelse={behovsvurdering}
                        samarbeid={samarbeid}
                        erModalÅpen={bekreftStartKartleggingModalÅpen}
                        lukkModal={() =>
                            setBekreftStartKartleggingModalÅpen(false)
                        }
                    />
                    {brukerRolle && (
                        <SlettBehovsvurderingModal
                            iaSak={iaSak}
                            samarbeid={samarbeid}
                            behovsvurdering={behovsvurdering}
                            erModalÅpen={slettSpørreundersøkelseModalÅpen}
                            lukkModal={() =>
                                setSlettSpørreundersøkelseModalÅpen(false)
                            }
                        />
                    )}
                </Accordion.Content>
            );
        }

        if (behovsvurderingStatus === "PÅBEGYNT") {
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
                                            behovsvurdering.kartleggingId,
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
                                        <FlyttTilAnnenProsess
                                            gjeldendeSamarbeid={samarbeid}
                                            iaSak={iaSak}
                                            behovsvurdering={behovsvurdering}
                                        />
                                    </>
                                )}
                                <FullførSpørreundersøkelseModal
                                    iaSak={iaSak}
                                    samarbeid={samarbeid}
                                    harNokDeltakere={harNokDeltakere}
                                    behovsvurdering={behovsvurdering}
                                    erModalÅpen={
                                        bekreftFullførKartleggingModalÅpen
                                    }
                                    lukkModal={() =>
                                        setBekreftFullførKartleggingModalÅpen(
                                            false,
                                        )
                                    }
                                />
                            </>
                        )}
                    {brukerRolle && (
                        <SlettBehovsvurderingModal
                            iaSak={iaSak}
                            samarbeid={samarbeid}
                            behovsvurdering={behovsvurdering}
                            erModalÅpen={slettSpørreundersøkelseModalÅpen}
                            lukkModal={() =>
                                setSlettSpørreundersøkelseModalÅpen(false)
                            }
                        />
                    )}
                </Accordion.Content>
            );
        }
    }
};
