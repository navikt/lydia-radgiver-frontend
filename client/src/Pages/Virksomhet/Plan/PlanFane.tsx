import { Button } from "@navikt/ds-react";
import React from "react";
import LeggTilTemaKnapp from "./LeggTilTemaKnapp";
import {
    nyPlanPåSak,
    useHentIaProsesser,
    useHentPlan,
} from "../../../api/lydia-api";
import { IASak } from "../../../domenetyper/domenetyper";
import { Temaer } from "./Temaer";

interface Props {
    iaSak: IASak;
}

export default function PlanFane({ iaSak }: Props) {
    const {
        data: iaSakPlan,
        loading: lasterPlan,
        mutate: hentPlanIgjen,
    } = useHentPlan(iaSak.orgnr, iaSak.saksnummer);

    const { mutate: hentProsesserIgjne } = useHentIaProsesser(
        iaSak.orgnr,
        iaSak.saksnummer,
    );

    const opprettPlan = () => {
        nyPlanPåSak(iaSak.orgnr, iaSak.saksnummer).then((response) => {
            console.log(response);
            hentPlanIgjen();
            hentProsesserIgjne();
        });
    };

    if (iaSakPlan === undefined || lasterPlan) {
        return (
            <Button
                size="small"
                iconPosition="right"
                variant="secondary"
                onClick={opprettPlan}
            >
                Opprett plan
            </Button>
        );
    }

    return (
        <>
            <Temaer
                plan={iaSakPlan}
                orgnummer={iaSak.orgnr}
                saksnummer={iaSak.saksnummer}
                muterPlan={hentPlanIgjen}
            />
            <LeggTilTemaKnapp
                orgnummer={iaSak.orgnr}
                saksnummer={iaSak.saksnummer}
                temaer={iaSakPlan.temaer}
                muterPlan={hentPlanIgjen}
            />
        </>
    );
}
