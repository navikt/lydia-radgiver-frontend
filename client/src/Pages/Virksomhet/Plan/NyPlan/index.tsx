import React from "react";
import { useNavEnhetFeatureToggle } from "../../../../api/lydia-api/featureToggle";

export default function NyPlan() {
    const { data } = useNavEnhetFeatureToggle("enheter_til_nyplan");
    const skalVises = !!data?.erPå;

    return skalVises && <p>Nå ser du ny versjon av planen</p>;
}
