import {Select} from "@navikt/ds-react";
import {IAProsessStatusType} from "../../domenetyper";

interface Props {
    valgtStatus?: IAProsessStatusType
    endreStatus: (status?: IAProsessStatusType) => void
    statuser: IAProsessStatusType[]
}

const penskrivIaStatus = (status: IAProsessStatusType) => {
    switch (status) {
        case "VURDERES":
            return "Vurderes"
        case "KONTAKTES":
            return "Kontaktes"
        case "IKKE_AKTIV":
            return "Ikke aktiv"
        case "IKKE_AKTUELL":
            return "Ikke aktuell"
        default:
            return "N/A"
    }
}

export const IAStatusDropdown = ({ valgtStatus, endreStatus, statuser }: Props) => (<Select label="IA-status" value={valgtStatus} onChange={event => {
    endreStatus((!!event.target.value && event.target.value as IAProsessStatusType) || undefined)
}}>
    <option key="empty-status" value={""}>Ikke valgt</option>
    {statuser
        .map((status) => (<option key={status} value={status}>{penskrivIaStatus(status)}</option>))
    }
</Select>)