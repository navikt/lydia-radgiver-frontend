import { useSwrTemplate } from "@/api/lydia-api/networkRequests";
import { leveransePath } from "@/api/lydia-api/paths";
import {
    LeveranserPerIATjeneste,
    leveranserPerIATjenesteSchema,
} from "@features/leveranse/types/leveranse";

export const useHentLeveranser = (orgnummer: string, saksnummer: string) => {
    return useSwrTemplate<LeveranserPerIATjeneste[]>(
        orgnummer ? `${leveransePath}/${orgnummer}/${saksnummer}` : null,
        leveranserPerIATjenesteSchema.array(),
        {
            revalidateOnFocus: true,
        },
    );
};
