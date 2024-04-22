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
    ToggleGroup,
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
import { erSammeDato } from "../../../util/dato";

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
            må være i status “Kartlegges” og eier av saken for opprette eller endre kartlegginger.
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
            <PlusCircleIcon fontSize="1.5rem" />
            Ny kartlegging
        </HStack>
    </Button>
);

export const KartleggingFane = ({ iaSak }: Props) => {
    const [sisteOpprettedeKartleggingId, setSisteOpprettedeKartleggingId] =
        React.useState("");
    const [prosentEllerAntall, setProsentEllerAntall] =
        React.useState("antall");
    const {
        data: iaSakKartlegginger,
        loading: lasterIASakKartlegging,
        mutate: muterKartlegginger,
    } = useHentKartlegginger(iaSak.orgnr, iaSak.saksnummer);

    const opprettKartlegging = () => {
        nyKartleggingPåSak(iaSak.orgnr, iaSak.saksnummer, [
            "UTVIKLE_PARTSSAMARBEID",
            "REDUSERE_SYKEFRAVÆR",
        ]).then(({ kartleggingId }) => {
            setSisteOpprettedeKartleggingId(kartleggingId);
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
            <Container>
                <HStack justify={"space-between"} align={"center"}>
                    <Heading level="3" size="large">
                        Kartlegginger
                    </Heading>
                    {harKartlegginger && (
                        <ToggleGroup
                            onChange={setProsentEllerAntall}
                            defaultValue={"antall"}
                        >
                            <ToggleGroup.Item value="prosent">
                                Prosent
                            </ToggleGroup.Item>
                            <ToggleGroup.Item value="antall">
                                Antall
                            </ToggleGroup.Item>
                        </ToggleGroup>
                    )}
                </HStack>

                {iaSak.status === "KARTLEGGES" && brukerErEierAvSak && (
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
                                    dato={formaterDatoForKartlegging(
                                        kartlegging,
                                        index,
                                        originalArray,
                                    )}
                                    defaultOpen={
                                        sisteOpprettedeKartleggingId ===
                                        kartlegging.kartleggingId
                                    }
                                    visSomProsent={
                                        prosentEllerAntall === "prosent"
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
