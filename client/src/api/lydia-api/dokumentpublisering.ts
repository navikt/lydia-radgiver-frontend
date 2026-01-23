import { Spørreundersøkelse } from "../../domenetyper/spørreundersøkelse";
import { Plan } from "../../domenetyper/plan";
import { post } from "./networkRequests";
import { dokumentPath } from "./paths";
import {
    DokumentPubliseringDto,
    dokumentpubliseringschema,
    DokumentType,
} from "../../domenetyper/domenetyper";

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
