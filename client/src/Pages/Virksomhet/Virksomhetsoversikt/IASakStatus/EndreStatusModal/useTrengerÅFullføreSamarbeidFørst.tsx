import {
    IASak,
    IASakshendelseType,
    IASakshendelseTypeEnum,
} from "../../../../../domenetyper/domenetyper";
import { useHentSamarbeid } from "../../../../../api/lydia-api/spørreundersøkelse";

export const useTrengerÅFullføreSamarbeidFørst = (
    hendelsesType: IASakshendelseType,
    sak?: IASak,
): boolean => {
    if (sak === undefined) {
        return false;
    }

    const { data: alleSamarbeid } = useHentSamarbeid(sak.orgnr, sak.saksnummer);
    const harAktiveSamarbeid =
        alleSamarbeid?.some((samarbeid) => samarbeid.status === "AKTIV") ||
        false;

    switch (hendelsesType) {
        case IASakshendelseTypeEnum.enum.VIRKSOMHET_SKAL_BISTÅS:
        case IASakshendelseTypeEnum.enum.FULLFØR_BISTAND:
        case IASakshendelseTypeEnum.enum.VIRKSOMHET_ER_IKKE_AKTUELL:
            return harAktiveSamarbeid;
        default:
            return false;
    }
};
