import { Accordion, Button } from "@navikt/ds-react";
import { BekreftValgModal } from "../../../components/Modal/BekreftValgModal";
import React, { useState } from "react";
import { IASak } from "../../../domenetyper/domenetyper";
import {
    avsluttKartlegging,
    slettKartlegging,
    useHentKartlegginger,
} from "../../../api/lydia-api";
import { lokalDatoMedKlokkeslett } from "../../../util/dato";
import { IASakKartlegging } from "../../../domenetyper/iaSakKartlegging";
import styled from "styled-components";
import { åpneKartleggingINyFane } from "../../../util/navigasjon";

interface PågåendeKartleggingProps {
    iaSak: IASak;
    kartlegging: IASakKartlegging;
    vertId: string;
}

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

    /*
    const { data: kartleggingResultat, loading: lasterKartleggingResultat } =
        useHentKartleggingResultat(
            iaSak.orgnr,
            iaSak.saksnummer,
            kartlegging.kartleggingId,
        );*/

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
            />
            {/* TODO: hente antall deltakere og varsle dersom det er for få*/}
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
