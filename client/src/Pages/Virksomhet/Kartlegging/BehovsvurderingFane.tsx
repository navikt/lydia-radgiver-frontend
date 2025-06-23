import React from "react";
import { IASak } from "../../../domenetyper/domenetyper";
import {
    erSaksbehandler,
    useHentBrukerinformasjon,
} from "../../../api/lydia-api/bruker";
import { IaSakProsess } from "../../../domenetyper/iaSakProsess";
import { Behovsvurdering } from "./Behovsvurdering";
import { SpørreundersøkelseHeading } from "../../../components/Spørreundersøkelse/SpørreundersøkelseHeading";
import { SpørreundersøkelseHjelpetekst } from "../../../components/Spørreundersøkelse/SpørreundersøkelseHjelpetekst";
import { useHentSamarbeid } from "../../../api/lydia-api/spørreundersøkelse";
import { useHentTeam } from "../../../api/lydia-api/team";

export const BehovsvurderingFane = ({
    iaSak,
    gjeldendeSamarbeid,
}: {
    iaSak: IASak;
    gjeldendeSamarbeid: IaSakProsess;
}) => {
    const { data: alleSamarbeid } = useHentSamarbeid(
        iaSak.orgnr,
        iaSak.saksnummer,
    );

    const { data: brukerInformasjon } = useHentBrukerinformasjon();
    const { data: følgere = [] } = useHentTeam(iaSak?.saksnummer);
    const brukerFølgerSak = følgere.some(
        (følger) => følger === brukerInformasjon?.ident,
    );
    const brukerErEierAvSak = iaSak?.eidAv === brukerInformasjon?.ident;
    const kanEndreSpørreundersøkelser =
        (erSaksbehandler(brukerInformasjon) && brukerFølgerSak) ||
        brukerErEierAvSak;

    const sakErIRettStatus = ["KARTLEGGES", "VI_BISTÅR"].includes(iaSak.status);

    if (alleSamarbeid === undefined || alleSamarbeid.length === 0) {
        return (
            <>
                <SpørreundersøkelseHeading
                    type="Behovsvurdering"
                    samarbeid={gjeldendeSamarbeid}
                />
                <SpørreundersøkelseHjelpetekst
                    type="Behovsvurdering"
                    kanEndreSpørreundersøkelser={kanEndreSpørreundersøkelser}
                    sakErIRettStatus={sakErIRettStatus}
                />
            </>
        );
    }

    return (
        <>
            <SpørreundersøkelseHeading
                type="Behovsvurdering"
                samarbeid={gjeldendeSamarbeid || alleSamarbeid[0]}
            />
            <SpørreundersøkelseHjelpetekst
                type="Behovsvurdering"
                kanEndreSpørreundersøkelser={kanEndreSpørreundersøkelser}
                sakErIRettStatus={sakErIRettStatus}
            />
            <Behovsvurdering
                brukerRolle={brukerInformasjon?.rolle}
                samarbeid={gjeldendeSamarbeid || alleSamarbeid[0]}
                kanEndreSpørreundersøkelser={kanEndreSpørreundersøkelser}
                sakErIRettStatus={sakErIRettStatus}
                iaSak={iaSak}
            />
        </>
    );
};
