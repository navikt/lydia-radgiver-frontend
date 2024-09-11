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
    useHentNyeKartlegginger,
    useHentSamarbeid,
} from "../../../api/lydia-api";
import { IngenKartleggingInfoBoks } from "./IngenKartleggingInfoBoks";
import { PlusCircleIcon } from "@navikt/aksel-icons";
import { KartleggingRad } from "./KartleggingRad";
import { IASakKartlegging } from "../../../domenetyper/iaSakKartlegging";
import { erSammeDato } from "../../../util/dato";
import { IaSakProsess } from "../../../domenetyper/iaSakProsess";

const Container = styled.div`
    ${tabInnholdStyling};
    margin-bottom: 2rem;
`;

interface Props {
    iaSak: IASak;
    gjeldendeSamarbeid?: IaSakProsess;
    KartleggingIdFraUrl: string | null;
}

const NyKartleggingKnapp = (props: { onClick: () => void }) => (
    <Button
        onClick={props.onClick}
        variant={"secondary"}
        style={{ margin: "1rem" }}
    >
        <HStack align={"center"} gap={"2"}>
            <PlusCircleIcon fontSize="1.5rem" />
            Ny behovsvurdering
        </HStack>
    </Button>
);

export const KartleggingFane = ({
    iaSak,
    gjeldendeSamarbeid,
    KartleggingIdFraUrl,
}: Props) => {
    const { data: samarbeid } = useHentSamarbeid(iaSak.orgnr, iaSak.saksnummer);

    return (
        <>
            <Container>
                <Heading level="3" size="large" spacing={true}>
                    Behovsvurderinger
                </Heading>

                <BodyShort>
                    Her oppretter du og får oversikt over behovsvurderinger. Du
                    må være i status “Kartlegges” eller “Vi bistår” og eier av
                    saken for å opprette eller gjøre endringer.
                </BodyShort>

                {samarbeid && samarbeid.length > 0 && (
                    <KartleggingerMedSamarbeid
                        iaSak={iaSak}
                        samarbeid={gjeldendeSamarbeid || samarbeid[0]}
                        KartleggingIdFraUrl={KartleggingIdFraUrl}
                    />
                )}
            </Container>
        </>
    );
};

export const KartleggingerMedSamarbeid = ({
    iaSak,
    samarbeid,
    KartleggingIdFraUrl,
}: {
    iaSak: IASak;
    samarbeid: IaSakProsess;
    KartleggingIdFraUrl?: string | null;
}) => {
    const {
        data: iaSakKartlegginger,
        loading: lasterIASakKartlegging,
        mutate: muterKartlegginger,
    } = useHentNyeKartlegginger(iaSak.orgnr, iaSak.saksnummer, samarbeid.id);

    const [sisteOpprettedeKartleggingId, setSisteOpprettedeKartleggingId] =
        React.useState("");

    const { data: brukerInformasjon } = useHentBrukerinformasjon();
    const brukerErEierAvSak = iaSak.eidAv === brukerInformasjon?.ident;

    const opprettKartlegging = () => {
        nyKartleggingPåSak(iaSak.orgnr, iaSak.saksnummer, samarbeid.id).then(
            ({ kartleggingId }) => {
                setSisteOpprettedeKartleggingId(kartleggingId);
                muterKartlegginger();
            },
        );
    };

    const harKartlegginger =
        !lasterIASakKartlegging &&
        iaSakKartlegginger &&
        iaSakKartlegginger.length > 0;

    return (
        <>
            {(iaSak.status === "KARTLEGGES" || iaSak.status === "VI_BISTÅR") &&
                brukerErEierAvSak && (
                    <NyKartleggingKnapp onClick={opprettKartlegging} />
                )}
            {!harKartlegginger && <IngenKartleggingInfoBoks />}

            <br />

            <Accordion style={{ marginTop: "1rem" }}>
                {harKartlegginger &&
                    samarbeid &&
                    sorterPåDato(iaSakKartlegginger).map(
                        (kartlegging, index, originalArray) => (
                            <KartleggingRad
                                key={kartlegging.kartleggingId}
                                iaSak={iaSak}
                                samarbeid={samarbeid}
                                kartlegging={kartlegging}
                                brukerRolle={brukerInformasjon?.rolle}
                                brukerErEierAvSak={brukerErEierAvSak}
                                dato={formaterDatoForKartlegging(
                                    kartlegging,
                                    index,
                                    originalArray,
                                )}
                                defaultOpen={
                                    kartlegging.kartleggingId ===
                                        sisteOpprettedeKartleggingId ||
                                    kartlegging.kartleggingId ===
                                        KartleggingIdFraUrl
                                }
                            />
                        ),
                    )}
            </Accordion>
        </>
    );
};

function sorterPåDato(kartlegginger: IASakKartlegging[]) {
    return kartlegginger.sort(
        (a, b) =>
            b.opprettetTidspunkt.getTime() - a.opprettetTidspunkt.getTime(),
    );
}

function formaterDatoUtenKlokkeslett(dato: Date): string {
    return dato.toLocaleDateString("nb-NO");
}

function formaterDatoMedKlokkeslett(dato: Date): string {
    return `${dato.toLocaleDateString("nb-NO")}, ${dato.getHours()}:${dato.getMinutes().toString().padStart(2, "0")}`;
}

function formaterDatoForKartlegging(
    kartlegging: IASakKartlegging,
    index: number,
    kartlegginger: IASakKartlegging[],
) {
    // Vi anntar at kartlegginger er sortert på dato, så vi trenger kun å sjekke de to nærmeste kartleggingene
    if (
        index > 0 &&
        erSammeDato(
            kartlegging.opprettetTidspunkt,
            kartlegginger[index - 1].opprettetTidspunkt,
        )
    ) {
        return formaterDatoMedKlokkeslett(kartlegging.opprettetTidspunkt);
    }

    if (
        index < kartlegginger.length - 1 &&
        erSammeDato(
            kartlegging.opprettetTidspunkt,
            kartlegginger[index + 1].opprettetTidspunkt,
        )
    ) {
        return formaterDatoMedKlokkeslett(kartlegging.opprettetTidspunkt);
    }

    return formaterDatoUtenKlokkeslett(kartlegging.opprettetTidspunkt);
}
