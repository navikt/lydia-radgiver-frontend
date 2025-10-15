import { BodyShort, Heading, HStack, Loader } from "@navikt/ds-react";
import React, { useState } from "react";
import LeggTilTemaKnapp from "./LeggTilTemaKnapp";
import { useHentPlan, useHentPlanMal } from "../../../api/lydia-api/plan";
import {
    erSaksbehandler,
    useHentBrukerinformasjon,
} from "../../../api/lydia-api/bruker";
import { IASak } from "../../../domenetyper/domenetyper";
import { Temaer } from "./Temaer";
import { dispatchFeilmelding } from "../../../components/Banner/dispatchFeilmelding";
import OpprettPlanKnapp from "./OpprettPlanKnapp";
import { IaSakProsess } from "../../../domenetyper/iaSakProsess";
import EksportVisning from "./EksportVisning";
import { Plan } from "../../../domenetyper/plan";
import { VisHvisSamarbeidErÅpent } from "../Samarbeid/SamarbeidContext";
import Samarbeidsfanemeny from "../../../components/Samarbeidsfanemeny";
import { useHentTeam } from "../../../api/lydia-api/team";
import { PubliserSamarbeidsplan } from "./PubliserSamarbeidsplan";
import { erIDev } from "../../../components/Dekoratør/Dekoratør";

function usePollingAvSamarbeidsplan(
    plan: Plan,
    hentSamarbeidsplanPåNytt: () => void,
) {
    const [henterSamarbeidsplanPånytt, setHenterSamarbeidsplanPåNytt] =
        useState(false);

    const [forsøkPåÅHenteSamarbeidsplan, setForsøkPåÅHenteSamarbeidsplan] =
        useState(0);

    React.useEffect(() => {
        if (plan?.publiseringStatus === "OPPRETTET") {
            if (
                !henterSamarbeidsplanPånytt &&
                forsøkPåÅHenteSamarbeidsplan < 10
            ) {
                setHenterSamarbeidsplanPåNytt(true);
                setForsøkPåÅHenteSamarbeidsplan(
                    forsøkPåÅHenteSamarbeidsplan + 1,
                );
                setTimeout(
                    () => {
                        hentSamarbeidsplanPåNytt();
                        setHenterSamarbeidsplanPåNytt(false);
                    },
                    (forsøkPåÅHenteSamarbeidsplan + 1) * 2000,
                );
            }
        }
    }, [
        hentSamarbeidsplanPåNytt,
        henterSamarbeidsplanPånytt,
    ]);

    return { henterSamarbeidsplanPånytt, forsøkPåÅHenteSamarbeidsplan };
}

function SamarbeidsplanHeading({
    iaSak,
    samarbeid,
    samarbeidsplan,
}: {
    iaSak: IASak,
    samarbeid: IaSakProsess;
    samarbeidsplan: Plan;
}) {
    const [lagrer, setLagrer] = React.useState(false);

    const { mutate: hentSamarbeidsplanPåNytt } = useHentPlan(
        iaSak.orgnr,
        iaSak.saksnummer,
        samarbeid.id,
    );

    const { henterSamarbeidsplanPånytt, forsøkPåÅHenteSamarbeidsplan } =
        usePollingAvSamarbeidsplan(samarbeidsplan, hentSamarbeidsplanPåNytt);

    return (
        <>
            <HStack align={"center"} justify={"space-between"}>
                <HStack align={"center"} gap={"8"}>
                    <Heading level="2" size="medium" style={{ width: "11rem" }}>
                        Samarbeidsplan
                    </Heading>
                </HStack>
                <HStack align={"center"} gap={"8"}>
                    {
                        erIDev &&
                        <PubliserSamarbeidsplan
                            plan={samarbeidsplan}
                            hentSamarbeidsplanPåNytt={
                                hentSamarbeidsplanPåNytt
                            }
                            pollerPåStatus={
                                henterSamarbeidsplanPånytt ||
                                forsøkPåÅHenteSamarbeidsplan < 10
                            }
                        />
                    }
                    <Samarbeidsfanemeny type="SAMARBEIDSPLAN" laster={lagrer}>
                        {samarbeidsplan && (
                            <EksportVisning
                                samarbeidsplan={samarbeidsplan}
                                samarbeid={samarbeid}
                                setLagrer={setLagrer}
                            />
                        )}
                    </Samarbeidsfanemeny>
                </HStack>
            </HStack>
            <HStack align={"center"} justify={"space-between"}>
                <HStack align={"center"} gap={"8"}>
                    <p>Oppdatert: {samarbeidsplan?.sistEndret.toLocaleTimeString()}</p>
                    {samarbeidsplan?.publiseringStatus == "PUBLISERT" &&
                        (samarbeidsplan?.harEndringerSidenSistPublisert ? (
                            <p>Planen er oppdatert, men ikke publisert til arbeidsgiver</p>
                        ) : (
                            <p>Publisert: {samarbeidsplan?.sistPublisert?.toLocaleTimeString()}</p>
                        ))
                    }
                </HStack>
            </HStack>
        </>
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
    const { data: følgere = [] } = useHentTeam(iaSak?.saksnummer);
    const brukerFølgerSak = følgere.some(
        (følger) => følger === brukerInformasjon?.ident,
    );
    const brukerErEierAvSak = iaSak?.eidAv === brukerInformasjon?.ident;
    const eierEllerFølgerSak =
        (erSaksbehandler(brukerInformasjon) && brukerFølgerSak) ||
        brukerErEierAvSak;

    const sakErIRettStatus = ["KARTLEGGES", "VI_BISTÅR"].includes(iaSak.status);
    const kanOppretteEllerEndrePlan = eierEllerFølgerSak && sakErIRettStatus;
    const erLesebruker = brukerInformasjon?.rolle === "Lesetilgang";

    if (planFeil && planFeil.message !== "Fant ikke plan") {
        dispatchFeilmelding({ feilmelding: planFeil.message });
    }

    if (lasterPlan || lasterPlanMal) {
        return <Loader />;
    }

    if (samarbeidsplan === undefined && planMal) {
        if (erLesebruker) {
            return <BodyShort>Ingen samarbeidsplan er opprettet</BodyShort>;
        }

        return (
            <>
                {samarbeidsplan && <SamarbeidsplanHeading
                    iaSak={iaSak}
                    samarbeid={samarbeid}
                    samarbeidsplan={samarbeidsplan}
                />}
                {!eierEllerFølgerSak && (
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
                    kanEndrePlan={eierEllerFølgerSak}
                    sakErIRettStatus={sakErIRettStatus}
                />
            </>
        );
    }

    return (
        samarbeidsplan && (
            <>
                <SamarbeidsplanHeading
                    iaSak={iaSak}
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
                <VisHvisSamarbeidErÅpent>
                    <LeggTilTemaKnapp
                        orgnummer={iaSak.orgnr}
                        saksnummer={iaSak.saksnummer}
                        samarbeid={samarbeid}
                        samarbeidsplan={samarbeidsplan}
                        hentPlanIgjen={hentPlanIgjen}
                        kanEndrePlan={eierEllerFølgerSak}
                        sakErIRettStatus={sakErIRettStatus}
                    />
                </VisHvisSamarbeidErÅpent>
            </>
        )
    );
}
