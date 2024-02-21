import {Accordion, BodyShort, Button, Loader} from "@navikt/ds-react";
import { BekreftValgModal } from "../../../components/Modal/BekreftValgModal";
import { useState } from "react";
import { IASak } from "../../../domenetyper/domenetyper";
import {avsluttKartlegging, useHentKartlegginger, useHentKartleggingResultat,} from "../../../api/lydia-api";
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

export const PågåendeKartleggingRad = ({ iaSak, kartlegging, vertId, }: PågåendeKartleggingProps) => {
    const [bekreftFullførKartleggingModalÅpen,
        setBekreftFullførKartleggingModalÅpen,
    ] = useState(false);

    const { mutate: muterKartlegginger } = useHentKartlegginger(
        iaSak.orgnr,
        iaSak.saksnummer,
    );

    const { data: kartleggingResultat, loading: lasterKartleggingResultat } =
        useHentKartleggingResultat(
            iaSak.orgnr,
            iaSak.saksnummer,
            kartlegging.kartleggingId,
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

    return (
        <Accordion.Content>
            {lasterKartleggingResultat && <Loader />}
            {!lasterKartleggingResultat && kartleggingResultat && (
                <BodyShort>
                    Antall fullførte:
                    {kartleggingResultat.antallUnikeDeltakereSomHarSvartPåAlt}
                </BodyShort>
            )}

            <StyledActionButton
                variant={"secondary"}
                onClick={() => åpneKartleggingINyFane(kartlegging.kartleggingId, vertId)}
            >
                Fortsett
            </StyledActionButton>
            <StyledActionButton onClick={() => setBekreftFullførKartleggingModalÅpen(true)}>
                Fullfør
            </StyledActionButton>
            <BekreftValgModal
                onConfirm={avslutt}
                onCancel={() => {
                    setBekreftFullførKartleggingModalÅpen(false);
                }}
                åpen={bekreftFullførKartleggingModalÅpen}
                title="Er du sikker på at du vil fullføre denne kartleggingen?"
                description={`Kartleggingen som fullføres er "Kartlegging opprettet ${lokalDatoMedKlokkeslett(kartlegging.opprettetTidspunkt)}".`}
            />
        </Accordion.Content>
    );
};
