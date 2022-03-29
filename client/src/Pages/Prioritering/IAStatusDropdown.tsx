import {Select} from "@navikt/ds-react";
import {IAProsessStatusType} from "../../domenetyper";

interface Props {
    valgtStatus?: IAProsessStatusType
    endreStatus: (status?: IAProsessStatusType) => void
    statuser: IAProsessStatusType[]
}

const penskrivIaStatus = (status: IAProsessStatusType) => {
    switch (status) {
        case "PRIORITERT":
            return "Prioritert"
        case "NY":
            return "Ny"
        case "KARTLEGGING":
            return "Kartlegging"
        case "GJENNOMFORING":
            return "Gjennomføring"
        case "AVSLUTTET":
            return "Avsluttet"
        case "IKKE_AKTIV":
            return "Ikke aktiv"
        case "EVALUERING":
            return "Evaluering"
        case "TAKKET_NEI":
            return "Takket nei"
        case "AVSLATT_AV_NALS":
            return "Avslått av NALS"
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