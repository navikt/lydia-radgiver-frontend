import { IaSakProsess } from "../../../../domenetyper/iaSakProsess";
import { IASak } from "../../../../domenetyper/domenetyper";
import React from "react";
import { useHentIASaksStatus } from "../../../../api/lydia-api/sak";
import { Loader } from "@navikt/ds-react";
import OpprettNySpørreundersøkelseKnapp from "../../../../components/Spørreundersøkelse/OpprettNySpørreundersøkelseKnapp";
import Spørreundersøkelseliste from "../../../../components/Spørreundersøkelse/Spørreundersøkelseliste";
import { SpørreundersøkelseProvider } from "../../../../components/Spørreundersøkelse/SpørreundersøkelseContext";
import {
    opprettSpørreundersøkelse,
    useHentSpørreundersøkelser,
} from "../../../../api/lydia-api/spørreundersøkelse";

export const Evaluering = ({
    iaSak,
    samarbeid,
    brukerErEierAvSak,
    sakErIRettStatus,
    brukerRolle,
    harPlan,
}: {
    samarbeid: IaSakProsess;
    brukerErEierAvSak: boolean;
    sakErIRettStatus: boolean;
    iaSak: IASak;
    brukerRolle: "Superbruker" | "Saksbehandler" | "Lesetilgang" | undefined;
    harPlan?: boolean;
}) => {
    const [sisteOpprettedeId, setSisteOpprettedeId] = React.useState("");

    const {
        data: spørreundersøkelseListe,
        loading: lasterSpørreundersøkelser,
        mutate: hentSpørreundersøkelserPåNytt,
    } = useHentSpørreundersøkelser(
        iaSak.orgnr,
        iaSak.saksnummer,
        samarbeid.id,
        "Evaluering",
    );
    const { mutate: oppdaterSaksStatus } = useHentIASaksStatus(
        iaSak.orgnr,
        iaSak.saksnummer,
    );

    const opprettEvaluering = () => {
        opprettSpørreundersøkelse(
            iaSak.orgnr,
            iaSak.saksnummer,
            samarbeid.id,
            "Evaluering",
        ).then(({ id }) => {
            setSisteOpprettedeId(id);
            hentSpørreundersøkelserPåNytt();
            oppdaterSaksStatus();
        });
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
                    onClick={opprettEvaluering}
                    disabled={!(sakErIRettStatus && brukerErEierAvSak) || !harPlan}
                />
                <Spørreundersøkelseliste />
            </SpørreundersøkelseProvider>
        )
    );
};
