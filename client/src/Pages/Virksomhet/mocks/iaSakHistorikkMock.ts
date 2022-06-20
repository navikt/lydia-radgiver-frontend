import {IAProsessStatusEnum, IASakshendelseTypeEnum, Sakshistorikk} from "../../../domenetyper";
import {ulid} from "ulid";

const saksnummer = ulid()
const eier = "X12345"
const nå = Date.now()

export const samarbeidshistorikkMock: Sakshistorikk[] = [{
    saksnummer: saksnummer,
    opprettet: new Date(),
    sakshendelser: [
        {
            status: IAProsessStatusEnum.enum.VURDERES,
            hendelsestype: IASakshendelseTypeEnum.enum.VIRKSOMHET_VURDERES,
            tidspunktForSnapshot: new Date(nå),
            begrunnelser: [],
            eier: null
        },
        {
            status: IAProsessStatusEnum.enum.VURDERES,
            hendelsestype: IASakshendelseTypeEnum.enum.TA_EIERSKAP_I_SAK,
            tidspunktForSnapshot: new Date(nå + 10000),
            begrunnelser: [],
            eier: eier
        },
        {
            status: IAProsessStatusEnum.enum.IKKE_AKTUELL,
            hendelsestype: IASakshendelseTypeEnum.enum.VIRKSOMHET_ER_IKKE_AKTUELL,
            tidspunktForSnapshot: new Date(nå + 20000),
            begrunnelser: [
                "Begrunnelse 1",
                "Begrunnelse 2",
            ],
            eier: eier
        }
    ]
}]
