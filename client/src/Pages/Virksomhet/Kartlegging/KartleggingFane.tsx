import { IASak } from "../../../domenetyper/domenetyper";
import styled from "styled-components";
import { tabInnholdStyling } from "../../../styling/containere";
import { Accordion, BodyShort, Button, Heading } from "@navikt/ds-react";
import {
    avsluttKartlegging,
    nyKartleggingPåSak,
    useHentKartlegginger,
} from "../../../api/lydia-api";
import { StatusBadge } from "../../../components/Badge/StatusBadge";
import { KartleggingResultat } from "./KartleggingResultat";

const Container = styled.div`
    ${tabInnholdStyling};
`;

const AccordionHeaderContent = styled.div`
    display: flex;
    align-items: center;
    gap: 2rem;
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

    const pågåendeKartlegginger = iaSakKartlegginger?.filter(
        (kartlegging) => kartlegging.status == "OPPRETTET",
    );
    const avsluttedeKartlegginger = iaSakKartlegginger?.filter(
        (kartlegging) => kartlegging.status == "AVSLUTTET",
    );

    const avslutt = (kartlegginId: string) => {
        avsluttKartlegging(iaSak.orgnr, iaSak.saksnummer, kartlegginId).then(
            () => {
                muterKartlegginger();
            },
        );
    };

    return (
        <>
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
                                pågåendeKartlegginger &&
                                pågåendeKartlegginger.map((item, index) => (
                                    <Accordion.Item key={item.kartleggingId}>
                                        <Accordion.Header>
                                            <AccordionHeaderContent>
                                                <StatusBadge
                                                    status={item.status}
                                                />
                                                Kartlegging nr {index + 1}
                                            </AccordionHeaderContent>
                                        </Accordion.Header>

                                        <Accordion.Content>
                                            <KartleggingResultat
                                                iaSak={iaSak}
                                                kartleggingId={
                                                    item.kartleggingId
                                                }
                                            />
                                        </Accordion.Content>
                                        <Button
                                            onClick={() => {
                                                avslutt(item.kartleggingId);
                                            }}
                                        >
                                            Avslutt
                                        </Button>
                                    </Accordion.Item>
                                ))}
                        </Accordion>
                        <Heading level={"3"} size={"large"}>
                            Avsluttede kartlegginger:
                        </Heading>
                        <Accordion>
                            {!lasterIASakKartlegging &&
                                avsluttedeKartlegginger &&
                                avsluttedeKartlegginger.map((item, index) => (
                                    <Accordion.Item key={item.kartleggingId}>
                                        <Accordion.Header>
                                            <AccordionHeaderContent>
                                                <StatusBadge
                                                    status={item.status}
                                                />
                                                Kartlegging nr {index + 1}
                                            </AccordionHeaderContent>
                                        </Accordion.Header>

                                        <Accordion.Content>
                                            <KartleggingResultat
                                                iaSak={iaSak}
                                                kartleggingId={
                                                    item.kartleggingId
                                                }
                                            />
                                        </Accordion.Content>
                                    </Accordion.Item>
                                ))}
                        </Accordion>
                    </>
                )}
            </Container>
        </>
    );
};
