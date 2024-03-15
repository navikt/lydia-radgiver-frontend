import {
    Accordion,
    BodyLong,
    BodyShort,
    Button,
    Loader,
} from "@navikt/ds-react";
import { BekreftValgModal } from "../../../components/Modal/BekreftValgModal";
import React, { useState } from "react";
import { IASak } from "../../../domenetyper/domenetyper";
import {
    avsluttKartlegging,
    slettKartlegging,
    useHentKartlegginger,
    useHentKartleggingOversikt,
} from "../../../api/lydia-api";
import { lokalDatoMedKlokkeslett } from "../../../util/dato";
import { IASakKartlegging } from "../../../domenetyper/iaSakKartlegging";
import styled from "styled-components";
import { åpneKartleggingINyFane } from "../../../util/navigasjon";
import { KartleggingOversikt } from "./KartleggingOversikt";

interface PågåendeKartleggingProps {
    iaSak: IASak;
    kartlegging: IASakKartlegging;
    vertId: string;
}

const EkstraInfoTekstIModal = styled.div`
    margin-top: 1rem;
`;

const StyledActionButton = styled(Button)`
    margin-right: 1rem;
`;

export const PågåendeKartleggingRad = ({
    iaSak,
    kartlegging,
    vertId,
}: PågåendeKartleggingProps) => {
    const [
        bekreftFullførKartleggingModalÅpen,
        setBekreftFullførKartleggingModalÅpen,
    ] = useState(false);
    const [slettKartleggingModalÅpen, setSlettKartleggingModalÅpen] =
        useState(false);

    const { mutate: muterKartlegginger } = useHentKartlegginger(
        iaSak.orgnr,
        iaSak.saksnummer,
    );

    const avslutt = () => {
        avsluttKartlegging(
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

    const { data: kartleggingOversikt, loading: lasterKartleggingOversikt } =
        useHentKartleggingOversikt(
            iaSak.orgnr,
            iaSak.saksnummer,
            kartlegging.kartleggingId,
        );

    if (lasterKartleggingOversikt) {
        return <Loader />;
    }

    if (!kartleggingOversikt) {
        return (
            <BodyShort>Kunne ikke hente oversikt over kartlegging</BodyShort>
        );
    }

    const MINIMUM_ANTALL_DELTAKERE = 3;
    const harNokDeltakere =
        kartleggingOversikt.antallUnikeDeltakereSomHarSvartPåAlt >=
        MINIMUM_ANTALL_DELTAKERE;

    return (
        <Accordion.Content>
            {iaSak.status === "KARTLEGGES" && (
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
                    <Button onClick={() => setSlettKartleggingModalÅpen(true)}>
                        Slett kartlegging
                    </Button>
                </>
            )}
            <BekreftValgModal
                onConfirm={avslutt}
                onCancel={() => {
                    setBekreftFullførKartleggingModalÅpen(false);
                }}
                åpen={bekreftFullførKartleggingModalÅpen}
                title="Er du sikker på at du vil fullføre denne kartleggingen?"
                description={`Kartleggingen som fullføres er "Kartlegging opprettet ${lokalDatoMedKlokkeslett(kartlegging.opprettetTidspunkt)}".`}
            >
                {!harNokDeltakere && (
                    <EkstraInfoTekstIModal>
                        <BodyLong>
                            Det er for få deltakere til å vise resultatene. Det
                            kreves minimum {MINIMUM_ANTALL_DELTAKERE} deltakere
                            for å vise resultatene.
                        </BodyLong>
                    </EkstraInfoTekstIModal>
                )}
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
            <KartleggingOversikt kartleggingOversikt={kartleggingOversikt} />
        </Accordion.Content>
    );
};
