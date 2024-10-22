import React from "react";
import { IASak } from "../../../domenetyper/domenetyper";
import {
    useHentBrukerinformasjon,
    useHentSamarbeid,
} from "../../../api/lydia-api";
import { IaSakProsess } from "../../../domenetyper/iaSakProsess";
import { BehovsvurderingHeading } from "./BehovsvurderingHeading";
import { BehovsvurderingHjelpetekst } from "./BehovsvurderingHjelpetekst";
import { Behovsvurdering } from "./Behovsvurdering";

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
                <BehovsvurderingHeading samarbeid={gjeldendeSamarbeid} />
                <BehovsvurderingHjelpetekst
                    brukerErEierAvSak={brukerErEierAvSak}
                    sakErIRettStatus={sakErIRettStatus}
                />
            </>
        );
    }

    return (
        <>
            <BehovsvurderingHeading
                samarbeid={gjeldendeSamarbeid || alleSamarbeid[0]}
            />
            <BehovsvurderingHjelpetekst
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
