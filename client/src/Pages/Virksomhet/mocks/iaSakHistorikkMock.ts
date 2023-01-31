import { IAProsessStatusEnum, IASakshendelseTypeEnum, Sakshistorikk } from "../../../domenetyper/domenetyper";
import { ulid } from "ulid";

const eier = "X12345"
const nå = Date.now()

export const samarbeidshistorikkMock: Sakshistorikk[] = [{
    saksnummer: ulid(),
    opprettet: new Date(),
    sakshendelser: [
        {
            status: IAProsessStatusEnum.enum.NY,
            hendelsestype: IASakshendelseTypeEnum.enum.OPPRETT_SAK_FOR_VIRKSOMHET,
            tidspunktForSnapshot: new Date(nå),
            begrunnelser: [],
            eier: null
        },
        {
            status: IAProsessStatusEnum.enum.VURDERES,
            hendelsestype: IASakshendelseTypeEnum.enum.VIRKSOMHET_VURDERES,
            tidspunktForSnapshot: new Date(nå + 5000),
            begrunnelser: [],
            eier: null
        },
    ]
}, {
    saksnummer: ulid(),
    opprettet: new Date(),
    sakshendelser: [
        {
            status: IAProsessStatusEnum.enum.NY,
            hendelsestype: IASakshendelseTypeEnum.enum.OPPRETT_SAK_FOR_VIRKSOMHET,
            tidspunktForSnapshot: new Date(nå),
            begrunnelser: [],
            eier: null
        },
        {
            status: IAProsessStatusEnum.enum.VURDERES,
            hendelsestype: IASakshendelseTypeEnum.enum.VIRKSOMHET_VURDERES,
            tidspunktForSnapshot: new Date(nå + 5000),
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
                "En kjeeeee eeee eeeee eeee eeeee eeee eeeee eeee eeeee eeee eeeee eeee mpe lang begrunnelse",
            ],
            eier: eier
        }
    ]
}]


export const samarbeidshistorikkMockMedFlereSaker = [
    samarbeidshistorikkMock[0],
    samarbeidshistorikkMock[1],
]
