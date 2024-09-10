import React from "react";
import styled from "styled-components";
import {
    Accordion,
    BodyShort,
    Button,
    Heading,
    HStack,
    Tag,
} from "@navikt/ds-react";
import { tabInnholdStyling } from "../../../../styling/containere";
import { PlusCircleIcon } from "@navikt/aksel-icons";
import {
    nyKartleggingPåSak,
    useHentBrukerinformasjon,
    useHentSamarbeid,
    useHentNyeKartlegginger,
} from "../../../../api/lydia-api";
import { IngenKartleggingInfoBoks } from "../../Kartlegging/IngenKartleggingInfoBoks";
import { KartleggingRad } from "../../Kartlegging/KartleggingRad";
import { IASakKartlegging } from "../../../../domenetyper/iaSakKartlegging";
import { erSammeDato } from "../../../../util/dato";
import { useSamarbeidsContext } from "../SamarbeidsContext";

const Container = styled.div`
    ${tabInnholdStyling};
    margin-bottom: 2rem;
`;

interface Props {
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

export const NyKartleggingFane = ({ KartleggingIdFraUrl }: Props) => {
    const { iaSak, gjeldendeSamarbeid } = useSamarbeidsContext();

    const [sisteOpprettedeKartleggingId, setSisteOpprettedeKartleggingId] =
        React.useState("");

    const { mutate: hentSamarbeidPåNytt } = useHentSamarbeid(
        iaSak.orgnr,
        iaSak.saksnummer,
    );

    const {
        data: iaSakKartlegginger,
        loading: lasterIASakKartlegging,
        mutate: muterKartlegginger,
    } = useHentNyeKartlegginger(
        iaSak.orgnr,
        iaSak.saksnummer,
        gjeldendeSamarbeid.id,
    );

    const opprettKartlegging = () => {
        nyKartleggingPåSak(iaSak.orgnr, iaSak.saksnummer).then(
            ({ kartleggingId }) => {
                setSisteOpprettedeKartleggingId(kartleggingId);
                muterKartlegginger();
                hentSamarbeidPåNytt();
            },
        );
    };

    const { data: brukerInformasjon } = useHentBrukerinformasjon();
    const brukerErEierAvSak = iaSak.eidAv === brukerInformasjon?.ident;

    const harKartlegginger =
        !lasterIASakKartlegging &&
        iaSakKartlegginger &&
        iaSakKartlegginger.length > 0;

    return (
        <>
            <Container>
                <HStack gap={"8"} align={"center"}>
                    <Heading level="3" size="large">
                        Behovsvurderinger
                    </Heading>
                    <Tag variant={"alt3-filled"} size={"small"}>
                        {gjeldendeSamarbeid?.navn ?? "Samarbeid uten navn"}
                    </Tag>
                </HStack>
                <br />

                <BodyShort>
                    Her oppretter du og får oversikt over behovsvurderinger. Du
                    må være i status “Kartlegges” eller “Vi bistår” og eier av
                    saken for å opprette eller gjøre endringer.
                </BodyShort>

                {(iaSak.status === "KARTLEGGES" ||
                    iaSak.status === "VI_BISTÅR") &&
                    brukerErEierAvSak && (
                        <NyKartleggingKnapp onClick={opprettKartlegging} />
                    )}

                {!harKartlegginger && <IngenKartleggingInfoBoks />}

                <br />

                <Accordion style={{ marginTop: "1rem" }}>
                    {harKartlegginger &&
                        sorterPåDato(iaSakKartlegginger).map(
                            (kartlegging, index, originalArray) => (
                                <KartleggingRad
                                    key={kartlegging.kartleggingId}
                                    iaSak={iaSak}
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
            </Container>
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
