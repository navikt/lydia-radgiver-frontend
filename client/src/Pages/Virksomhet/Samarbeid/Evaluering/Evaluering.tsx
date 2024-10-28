import { IaSakProsess } from "../../../../domenetyper/iaSakProsess";
import { IASak } from "../../../../domenetyper/domenetyper";
import React from "react";
import { useHentIASaksStatus } from "../../../../api/lydia-api/sak";
import { Loader } from "@navikt/ds-react";
import OpprettNySpørreundersøkelseKnapp from "../../../../components/Spørreundersøkelse/OpprettNySpørreundersøkelseKnapp";
import Spørreundersøkelseliste from "../../../../components/Spørreundersøkelse/Spørreundersøkelseliste";
import { SpørreundersøkelseProvider } from "../../../../components/Spørreundersøkelse/SpørreundersøkelseContext";
import { nyEvalueringPåSak, useHentEvalueringerMedProsess } from "../../../../api/lydia-api/evaluering";


export const Evaluering = ({
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
    const [sisteOpprettedeId, setSisteOpprettedeId] =
        React.useState("");

    const {
        data: spørreundersøkelseListe,
        loading: lasterSpørreundersøkelser,
        mutate: hentSpørreundersøkelserPåNytt,
    } = useHentEvalueringerMedProsess(
        iaSak.orgnr,
        iaSak.saksnummer,
        samarbeid.id,
    );
    const { mutate: oppdaterSaksStatus } = useHentIASaksStatus(
        iaSak.orgnr,
        iaSak.saksnummer,
    );

    const opprettBehovsvurdering = () => {
        nyEvalueringPåSak(iaSak.orgnr, iaSak.saksnummer, samarbeid.id).then(
            ({ kartleggingId }) => {
                setSisteOpprettedeId(kartleggingId);
                hentSpørreundersøkelserPåNytt();
                oppdaterSaksStatus();
            },
        );
    };

    if (lasterSpørreundersøkelser) {
        return <Loader />;
    }

    return (
        spørreundersøkelseListe && (
            <SpørreundersøkelseProvider
                spørreundersøkelseType="Evaluering"
                spørreundersøkelseliste={spørreundersøkelseListe}
                iaSak={iaSak}
                samarbeid={samarbeid}
                brukerRolle={brukerRolle}
                brukerErEierAvSak={brukerErEierAvSak}
                sisteOpprettedeSpørreundersøkelseId={sisteOpprettedeId}
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
