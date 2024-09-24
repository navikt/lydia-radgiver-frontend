import {
    IASak,
    IASakshendelseType,
    IASakshendelseTypeEnum,
} from "../../../../../domenetyper/domenetyper";
import { useHentKartlegginger } from "../../../../../api/lydia-api";

export const useTrengerÅFullføreKartleggingerFørst = (
    hendelsesType: IASakshendelseType,
    sak?: IASak,
): boolean => {
    if (sak === undefined) {
        return false;
    }

    const { data: kartleggingerPåSak } = useHentKartlegginger(
        sak.orgnr,
        sak.saksnummer,
    );
    const harKartleggingerSomErUnderArbeid =
        kartleggingerPåSak
            ?.flatMap((kartlegging) => kartlegging.status)
            .some((status) => status !== "AVSLUTTET") || false;

    switch (hendelsesType) {
        case IASakshendelseTypeEnum.enum.TILBAKE:
        case IASakshendelseTypeEnum.enum.VIRKSOMHET_SKAL_BISTÅS:
        case IASakshendelseTypeEnum.enum.FULLFØR_BISTAND:
            return harKartleggingerSomErUnderArbeid;
        default:
            return false;
    }
};
