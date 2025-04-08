import { IASamarbeidStatusEnum, IASamarbeidStatusType } from "../../domenetyper/iaSakProsess";
import { GenericProps, GenericStatusBadge } from "./StatusBadge";


export type StatusBadgeProps = Omit<GenericProps<IASamarbeidStatusType>, "penskrivStatus" | "hentVariant">;

export function SamarbeidStatusBadge({
	...remainingProps
}: StatusBadgeProps) {
	return (
		<GenericStatusBadge
			{...remainingProps}
			penskrivStatus={penskrivIAStatus}
			hentVariant={hentVariantForIAStatus} />
	);
}

export function penskrivIAStatus(status: IASamarbeidStatusType) {
	switch (status) {
		case IASamarbeidStatusEnum.enum.AKTIV:
			return "Aktiv";
		case IASamarbeidStatusEnum.enum.FULLFØRT:
			return "Fullført";
		case IASamarbeidStatusEnum.enum.SLETTET:
			return "Slettet";
		default:
			return status;
	}
}
export const hentVariantForIAStatus = (
	status: IASamarbeidStatusType
) => {
	switch (status) {
		case IASamarbeidStatusEnum.enum.SLETTET:
		default:
			return "neutral-moderate";
		case IASamarbeidStatusEnum.enum.FULLFØRT:
			return "success-filled";
		case IASamarbeidStatusEnum.enum.AKTIV:
			return "info-moderate";
	}
};

