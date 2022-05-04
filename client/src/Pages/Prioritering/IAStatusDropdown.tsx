import {Select} from "@navikt/ds-react";
import {IAProsessStatusEnum, IAProsessStatusType} from "../../domenetyper";

interface Props {
    valgtStatus?: IAProsessStatusType
    endreStatus: (status?: IAProsessStatusType) => void
    statuser: IAProsessStatusType[]
}

const penskrivIaStatus = (status: IAProsessStatusType) => {
    switch (status) {
        case IAProsessStatusEnum.enum.VURDERES:
            return "Vurderes"
        case IAProsessStatusEnum.enum.KONTAKTES:
            return "Kontaktes"
        case IAProsessStatusEnum.enum.IKKE_AKTIV:
            return "Ikke aktiv"
        case IAProsessStatusEnum.enum.IKKE_AKTUELL:
            return "Ikke aktuell"
        default:
            return "N/A"
    }
}

export const IAStatusDropdown = ({ valgtStatus, endreStatus, statuser }: Props) => (<Select label="IA-status" value={valgtStatus} onChange={event => {
    endreStatus((!!event.target.value && event.target.value as IAProsessStatusType) || undefined)
}}>
    <option key="empty-status" value={""}>Vis alle</option>
    {statuser
        .map((status) => (<option key={status} value={status}>{penskrivIaStatus(status)}</option>))
    }
</Select>)
