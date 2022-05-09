import {
    IASakshendelse,
    IASakshendelseType,
    IASakshendelseTypeEnum,
} from "../../../domenetyper";
import { ulid } from "ulid";

const saksnummer = ulid();
const tilfeldigId = () => ulid();
const navIdent = "X123456";
const orgnummer = "987654321";

const sekund = Date.now();

const nyHendelse = (
    hendelsestype: IASakshendelseType,
    interval = 0
): IASakshendelse => ({
    id: tilfeldigId(),
    saksnummer: saksnummer,
    orgnummer: orgnummer,
    hendelsestype: hendelsestype,
    opprettetAv: navIdent,
    opprettetTidspunkt: new Date(sekund + interval),
});

const opprettelseHendelse = nyHendelse(
    IASakshendelseTypeEnum.enum.OPPRETT_SAK_FOR_VIRKSOMHET
);
const vurderesHendelse = nyHendelse(
    IASakshendelseTypeEnum.enum.VIRKSOMHET_VURDERES,
    1000
);
const taEierskapHendelse = nyHendelse(
    IASakshendelseTypeEnum.enum.TA_EIERSKAP_I_SAK,
    2000
);
const kontaktesHendelse = nyHendelse(
    IASakshendelseTypeEnum.enum.VIRKSOMHET_SKAL_KONTAKTES,
    3000
);

export const sakshendelserMock = [
    opprettelseHendelse,
    vurderesHendelse,
    taEierskapHendelse,
    kontaktesHendelse,
];
