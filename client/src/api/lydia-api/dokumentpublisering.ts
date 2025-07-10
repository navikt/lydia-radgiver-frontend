import { Spørreundersøkelse } from "../../domenetyper/spørreundersøkelse";
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

const publiserDokument = (
    dokumentReferanseId: string,
    dokumentType: DokumentType,
): Promise<DokumentPubliseringDto> => {
    return post(
        `${dokumentPath}/type/${dokumentType}/ref/${dokumentReferanseId}`,
        dokumentpubliseringschema,
    );
};
