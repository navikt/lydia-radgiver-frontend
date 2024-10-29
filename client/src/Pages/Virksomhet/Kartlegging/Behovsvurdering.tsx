import { IaSakProsess } from "../../../domenetyper/iaSakProsess";
import { IASak } from "../../../domenetyper/domenetyper";
import React from "react";
import { useHentIASaksStatus } from "../../../api/lydia-api/sak";
import { Loader } from "@navikt/ds-react";
import OpprettNySpørreundersøkelseKnapp from "../../../components/Spørreundersøkelse/OpprettNySpørreundersøkelseKnapp";
import Spørreundersøkelseliste from "../../../components/Spørreundersøkelse/Spørreundersøkelseliste";
import { SpørreundersøkelseProvider } from "../../../components/Spørreundersøkelse/SpørreundersøkelseContext";
import {
    opprettSpørreundersøkelse,
    useHentSpørreundersøkelser,
} from "../../../api/lydia-api/spørreundersøkelse";

export const Behovsvurdering = ({
    iaSak,
    samarbeid,
    brukerErEierAvSak,
    sakErIRettStatus,
    brukerRolle,
}: {
    samarbeid: IaSakProsess;
    brukerErEierAvSak: boolean;
    sakErIRettStatus: boolean;
    iaSak: IASak;
    brukerRolle: "Superbruker" | "Saksbehandler" | "Lesetilgang" | undefined;
}) => {
    const [
        idForSistOpprettetBehovsvurdering,
        setIdForSistOpprettetBehovsvurdering,
    ] = React.useState("");

    const {
        data: behovsvurderinger,
        loading: lasterBehovsvurderinger,
        mutate: hentBehovsvurderingerPåNytt,
    } = useHentSpørreundersøkelser(
        iaSak.orgnr,
        iaSak.saksnummer,
        samarbeid.id,
        "Behovsvurdering",
    );
    const { mutate: oppdaterSaksStatus } = useHentIASaksStatus(
        iaSak.orgnr,
        iaSak.saksnummer,
    );

    const opprettBehovsvurdering = () => {
        opprettSpørreundersøkelse(
            iaSak.orgnr,
            iaSak.saksnummer,
            samarbeid.id,
            "Behovsvurdering",
        ).then(({ kartleggingId }) => {
            setIdForSistOpprettetBehovsvurdering(kartleggingId);
            hentBehovsvurderingerPåNytt();
            oppdaterSaksStatus();
        });
    };

    if (lasterBehovsvurderinger) {
        return <Loader />;
    }

    return (
        behovsvurderinger && (
            <SpørreundersøkelseProvider
                spørreundersøkelseType="Behovsvurdering"
                spørreundersøkelseliste={behovsvurderinger}
                iaSak={iaSak}
                samarbeid={samarbeid}
                brukerRolle={brukerRolle}
                brukerErEierAvSak={brukerErEierAvSak}
                sisteOpprettedeSpørreundersøkelseId={
                    idForSistOpprettetBehovsvurdering
                }
            >
                <OpprettNySpørreundersøkelseKnapp
                    onClick={opprettBehovsvurdering}
                    disabled={!(sakErIRettStatus && brukerErEierAvSak)}
                />
                <Spørreundersøkelseliste />
            </SpørreundersøkelseProvider>
        )
    );
};
