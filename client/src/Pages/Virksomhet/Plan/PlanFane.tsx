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
import { dispatchFeilmelding } from "../../../components/Banner/FeilmeldingBanner";

interface Props {
    iaSak: IASak;
}

export default function PlanFane({ iaSak }: Props) {
    const {
        data: iaSakPlan,
        loading: lasterPlan,
        mutate: hentPlanIgjen,
        error: planFeil,
    } = useHentPlan(iaSak.orgnr, iaSak.saksnummer);

    const { mutate: hentProsesserIgjen } = useHentIaProsesser(
        iaSak.orgnr,
        iaSak.saksnummer,
    );

    const opprettPlan = () => {
        nyPlanPåSak(iaSak.orgnr, iaSak.saksnummer).then(() => {
            hentPlanIgjen();
            hentProsesserIgjen();
        });
    };

    if (planFeil && planFeil.message !== "Fant ikke plan") {
        dispatchFeilmelding({ feilmelding: planFeil.message });
    }

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
        iaSakPlan && (
            <>
                <Temaer
                    plan={iaSakPlan}
                    orgnummer={iaSak.orgnr}
                    saksnummer={iaSak.saksnummer}
                    hentPlanIgjen={hentPlanIgjen}
                />
                <LeggTilTemaKnapp
                    orgnummer={iaSak.orgnr}
                    saksnummer={iaSak.saksnummer}
                    temaer={iaSakPlan.temaer}
                    hentPlanIgjen={hentPlanIgjen}
                />
            </>
        )
    );
}
