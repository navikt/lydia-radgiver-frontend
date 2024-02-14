import React from "react";
import { IASak } from "../../../domenetyper/domenetyper";
import styled from "styled-components";
import { tabInnholdStyling } from "../../../styling/containere";
import {
    Accordion,
    BodyShort,
    Button,
    Heading,
    HStack,
} from "@navikt/ds-react";
import {
    nyKartleggingPåSak,
    useHentBrukerinformasjon,
    useHentKartlegginger,
} from "../../../api/lydia-api";
import { IngenKartleggingInfoBoks } from "./IngenKartleggingInfoBoks";
import { PlusCircleIcon } from "@navikt/aksel-icons";
import { KartleggingRad } from "./KartleggingRad";
import { IASakKartlegging } from "../../../domenetyper/iaSakKartlegging";

const Container = styled.div`
    ${tabInnholdStyling};
    margin-bottom: 2rem;
`;

interface Props {
    iaSak: IASak;
}

const KartleggingInfo = () => (
    <Container>
        <Heading level="3" size="large" spacing={true}>
            IA-Kartlegging
        </Heading>
        <BodyShort>
            Her legger du inn og får oversikt over kartleggingene til saken. Du
            må være i status “Kartlegges” og eier av saken for å jobbe med
            kartlegginger.
        </BodyShort>
    </Container>
);

const NyKartleggingKnapp = (props: { onClick: () => void }) => (
    <Button
        onClick={props.onClick}
        variant={"secondary"}
        style={{ margin: "1rem" }}
    >
        <HStack align={"center"} gap={"2"}>
            <PlusCircleIcon title="a11y-title" fontSize="1.5rem" />
            Ny kartlegging
        </HStack>
    </Button>
);

export const KartleggingFane = ({ iaSak }: Props) => {
    const [harOpprettetKartlegging, setHarOpprettetKartlegging] =
        React.useState(false);
    const {
        data: iaSakKartlegginger,
        loading: lasterIASakKartlegging,
        mutate: muterKartlegginger,
    } = useHentKartlegginger(iaSak.orgnr, iaSak.saksnummer);

    const opprettKartlegging = () => {
        nyKartleggingPåSak(iaSak.orgnr, iaSak.saksnummer).then(() => {
            muterKartlegginger();
        });
        setHarOpprettetKartlegging(true);
    };

    const { data: brukerInformasjon } = useHentBrukerinformasjon();
    const brukerErEierAvSak = iaSak.eidAv === brukerInformasjon?.ident;

    const harKartlegginger =
        !lasterIASakKartlegging &&
        iaSakKartlegginger &&
        iaSakKartlegginger.length > 0;

    const sorterPåDato = (kartlegginger: IASakKartlegging[]) =>
        kartlegginger.sort(
            (a, b) =>
                b.opprettetTidspunkt.getTime() - a.opprettetTidspunkt.getTime(),
        );

    return (
        <>
            {(iaSak.status !== "KARTLEGGES" || !brukerErEierAvSak) && (
                <KartleggingInfo />
            )}

            {iaSak.status === "KARTLEGGES" && (
                <Container>
                    <Heading level="3" size="large">
                        Kartlegginger
                    </Heading>

                    {brukerErEierAvSak && (
                        <NyKartleggingKnapp onClick={opprettKartlegging} />
                    )}

                    {!harKartlegginger && <IngenKartleggingInfoBoks />}

                    <Accordion style={{ marginTop: "1rem" }}>
                        {harKartlegginger &&
                            sorterPåDato(iaSakKartlegginger).map(
                                (kartlegging, index) => (
                                    <KartleggingRad
                                        iaSak={iaSak}
                                        kartlegging={kartlegging}
                                        brukerErEierAvSak={brukerErEierAvSak}
                                        key={index}
                                        defaultOpen={
                                            index === 0 &&
                                            harOpprettetKartlegging
                                        }
                                    />
                                ),
                            )}
                    </Accordion>
                </Container>
            )}
        </>
    );
};
