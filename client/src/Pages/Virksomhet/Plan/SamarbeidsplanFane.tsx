import { BodyShort, Heading, HStack, Loader, Tag } from "@navikt/ds-react";
import React from "react";
import LeggTilTemaKnapp from "./LeggTilTemaKnapp";
import {
    useHentBrukerinformasjon,
    useHentPlan,
    useHentPlanMal,
} from "../../../api/lydia-api";
import { IASak } from "../../../domenetyper/domenetyper";
import { Temaer } from "./Temaer";
import { dispatchFeilmelding } from "../../../components/Banner/FeilmeldingBanner";
import OpprettPlanKnapp from "./OpprettPlanKnapp";
import { IaSakProsess } from "../../../domenetyper/iaSakProsess";
import EksportVisning from "./EksportVisning";
import { Plan } from "../../../domenetyper/plan";
import { erIDev } from "../../../components/Dekoratør/Dekoratør";

function SamarbeidsplanHeading({
    samarbeid,
    samarbeidsplan,
}: {
    samarbeid: IaSakProsess;
    samarbeidsplan?: Plan;
}) {
    return (
        <HStack align={"center"} justify={"space-between"}>
            <HStack align={"center"} gap={"8"}>
                <Heading level="2" size="medium" style={{ width: "11rem" }}>
                    Samarbeidsplan
                </Heading>
                {samarbeid && (
                    <Tag variant={"alt3-filled"}>
                        {samarbeid.navn || "Samarbeid uten navn"}
                    </Tag>
                )}
            </HStack>

            {samarbeidsplan && erIDev && (
                <EksportVisning samarbeidsplan={samarbeidsplan} />
            )}
        </HStack>
    );
}

export default function SamarbeidsplanFane({
    iaSak,
    samarbeid,
}: {
    iaSak: IASak;
    samarbeid: IaSakProsess;
}) {
    const { data: planMal, loading: lasterPlanMal } = useHentPlanMal();

    const {
        data: samarbeidsplan,
        loading: lasterPlan,
        mutate: hentPlanIgjen,
        error: planFeil,
    } = useHentPlan(iaSak.orgnr, iaSak.saksnummer, samarbeid.id);

    const { data: brukerInformasjon } = useHentBrukerinformasjon();
    const brukerErEierAvSak = iaSak.eidAv === brukerInformasjon?.ident;
    const sakErIRettStatus = ["KARTLEGGES", "VI_BISTÅR"].includes(iaSak.status);
    const kanOppretteEllerEndrePlan = brukerErEierAvSak && sakErIRettStatus;

    if (planFeil && planFeil.message !== "Fant ikke plan") {
        dispatchFeilmelding({ feilmelding: planFeil.message });
    }

    if (lasterPlan || lasterPlanMal) {
        return <Loader />;
    }

    if (samarbeidsplan === undefined && planMal) {
        return (
            <>
                <SamarbeidsplanHeading samarbeid={samarbeid} />
                {!brukerErEierAvSak && (
                    <BodyShort>
                        Du må være eier av saken for å opprette ny plan
                    </BodyShort>
                )}
                {!sakErIRettStatus && (
                    <BodyShort>
                        Status må være i <i>Kartlegges</i> eller{" "}
                        <i>Vi bistår</i> for å opprette ny plan
                    </BodyShort>
                )}
                <OpprettPlanKnapp
                    orgnummer={iaSak.orgnr}
                    saksnummer={iaSak.saksnummer}
                    samarbeid={samarbeid}
                    planMal={planMal}
                    brukerErEierAvSak={brukerErEierAvSak}
                    sakErIRettStatus={sakErIRettStatus}
                />
            </>
        );
    }

    return (
        samarbeidsplan && (
            <>
                <SamarbeidsplanHeading
                    samarbeid={samarbeid}
                    samarbeidsplan={samarbeidsplan}
                />
                <Temaer
                    samarbeidsplan={samarbeidsplan}
                    orgnummer={iaSak.orgnr}
                    saksnummer={iaSak.saksnummer}
                    samarbeid={samarbeid}
                    hentPlanIgjen={hentPlanIgjen}
                    kanOppretteEllerEndrePlan={kanOppretteEllerEndrePlan}
                />
                <LeggTilTemaKnapp
                    orgnummer={iaSak.orgnr}
                    saksnummer={iaSak.saksnummer}
                    samarbeid={samarbeid}
                    samarbeidsplan={samarbeidsplan}
                    hentPlanIgjen={hentPlanIgjen}
                    brukerErEierAvSak={brukerErEierAvSak}
                    sakErIRettStatus={sakErIRettStatus}
                />
            </>
        )
    );
}
