import {
    IASak,
    IASakshendelseType,
    IASakshendelseTypeEnum,
} from "../../../../../domenetyper/domenetyper";
import { useHentIASaksStatus } from "../../../../../api/lydia-api/sak";

export const useTrengerÅFullføreBehovsvurderingerFørst = (
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

    const harKartleggingerSomErUnderArbeid =
        iaSaksStatus?.årsaker.some((årsak) =>
            [
                "BEHOVSVURDERING_IKKE_FULLFØRT",
                "INGEN_FULLFØRT_BEHOVSVURDERING",
            ].includes(årsak.type),
        ) || false;

    switch (hendelsesType) {
        case IASakshendelseTypeEnum.enum.TILBAKE:
        case IASakshendelseTypeEnum.enum.VIRKSOMHET_SKAL_BISTÅS:
        case IASakshendelseTypeEnum.enum.FULLFØR_BISTAND:
            return harKartleggingerSomErUnderArbeid;
        default:
            return false;
    }
};
