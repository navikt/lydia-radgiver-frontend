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
import EksportVisning from "./EksportVisning";
import { FlyttTilAnnenProsess } from "./FlyttTilAnnenProsess";
import { erIDev } from "../../../components/Dekoratør/Dekoratør";
import { IaSakProsess } from "../../../domenetyper/iaSakProsess";

const ExportVisningContainer = styled.div`
    display: flex;
    justify-content: right;
`;

const StyledActionButton = styled(Button)`
    margin-right: 1rem;
`;

export const KartleggingRadInnhold = ({
    iaSak,
    kartlegging,
    samarbeid,
    brukerRolle,
    brukerErEierAvSak,
    kartleggingstatus,
}: {
    iaSak: IASak;
    kartlegging: IASakKartlegging;
    samarbeid: IaSakProsess;
    brukerRolle: "Superbruker" | "Saksbehandler" | "Lesetilgang" | undefined;
    brukerErEierAvSak: boolean;
    kartleggingstatus: "OPPRETTET" | "PÅBEGYNT" | "AVSLUTTET" | "SLETTET";
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
        if (kartleggingstatus === "SLETTET") {
            return null;
        }

        if (kartleggingstatus === "AVSLUTTET") {
            return (
                <Accordion.Content>
                    <ExportVisningContainer>
                        {erIDev && (
                            <FlyttTilAnnenProsess
                                behovsvurdering={kartlegging}
                                dropdownSize="small"
                            />
                        )}
                        <EksportVisning
                            iaSak={iaSak}
                            kartlegging={kartlegging}
                            erIEksportMode={erIEksportMode}
                            setErIEksportMode={setErIEksportMode}
                        />
                    </ExportVisningContainer>
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
                                {erIDev && (
                                    <FlyttTilAnnenProsess
                                        behovsvurdering={kartlegging}
                                    />
                                )}
                            </>
                        )}
                    <StartSpørreundersøkelseModal
                        iaSak={iaSak}
                        spørreundersøkelse={kartlegging}
                        samarbeid={samarbeid}
                        erModalÅpen={bekreftStartKartleggingModalÅpen}
                        lukkModal={() =>
                            setBekreftStartKartleggingModalÅpen(false)
                        }
                    />
                    {brukerRolle && (
                        <SlettKartleggingModal
                            iaSak={iaSak}
                            samarbeid={samarbeid}
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
                                        {erIDev && (
                                            <FlyttTilAnnenProsess
                                                behovsvurdering={kartlegging}
                                            />
                                        )}
                                    </>
                                )}
                                <FullførSpørreundersøkelseModal
                                    iaSak={iaSak}
                                    samarbeid={samarbeid}
                                    harNokDeltakere={harNokDeltakere}
                                    behovsvurdering={kartlegging}
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
                        <SlettKartleggingModal
                            iaSak={iaSak}
                            samarbeid={samarbeid}
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
    }
};
