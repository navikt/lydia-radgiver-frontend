import {GyldigNesteHendelse, SykefraversstatistikkVirksomhet} from "../domenetyper";
import {ButtonVariant, knappeTypeFraSakshendelsesType} from "../Pages/Virksomhet/IASakshendelseKnapp";

export const sorterHendelserPåKnappeType = (a: GyldigNesteHendelse, b: GyldigNesteHendelse) =>
    ButtonVariant[knappeTypeFraSakshendelsesType(a.saksHendelsestype)].valueOf()
    - ButtonVariant[knappeTypeFraSakshendelsesType(b.saksHendelsestype)].valueOf()

export const sorterAlfabetisk = (a: string, b: string) =>
    a.toLocaleLowerCase().localeCompare(b.toLocaleLowerCase());

export const sorterStatistikkPåSisteÅrstallOgKvartal = (a: SykefraversstatistikkVirksomhet, b: SykefraversstatistikkVirksomhet) =>
    a.arstall !== b.arstall ? b.arstall - a.arstall : b.kvartal - a.kvartal
