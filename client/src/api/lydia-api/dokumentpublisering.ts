import {
    DokumentPubliseringDto,
    dokumentpubliseringschema,
    DokumentType,
} from "@/domenetyper/domenetyper";
import { Plan } from "@/domenetyper/plan";
import { Spørreundersøkelse } from "@/domenetyper/spørreundersøkelse";
import { post } from "./networkRequests";
import { dokumentPath } from "./paths";

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
