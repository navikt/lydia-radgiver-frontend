import { IASak } from "../../../domenetyper/domenetyper";
import styled from "styled-components";
import { tabInnholdStyling } from "../../../styling/containere";
import { BodyShort, Button, Heading, List } from "@navikt/ds-react";
import {
    avsluttKartlegging,
    nyKartleggingPåSak,
    useHentKartlegginger,
} from "../../../api/lydia-api";
import { EksternLenke } from "../../../components/EksternLenke";

const Container = styled.div`
    height: 100%;
    display: flex;
    flex-direction: column;
    gap: 3rem;
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

    const pågåendeKartlegginger = iaSakKartlegginger?.filter((kartlegging) => kartlegging.status == "OPPRETTET")
    const avsluttedeKartlegginger = iaSakKartlegginger?.filter((kartlegging) => kartlegging.status == "AVSLUTTET")

    const avslutt = (kartlegginId: string) => {
        avsluttKartlegging(iaSak.orgnr, iaSak.saksnummer, kartlegginId).then(() => {
            muterKartlegginger();
        });
    }

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
                    <Button onClick={opprettKartlegging}>Opprett</Button>
                )}
            </Container>
            <Container>
                <Heading level={"3"} size={"large"}>
                    Pågående kartlegginger:
                </Heading>
                <List>
                    {!lasterIASakKartlegging &&
                        pågåendeKartlegginger &&
                        pågåendeKartlegginger.map((item) => (
                            <List.Item key={item.kartleggingId}>
                                <EksternLenke
                                    style={{ display: "block" }}
                                    href={`https://fia-arbeidsgiver.ekstern.dev.nav.no/${item.kartleggingId}/vert`}
                                    target={`https://fia-arbeidsgiver.ekstern.dev.nav.no/${item.kartleggingId}/vert`}
                                >
                                    {item.kartleggingId}
                                </EksternLenke>
                                <Button onClick={() => {avslutt(item.kartleggingId)}}>Avslutt</Button>
                            </List.Item>
                        ))}
                </List>
                <Heading level={"3"} size={"large"}>
                    Avsluttede kartlegginger:
                </Heading>
                <List>
                    {!lasterIASakKartlegging &&
                        avsluttedeKartlegginger &&
                        avsluttedeKartlegginger.map((item) => (
                            <List.Item key={item.kartleggingId}>
                                <EksternLenke
                                    style={{ display: "block" }}
                                    href={`https://fia-arbeidsgiver.ekstern.dev.nav.no/${item.kartleggingId}/vert`}
                                    target={`https://fia-arbeidsgiver.ekstern.dev.nav.no/${item.kartleggingId}/vert`}
                                >
                                    {item.kartleggingId}
                                </EksternLenke>
                                <Button onClick={() => {}}>Se resultater</Button>
                            </List.Item>
                        ))}
                </List>
            </Container>
        </>
    );
};
