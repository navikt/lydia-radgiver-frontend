import {
    IASak,
    IASakshendelseType,
    IASakshendelseTypeEnum,
} from "../../../../../domenetyper/domenetyper";
import { useHentIASaksStatus } from "../../../../../api/lydia-api";

export const useTrengerÅFullføreSamarbeidsplanFørst = (
    hendelsesType: IASakshendelseType,
    sak?: IASak,
): boolean => {
    if (sak === undefined) {
        return false;
    }

    const { data: iaSaksStatus } = useHentIASaksStatus(
        sak.orgnr,
        sak.saksnummer,
    );

    const harSamarbeidsplanSomErUnderArbeid =
        iaSaksStatus?.årsaker.some((årsak) =>
            [
                "SAMARBEIDSPLAN_IKKE_FULLFØRT",
                "INGEN_FULLFØRT_SAMARBEIDSPLAN",
            ].includes(årsak.type),
        ) || false;

    switch (hendelsesType) {
        case IASakshendelseTypeEnum.enum.TILBAKE:
        case IASakshendelseTypeEnum.enum.VIRKSOMHET_SKAL_BISTÅS:
        case IASakshendelseTypeEnum.enum.FULLFØR_BISTAND:
            return harSamarbeidsplanSomErUnderArbeid;
        default:
            return false;
    }
};
