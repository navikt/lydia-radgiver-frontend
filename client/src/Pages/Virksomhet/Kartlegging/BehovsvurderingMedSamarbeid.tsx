import { IaSakProsess } from "../../../domenetyper/iaSakProsess";
import { IASak } from "../../../domenetyper/domenetyper";
import styled from "styled-components";
import { tabInnholdStyling } from "../../../styling/containere";
import { IASakKartlegging } from "../../../domenetyper/iaSakKartlegging";
import { erSammeDato, lokalDato } from "../../../util/dato";
import React from "react";
import {
    nyKartleggingPåSak,
    useHentBehovsvurderingerMedProsess,
    useHentIASaksStatus,
} from "../../../api/lydia-api";
import { Accordion, Loader } from "@navikt/ds-react";
import { BehovsvurderingOpprettNyKnapp } from "./BehovsvurderingOpprettNyKnapp";
import { BehovsvurderingRad } from "./BehovsvurderingRad";
import { sorterPåDatoSynkende } from "../../../util/sortering";

const Container = styled.div`
    ${tabInnholdStyling};
    margin-bottom: 2rem;
`;

export const BehovsvurderingMedSamarbeid = ({
    iaSak,
    samarbeid,
    brukerErEierAvSak,
    sakErIRettStatus,
    KartleggingIdFraUrl,
    brukerRolle,
}: {
    samarbeid: IaSakProsess;
    brukerErEierAvSak: boolean;
    sakErIRettStatus: boolean;
    iaSak: IASak;
    KartleggingIdFraUrl: string | null;
    brukerRolle: "Superbruker" | "Saksbehandler" | "Lesetilgang" | undefined;
}) => {
    function sorterPåDato(behovsvurderinger: IASakKartlegging[]) {
        return behovsvurderinger.sort((a, b) =>
            sorterPåDatoSynkende(a.opprettetTidspunkt, b.opprettetTidspunkt),
        );
    }

    function formaterDatoUtenKlokkeslett(dato: Date): string {
        return lokalDato(dato);
    }

    function formaterDatoMedKlokkeslett(dato: Date): string {
        return `${lokalDato(dato)}, ${dato.getHours().toString().padStart(2, "0")}:${dato.getMinutes().toString().padStart(2, "0")}`;
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

    const [sisteOpprettedeKartleggingId, setSisteOpprettedeKartleggingId] =
        React.useState("");

    const {
        data: behovsvurderinger,
        loading: lasterBehovsvurderinger,
        mutate: hentBehovsvurderingerPåNytt,
    } = useHentBehovsvurderingerMedProsess(
        iaSak.orgnr,
        iaSak.saksnummer,
        samarbeid.id,
    );
    const { mutate: oppdaterSaksStatus } = useHentIASaksStatus(
        iaSak.orgnr,
        iaSak.saksnummer,
    );

    const opprettBehovsvurdering = () => {
        nyKartleggingPåSak(iaSak.orgnr, iaSak.saksnummer, samarbeid.id).then(
            ({ kartleggingId }) => {
                setSisteOpprettedeKartleggingId(kartleggingId);
                hentBehovsvurderingerPåNytt();
                oppdaterSaksStatus();
            },
        );
    };

    if (lasterBehovsvurderinger) {
        return <Loader />;
    }

    return (
        behovsvurderinger && (
            <>
                <BehovsvurderingOpprettNyKnapp
                    onClick={opprettBehovsvurdering}
                    disabled={!(sakErIRettStatus && brukerErEierAvSak)}
                />
                <br />
                <br />
                {behovsvurderinger.length > 0 && (
                    <Container>
                        <Accordion style={{ marginTop: "1rem" }}>
                            {behovsvurderinger.length > 0 &&
                                sorterPåDato(behovsvurderinger).map(
                                    (behovsvurdering, index, originalArray) => (
                                        <BehovsvurderingRad
                                            key={behovsvurdering.kartleggingId}
                                            iaSak={iaSak}
                                            samarbeid={samarbeid}
                                            behovsvurdering={behovsvurdering}
                                            brukerRolle={brukerRolle}
                                            brukerErEierAvSak={
                                                brukerErEierAvSak
                                            }
                                            dato={formaterDatoForKartlegging(
                                                behovsvurdering,
                                                index,
                                                originalArray,
                                            )}
                                            defaultOpen={
                                                behovsvurdering.kartleggingId ===
                                                sisteOpprettedeKartleggingId ||
                                                behovsvurdering.kartleggingId ===
                                                KartleggingIdFraUrl
                                            }
                                        />
                                    ),
                                )}
                        </Accordion>
                    </Container>
                )}
            </>
        )
    );
};
