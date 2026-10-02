import { useSwrTemplate } from "./networkRequests";
import { z } from "zod/v4";
import { nyFlytApiBasePath } from "./paths";

export const useNavEnhetFeatureToggle = (featureToggleNavn: string) => {
    return useSwrTemplate<FeatureToggleVerdi>(
        `${nyFlytApiBasePath}/feature-toggling/nav-enhet/${featureToggleNavn}`,
        FeatureToggleVerdiSchema,
    );
};

export const FeatureToggleVerdiSchema = z.object({
    erPå: z.boolean(),
});

export type FeatureToggleVerdi = z.infer<typeof FeatureToggleVerdiSchema>;
