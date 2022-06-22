import {Select} from "@navikt/ds-react";
import {IAProsessStatusType} from "../../domenetyper";
import {penskrivIAStatus} from "./StatusBadge";

interface Props {
    valgtStatus?: IAProsessStatusType
    endreStatus: (status?: IAProsessStatusType) => void
    statuser: IAProsessStatusType[]
}

export const IAStatusDropdown = ({ valgtStatus, endreStatus, statuser }: Props) => (<Select label="Status" value={valgtStatus} onChange={event => {
    endreStatus((!!event.target.value && event.target.value as IAProsessStatusType) || undefined)
}}>
    <option key="empty-status" value={""}>Vis alle</option>
    {statuser
        .map((status) => (<option key={status} value={status}>{penskrivIAStatus(status)}</option>))
    }
</Select>)
