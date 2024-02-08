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
import { Person2Svg } from "../../../components/Person2Svg";
import { Person1Svg } from "../../../components/Person1Svg";
import { IngenKartleggingInfoBoks } from "./IngenKartleggingInfoBoks";

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
        avsluttKartlegging(iaSak.orgnr, iaSak.saksnummer, kartleggingId).then(
            () => {
                muterKartlegginger();
            },
        );
    };

    const harKartlegginger =
        !lasterIASakKartlegging &&
        iaSakKartlegginger &&
        iaSakKartlegginger.length !== 0;

    const harPågåendeKartlegginger =
        harKartlegginger &&
        iaSakKartlegginger.filter(
            (kartlegging) => kartlegging.status === "OPPRETTET",
        ).length !== 0;

    const harAvsluttetKartlegginger =
        harKartlegginger &&
        iaSakKartlegginger.filter(
            (kartlegging) => kartlegging.status === "AVSLUTTET",
        ).length !== 0;

    return (
        <Container>
            <div>
                <Heading level="3" size="large" spacing={true}>
                    IA-Kartlegging
                </Heading>
                <BodyShort>
                    Her legger du inn og får oversikt over kartleggingene til
                    saken. Du må være på status “Kartlegges” for å jobbe med
                    kartlegginger.
                </BodyShort>
            </div>
            {iaSak.status === "KARTLEGGES" && (
                <>
                    <Button
                        onClick={opprettKartlegging}
                        style={{ margin: "1rem" }}
                    >
                        Opprett
                    </Button>
                    <Heading
                        level={"3"}
                        size={"large"}
                        style={{ marginTop: "1.5rem" }}
                    >
                        Pågående kartlegginger
                    </Heading>
                    {!harKartlegginger && (
                        <IngenKartleggingInfoBoks
                            header={"Her var det tomt"}
                            illustrasjon={<Person1Svg size={60} />}
                        >
                            <BodyShort style={{ marginTop: ".5rem" }}>
                                Du har ikke startet kartlegging for denne
                                virksomheten enda. For å komme igang trykker du
                                på Ny kartlegging knappen som ligger over dette
                                feltet.
                            </BodyShort>
                        </IngenKartleggingInfoBoks>
                    )}
                    {harKartlegginger && !harPågåendeKartlegginger && (
                        <IngenKartleggingInfoBoks
                            header={"Ingen pågående kartlegging"}
                            illustrasjon={<Person1Svg size={60} />}
                        >
                            <BodyShort style={{ marginTop: ".5rem" }}>
                                Du har ingen pågående kartlegging for denne
                                virksomheten.
                            </BodyShort>
                        </IngenKartleggingInfoBoks>
                    )}
                    <Accordion style={{ marginTop: "1rem" }}>
                        {!lasterIASakKartlegging &&
                            iaSakKartlegginger &&
                            iaSakKartlegginger
                                .filter(
                                    (kartlegging) =>
                                        kartlegging.status === "OPPRETTET",
                                )
                                .map((item, index) => (
                                    <PågåendeKartleggingRad
                                        key={item.kartleggingId}
                                        kartleggingId={item.kartleggingId}
                                        vertId={item.vertId}
                                        kartleggingStatus={item.status}
                                        avslutt={avslutt}
                                        index={index}
                                    />
                                ))}
                    </Accordion>
                    <Heading
                        level={"3"}
                        size={"large"}
                        style={{ marginTop: "1.5rem" }}
                    >
                        Fullførte kartlegginger
                    </Heading>
                    {!harAvsluttetKartlegginger && (
                        <IngenKartleggingInfoBoks
                            header={
                                "Her vil rapportene fra fullførte kartlegginger ligge"
                            }
                            illustrasjon={<Person2Svg size={60} />}
                        >
                            <BodyShort style={{ marginTop: ".5rem" }}>
                                Alle kartlegginger som er gjort i denne
                                virksomheten vil legges her.
                            </BodyShort>
                        </IngenKartleggingInfoBoks>
                    )}
                    <Accordion style={{ marginTop: "1rem" }}>
                        {!lasterIASakKartlegging &&
                            iaSakKartlegginger &&
                            iaSakKartlegginger
                                .filter(
                                    (kartlegging) =>
                                        kartlegging.status === "AVSLUTTET",
                                )
                                .map((item, index) => (
                                    <FullførtKartleggingRad
                                        key={item.kartleggingId}
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
