import { IaSakProsess } from "../../../domenetyper/iaSakProsess";
import { IASak } from "../../../domenetyper/domenetyper";
import React from "react";
import { useHentIASaksStatus } from "../../../api/lydia-api/sak";
import { nyKartleggingPåSak } from "../../../api/lydia-api/kartlegging";
import { useHentBehovsvurderingerMedProsess } from "../../../api/lydia-api/kartlegging";
import { Loader } from "@navikt/ds-react";
import OpprettNySpørreundersøkelseKnapp from "../../../components/Spørreundersøkelse/OpprettNySpørreundersøkelseKnapp";
import Spørreundersøkelseliste from "../../../components/Spørreundersøkelse/Spørreundersøkelseliste";
import { SpørreundersøkelseProvider } from "../../../components/Spørreundersøkelse/SpørreundersøkelseContext";


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
            <SpørreundersøkelseProvider
                spørreundersøkelseType="Behovsvurdering"
                spørreundersøkelseliste={behovsvurderinger}
                iaSak={iaSak}
                samarbeid={samarbeid}
                brukerRolle={brukerRolle}
                brukerErEierAvSak={brukerErEierAvSak}
                sisteOpprettedeSpørreundersøkelseId={sisteOpprettedeKartleggingId}
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
