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
import { erSammeDato, lokalDato, lokalDatoMedKlokkeslett } from "../../../util/dato";

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
            setHarOpprettetKartlegging(true);
            muterKartlegginger();
        });
    };

    const { data: brukerInformasjon } = useHentBrukerinformasjon();
    const brukerErEierAvSak = iaSak.eidAv === brukerInformasjon?.ident;

    const harKartlegginger =
        !lasterIASakKartlegging &&
        iaSakKartlegginger &&
        iaSakKartlegginger.length > 0;

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
                                (kartlegging, index, originalArray) => (
                                    <KartleggingRad
                                        key={kartlegging.kartleggingId}
                                        iaSak={iaSak}
                                        kartlegging={kartlegging}
                                        brukerErEierAvSak={brukerErEierAvSak}
                                        dato={formaterDatoForKartlegging(kartlegging, index, originalArray)}
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

function sorterPåDato(kartlegginger: IASakKartlegging[]) {
    return kartlegginger.sort(
        (a, b) =>
            b.opprettetTidspunkt.getTime() - a.opprettetTidspunkt.getTime(),
    );
}

function formaterDatoForKartlegging(kartlegging: IASakKartlegging, index: number, kartlegginger: IASakKartlegging[]) {
    // Vi anntar at kartlegginger er sortert på dato, så vi trenger kun å sjekke de to nærmeste kartleggingene
    if (index > 0) {
        if (erSammeDato(kartlegging.opprettetTidspunkt, kartlegginger[index - 1].opprettetTidspunkt)) {
            return lokalDatoMedKlokkeslett(kartlegging.opprettetTidspunkt);
        }
    }
    
    if (index < kartlegginger.length - 1) {
        if (erSammeDato(kartlegging.opprettetTidspunkt, kartlegginger[index + 1].opprettetTidspunkt)) {
            return lokalDatoMedKlokkeslett(kartlegging.opprettetTidspunkt);
        }
    }

    return lokalDato(kartlegging.opprettetTidspunkt);
}