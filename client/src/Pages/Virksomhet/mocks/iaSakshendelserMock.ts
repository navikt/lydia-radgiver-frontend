import {IASakshendelse, IASakshendelseType, IASakshendelseTypeEnum} from "../../../domenetyper";
import {ulid} from "ulid";


const saksnummer = ulid()
const tilfeldigId = () => ulid()
const navIdent = "X123456"
const orgnummer = "987654321";

const nyHendelse = (hendelsestype: IASakshendelseType): IASakshendelse => ({
    id: tilfeldigId(),
    saksnummer: saksnummer,
    orgnummer: orgnummer,
    hendelsestype: hendelsestype,
    opprettetAv: navIdent,
    opprettetTidspunkt: new Date()
})

const opprettelseHendelse = nyHendelse(IASakshendelseTypeEnum.enum.OPPRETT_SAK_FOR_VIRKSOMHET)
const vurderesHendelse = nyHendelse(IASakshendelseTypeEnum.enum.VIRKSOMHET_VURDERES)
const kontaktesHendelse = nyHendelse(IASakshendelseTypeEnum.enum.VIRKSOMHET_SKAL_KONTAKTES)
const taEierskapHendelse = nyHendelse(IASakshendelseTypeEnum.enum.TA_EIERSKAP_I_SAK)
export const sakshendelserMock = [
    opprettelseHendelse,
    vurderesHendelse,
    taEierskapHendelse,
    kontaktesHendelse
]
