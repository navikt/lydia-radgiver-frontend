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
import { VisHvisSamarbeidErÅpent } from "../SamarbeidContext";
import { SpørreundersøkelseType } from "../../../../domenetyper/spørreundersøkelseMedInnhold";

export const Evaluering = ({
    iaSak,
    samarbeid,
    kanEndreSpørreundersøkelser,
    sakErIRettStatus,
    brukerRolle,
    harPlan,
}: {
    samarbeid: IaSakProsess;
    kanEndreSpørreundersøkelser: boolean;
    sakErIRettStatus: boolean;
    iaSak: IASak;
    brukerRolle: "Superbruker" | "Saksbehandler" | "Lesetilgang" | undefined;
    harPlan?: boolean;
}) => {
    const [sisteOpprettedeId, setSisteOpprettedeId] = React.useState("");
    const spørreundersøkelseType: SpørreundersøkelseType = "EVALUERING";

    const {
        data: spørreundersøkelseListe,
        loading: lasterSpørreundersøkelser,
        mutate: hentSpørreundersøkelserPåNytt,
    } = useHentSpørreundersøkelser(
        iaSak.orgnr,
        iaSak.saksnummer,
        samarbeid.id,
        spørreundersøkelseType,
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
            spørreundersøkelseType,
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
                spørreundersøkelseType={spørreundersøkelseType}
                spørreundersøkelseliste={spørreundersøkelseListe}
                iaSak={iaSak}
                samarbeid={samarbeid}
                brukerRolle={brukerRolle}
                kanEndreSpørreundersøkelser={kanEndreSpørreundersøkelser}
                sisteOpprettedeSpørreundersøkelseId={sisteOpprettedeId}
                setSisteOpprettedeSpørreundersøkelseId={setSisteOpprettedeId}
            >
                <VisHvisSamarbeidErÅpent>
                    <OpprettNySpørreundersøkelseKnapp
                        onClick={opprettEvaluering}
                        disabled={
                            !(
                                sakErIRettStatus && kanEndreSpørreundersøkelser
                            ) || !harPlan
                        }
                    />
                </VisHvisSamarbeidErÅpent>
                <Spørreundersøkelseliste />
            </SpørreundersøkelseProvider>
        )
    );
};
