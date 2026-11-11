import { useNavEnhetFeatureToggle } from "../../../../api/lydia-api/featureToggle";

export default function NyPlan() {
    useNavEnhetFeatureToggle("enheter_til_nyplan");

    return null;
}
