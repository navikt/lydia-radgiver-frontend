import { IASak } from "../../../domenetyper/domenetyper";
import styled from "styled-components";
import { tabInnholdStyling } from "../../../styling/containere";
import { Accordion, BodyShort, Button, Heading } from "@navikt/ds-react";
import {
    avsluttKartlegging,
    nyKartleggingPåSak,
    useHentKartlegginger,
} from "../../../api/lydia-api";
import { PågåendeKartleggingRad } from "./PågåendeKartleggingRad";
import { FullførtKartleggingRad } from "./FullførtKartleggingRad";

const Container = styled.div`
    ${tabInnholdStyling};
`;

interface Props {
    iaSak: IASak;
}

export const KartleggingFane = ({ iaSak }: Props) => {
    const {
        data: iaSakKartlegginger,
        loading: lasterIASakKartlegging,
        mutate: muterKartlegginger,
    } = useHentKartlegginger(iaSak.orgnr, iaSak.saksnummer);

    const opprettKartlegging = () => {
        nyKartleggingPåSak(iaSak.orgnr, iaSak.saksnummer).then(() => {
            muterKartlegginger();
        });
    };

    const avslutt = (kartleggingId: string) => {
        avsluttKartlegging(iaSak.orgnr, iaSak.saksnummer, kartleggingId)
            .then(() => {
                muterKartlegginger()
            })
    };

    return (
        <Container>
            <div>
                <Heading level="3" size="large" spacing={true}>
                    IA-Kartlegging
                </Heading>
                <BodyShort>
                    Her legger du inn og får oversikt over kartleggingene
                    til saken. Du må være på status “Kartlegges” for å jobbe
                    med kartlegginger.
                </BodyShort>
            </div>
            {iaSak.status === "KARTLEGGES" && (
                <>
                    <Button onClick={opprettKartlegging}>Opprett</Button>
                    <Heading level={"3"} size={"large"}>
                        Pågående kartlegginger:
                    </Heading>
                    <Accordion>
                        {!lasterIASakKartlegging &&
                            iaSakKartlegginger &&
                            iaSakKartlegginger
                                .filter((kartlegging) => kartlegging.status === "OPPRETTET")
                                .map((item, index) => (
                                    <PågåendeKartleggingRad key={item.kartleggingId}
                                                            kartleggingId={item.kartleggingId}
                                                            kartleggingStatus={item.status}
                                                            avslutt={avslutt}
                                                            index={index}
                                    />

                                ))}
                    </Accordion>
                    <Heading level={"3"} size={"large"}>
                        Fullførte kartlegginger:
                    </Heading>
                    <Accordion>
                        {!lasterIASakKartlegging &&
                            iaSakKartlegginger &&
                            iaSakKartlegginger.filter(
                                (kartlegging) => kartlegging.status === "AVSLUTTET")
                                .map((item, index) => (
                                    <FullførtKartleggingRad key={item.kartleggingId}
                                                            iaSak={iaSak}
                                                            kartleggingId={item.kartleggingId}
                                                            kartleggingStatus={item.status}
                                                            index={index}
                                    />
                                ))}
                    </Accordion>
                </>
            )}
        </Container>
    );
};
