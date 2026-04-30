import { post } from "@/api/lydia-api/networkRequests";
import { dokumentPath } from "@/api/lydia-api/paths";
import {
    DokumentPubliseringDto,
    dokumentpubliseringschema,
    DokumentType,
} from "@/domenetyper/domenetyper";
import { Spørreundersøkelse } from "@features/kartlegging/types/spørreundersøkelse";
import { Plan } from "@features/plan/types/plan";

export const publiserSpørreundersøkelse = (
    spørreundersøkelse: Spørreundersøkelse,
): Promise<DokumentPubliseringDto> =>
    publiserDokument(spørreundersøkelse.id, spørreundersøkelse.type);

export const publiserSamarbeidsplan = (
    plan: Plan,
): Promise<DokumentPubliseringDto> =>
    publiserDokument(plan.id, "SAMARBEIDSPLAN");

const publiserDokument = (
    dokumentReferanseId: string,
    dokumentType: DokumentType,
): Promise<DokumentPubliseringDto> => {
    return post(
        `${dokumentPath}/type/${dokumentType}/ref/${dokumentReferanseId}`,
        dokumentpubliseringschema,
    );
};
