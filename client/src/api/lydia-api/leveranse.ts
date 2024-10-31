import {
    LeveranserPerIATjeneste,
    leveranserPerIATjenesteSchema,
} from "../../domenetyper/leveranse";
import { useSwrTemplate } from "./networkRequests";
import { leveransePath } from "./paths";

export const useHentLeveranser = (orgnummer: string, saksnummer: string) => {
    return useSwrTemplate<LeveranserPerIATjeneste[]>(
        orgnummer ? `${leveransePath}/${orgnummer}/${saksnummer}` : null,
        leveranserPerIATjenesteSchema.array(),
        {
            revalidateOnFocus: true,
        },
    );
};
