import { IAProsessStatusType } from "../../domenetyper/domenetyper";
import { GenericProps, GenericStatusBadge, penskrivIAStatus, hentVariantForIAStatus } from "./StatusBadge";


export type StatusBadgeProps = Omit<GenericProps<IAProsessStatusType>, "penskrivStatus" | "hentVariant">;
export function IAProsessStatusBadge({
	...remainingProps
}: StatusBadgeProps) {
	return (
		<GenericStatusBadge
			{...remainingProps}
			penskrivStatus={penskrivIAStatus}
			hentVariant={hentVariantForIAStatus} />
	);
}
