import { IASamarbeidStatusType } from "../../domenetyper/iaSakProsess";
import {
    hentTagPropsForIAStatus,
    penskrivIAStatus,
} from "./IAProsessStatusBadge";
import { GenericProps, GenericStatusBadge } from "./StatusBadge";

export type StatusBadgeProps = Omit<
    GenericProps<IASamarbeidStatusType>,
    "penskrivStatus" | "hentTagProps"
>;

export function SamarbeidStatusBadge({ ...remainingProps }: StatusBadgeProps) {
    return (
        <GenericStatusBadge
            {...remainingProps}
            penskrivStatus={penskrivIAStatus}
            hentTagProps={hentTagPropsForIAStatus}
        />
    );
}
