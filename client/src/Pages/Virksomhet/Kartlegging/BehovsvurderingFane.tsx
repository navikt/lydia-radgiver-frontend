import React from "react";
import { IASak } from "../../../domenetyper/domenetyper";
import { useHentBrukerinformasjon } from "../../../api/lydia-api/bruker";
import { IaSakProsess } from "../../../domenetyper/iaSakProsess";
import { Behovsvurdering } from "./Behovsvurdering";
import { SpørreundersøkelseHeading } from "../../../components/Spørreundersøkelse/SpørreundersøkelseHeading";
import { SpørreundersøkelseHjelpetekst } from "../../../components/Spørreundersøkelse/SpørreundersøkelseHjelpetekst";
import { useHentSamarbeid } from "../../../api/lydia-api/kartlegging";

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
    const brukerErEierAvSak = iaSak.eidAv === brukerInformasjon?.ident;

    const sakErIRettStatus = ["KARTLEGGES", "VI_BISTÅR"].includes(iaSak.status);

    if (alleSamarbeid === undefined || alleSamarbeid.length === 0) {
        return (
            <>
                <SpørreundersøkelseHeading type="Behovsvurdering" samarbeid={gjeldendeSamarbeid} />
                <SpørreundersøkelseHjelpetekst
                    type="behovsvurdering"
                    brukerErEierAvSak={brukerErEierAvSak}
                    sakErIRettStatus={sakErIRettStatus}
                />
            </>
        );
    }

    return (
        <>
            <SpørreundersøkelseHeading type="Behovsvurdering" samarbeid={gjeldendeSamarbeid || alleSamarbeid[0]} />
            <SpørreundersøkelseHjelpetekst
                type="behovsvurdering"
                brukerErEierAvSak={brukerErEierAvSak}
                sakErIRettStatus={sakErIRettStatus}
            />
            <Behovsvurdering
                brukerRolle={brukerInformasjon?.rolle}
                samarbeid={gjeldendeSamarbeid || alleSamarbeid[0]}
                brukerErEierAvSak={brukerErEierAvSak}
                sakErIRettStatus={sakErIRettStatus}
                iaSak={iaSak}
            />
        </>
    );
};
