import {GyldigNesteHendelse} from "../domenetyper";
import {ButtonVariant, knappeTypeFraSakshendelsesType} from "../Pages/Virksomhet/IASakshendelseKnapp";

export const sorterHendelserPåKnappeType = (a: GyldigNesteHendelse, b: GyldigNesteHendelse) =>
    ButtonVariant[knappeTypeFraSakshendelsesType(a.saksHendelsestype)].valueOf()
    -  ButtonVariant[knappeTypeFraSakshendelsesType(b.saksHendelsestype)].valueOf()
