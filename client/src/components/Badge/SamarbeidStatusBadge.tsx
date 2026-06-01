import { IASamarbeidStatusType } from "../../domenetyper/iaSakProsess";
import {
    hentVariantForIAStatus,
    penskrivIAStatus,
} from "./IAProsessStatusBadge";
import { GenericProps, GenericStatusBadge } from "./StatusBadge";

export type StatusBadgeProps = Omit<
    GenericProps<IASamarbeidStatusType>,
    "penskrivStatus" | "hentVariant"
>;

export function SamarbeidStatusBadge({ ...remainingProps }: StatusBadgeProps) {
    return (
        <GenericStatusBadge
            {...remainingProps}
            penskrivStatus={penskrivIAStatus}
            hentVariant={hentVariantForIAStatus}
        />
    );
}
