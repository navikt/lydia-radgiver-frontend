import { ChangeEvent } from "react";
import { Select } from "@navikt/ds-react";
import { IAProsessStatusType } from "../../../domenetyper/domenetyper";
import { penskrivIAStatus } from "../../../components/Badge/StatusBadge";

interface Props {
    valgtStatus?: IAProsessStatusType;
    endreStatus: (status?: IAProsessStatusType) => void;
    statuser: IAProsessStatusType[];
}

export const IAStatusDropdown = ({
    valgtStatus,
    endreStatus,
    statuser,
}: Props) => {
    const onChange = (event: ChangeEvent<HTMLSelectElement>) => {
        endreStatus(
            (!!event.target.value &&
                (event.target.value as IAProsessStatusType)) ||
                undefined,
        );
    };

    return (
        <Select label="Status" value={valgtStatus || ""} onChange={onChange}>
            <option key="empty-status" value={""}>
                Alle
            </option>
            {statuser.map((status) => (
                <option key={status} value={status}>
                    {penskrivIAStatus(status)}
                </option>
            ))}
        </Select>
    );
};
