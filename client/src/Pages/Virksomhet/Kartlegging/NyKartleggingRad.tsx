import { Accordion, BodyLong, Button } from "@navikt/ds-react";
import { BekreftValgModal } from "../../../components/Modal/BekreftValgModal";
import { useState } from "react";
import { IASak } from "../../../domenetyper/domenetyper";
import { startKartlegging, useHentKartlegginger, } from "../../../api/lydia-api";
import { IASakKartlegging } from "../../../domenetyper/iaSakKartlegging";
import styled from "styled-components";
import { åpneKartleggingINyFane } from "../../../util/navigasjon";

interface NyKartleggingRadProps {
    iaSak: IASak;
    kartlegging: IASakKartlegging;
    vertId: string;
}

const StyledActionButton = styled(Button)`
    margin-right: 1rem;
`;

export const NyKartleggingRad = ({ iaSak, kartlegging, vertId, }: NyKartleggingRadProps) => {
    const [bekreftStartKartleggingModalÅpen,
        setBekreftStartKartleggingModalÅpen,
    ] = useState(false);

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

    return (
        <Accordion.Content>
            <StyledActionButton
                variant={"secondary"}
                onClick={() => setBekreftStartKartleggingModalÅpen(true)}
            >
                Åpne kartlegging
            </StyledActionButton>

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
        </Accordion.Content>
    );
};
