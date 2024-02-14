import { Accordion, BodyLong, Button } from "@navikt/ds-react";
import { BekreftValgModal } from "../../../components/Modal/BekreftValgModal";
import { useState } from "react";
import { IASak } from "../../../domenetyper/domenetyper";
import {
    avsluttKartlegging,
    startKartlegging,
    useHentKartlegginger,
} from "../../../api/lydia-api";
import { lokalDatoMedKlokkeslett } from "../../../util/dato";
import { IASakKartlegging } from "../../../domenetyper/iaSakKartlegging";
import styled from "styled-components";

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
    const [bekreftValgModalÅpen, setBekreftValgModalÅpen] = useState(false);
    const [
        bekreftStartKartleggingModalÅpen,
        setBekreftStartKartleggingModalÅpen,
    ] = useState(false);

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

    const startKartleggingen = () => {
        startKartlegging(
            iaSak.orgnr,
            iaSak.saksnummer,
            kartlegging.kartleggingId,
        ).then(() => {
            muterKartlegginger();
        });
    };

    return (
        <Accordion.Content>
            {kartlegging.status === "OPPRETTET" ? (
                <StyledActionButton
                    variant={"secondary"}
                    onClick={() => setBekreftStartKartleggingModalÅpen(true)}
                >
                    Åpne kartlegging
                </StyledActionButton>
            ) : (
                <StyledActionButton
                    variant={"secondary"}
                    onClick={() => {
                        window.open(
                            `https://fia-arbeidsgiver.ekstern.dev.nav.no/${kartlegging.kartleggingId}/vert/${vertId}`,
                        );
                    }}
                >
                    Fortsett
                </StyledActionButton>
            )}
            <BekreftValgModal
                jaTekst={"Fortsett"}
                onConfirm={() => {
                    startKartleggingen();
                    window.open(
                        `https://fia-arbeidsgiver.ekstern.dev.nav.no/${kartlegging.kartleggingId}/vert/${vertId}`,
                    );
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
            <StyledActionButton onClick={() => setBekreftValgModalÅpen(true)}>
                Fullfør
            </StyledActionButton>
            <BekreftValgModal
                onConfirm={() => avslutt()}
                onCancel={() => {
                    setBekreftValgModalÅpen(false);
                }}
                åpen={bekreftValgModalÅpen}
                title="Er du sikker på at du vil fullføre denne kartleggingen?"
                description={`Kartleggingen som fullføres er "Kartlegging opprettet ${lokalDatoMedKlokkeslett(kartlegging.opprettetTidspunkt)}".`}
            />
        </Accordion.Content>
    );
};
