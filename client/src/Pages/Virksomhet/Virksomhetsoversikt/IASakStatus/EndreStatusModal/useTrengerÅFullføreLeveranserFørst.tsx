import {
    IASak,
    IASakshendelseType,
    IASakshendelseTypeEnum,
} from "../../../../../domenetyper/domenetyper";
import { useHentLeveranser } from "../../../../../api/lydia-api";

export const useTrengerÅFullføreLeveranserFørst = (
    hendelsesType: IASakshendelseType,
    sak?: IASak,
): boolean => {
    if (sak === undefined) {
        return false;
    }
    const { data: leveranserPåSak } = useHentLeveranser(
        sak.orgnr,
        sak.saksnummer,
    );
    const harLeveranserSomErUnderArbeid =
        leveranserPåSak
            ?.flatMap((iaTjeneste) => iaTjeneste.leveranser)
            .some((leveranse) => leveranse.status === "UNDER_ARBEID") || false;

    switch (hendelsesType) {
        case IASakshendelseTypeEnum.enum.TILBAKE:
        case IASakshendelseTypeEnum.enum.FULLFØR_BISTAND:
            return harLeveranserSomErUnderArbeid;
        default:
            return false;
    }
};
