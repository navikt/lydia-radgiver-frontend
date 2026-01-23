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
import { VisHvisSamarbeidErÅpent } from "../Samarbeid/SamarbeidContext";

export const Behovsvurdering = ({
    iaSak,
    samarbeid,
    kanEndreSpørreundersøkelser,
    sakErIRettStatus,
    brukerRolle,
}: {
    samarbeid: IaSakProsess;
    kanEndreSpørreundersøkelser: boolean;
    sakErIRettStatus: boolean;
    iaSak: IASak;
    brukerRolle: "Superbruker" | "Saksbehandler" | "Lesetilgang" | undefined;
}) => {
    const [
        idForSistOpprettetBehovsvurdering,
        setIdForSistOpprettetBehovsvurdering,
    ] = React.useState("");
    const [lasterOppretting, setLasterOppretting] = React.useState(false);

    const {
        data: behovsvurderinger,
        loading: lasterBehovsvurderinger,
        mutate: hentBehovsvurderingerPåNytt,
    } = useHentSpørreundersøkelser(
        iaSak.orgnr,
        iaSak.saksnummer,
        samarbeid.id,
        "BEHOVSVURDERING",
    );
    const {
        mutate: oppdaterSaksStatus,
        loading: lasterIaSakStatus,
        validating: revalidererIaSakStatus,
    } = useHentIASaksStatus(iaSak.orgnr, iaSak.saksnummer);

    const opprettBehovsvurdering = () => {
        if (lasterOppretting) return;
        setLasterOppretting(true);
        opprettSpørreundersøkelse(
            iaSak.orgnr,
            iaSak.saksnummer,
            samarbeid.id,
            "BEHOVSVURDERING",
        ).then(({ id }) => {
            setIdForSistOpprettetBehovsvurdering(id);
            hentBehovsvurderingerPåNytt();
            oppdaterSaksStatus();
            setLasterOppretting(false);
        });
    };

    if (lasterBehovsvurderinger) {
        return <Loader />;
    }

    return (
        behovsvurderinger && (
            <SpørreundersøkelseProvider
                spørreundersøkelseType="BEHOVSVURDERING"
                spørreundersøkelseliste={behovsvurderinger}
                iaSak={iaSak}
                samarbeid={samarbeid}
                brukerRolle={brukerRolle}
                kanEndreSpørreundersøkelser={kanEndreSpørreundersøkelser}
                sisteOpprettedeSpørreundersøkelseId={
                    idForSistOpprettetBehovsvurdering
                }
                setSisteOpprettedeSpørreundersøkelseId={
                    setIdForSistOpprettetBehovsvurdering
                }
            >
                <VisHvisSamarbeidErÅpent>
                    <OpprettNySpørreundersøkelseKnapp
                        onClick={opprettBehovsvurdering}
                        disabled={
                            !(sakErIRettStatus && kanEndreSpørreundersøkelser)
                        }
                        loading={
                            lasterOppretting ||
                            lasterIaSakStatus ||
                            revalidererIaSakStatus
                        }
                    />
                </VisHvisSamarbeidErÅpent>
                <Spørreundersøkelseliste />
            </SpørreundersøkelseProvider>
        )
    );
};
