import {
    VirksomhetIATilstand,
    VirksomhetIATilstandEnum,
} from "../../domenetyper/domenetyper";
import { GenericProps, GenericStatusBadge } from "./StatusBadge";
import { TagProps } from "@navikt/ds-react";

export type StatusBadgeProps = Omit<
    GenericProps<VirksomhetIATilstand>,
    "penskrivStatus" | "hentVariant" | "status"
> & {
    tilstand: VirksomhetIATilstand;
};
export function VirksomhetTilstandStatusBadge({
    tilstand,
    ...remainingProps
}: StatusBadgeProps) {
    return (
        tilstand !=
            VirksomhetIATilstandEnum.enum.VirksomhetKlarTilVurdering && (
            <GenericStatusBadge
                {...remainingProps}
                status={tilstand}
                penskrivStatus={penskrivVirksomhetTilstand}
                hentVariant={hentVariantForVirksomhetTilstand}
            />
        )
    );
}

export function penskrivVirksomhetTilstand(tilstand: VirksomhetIATilstand) {
    switch (tilstand) {
        case VirksomhetIATilstandEnum.enum.VirksomhetKlarTilVurdering:
            return "Ikke aktiv";
        case VirksomhetIATilstandEnum.enum.VirksomhetVurderes:
            return "Vurderes";
        case VirksomhetIATilstandEnum.enum.VirksomhetErVurdert:
            return "Vurdert";
        case VirksomhetIATilstandEnum.enum.VirksomhetHarAktiveSamarbeid:
            return "Aktiv";
        case VirksomhetIATilstandEnum.enum.AlleSamarbeidIVirksomhetErAvsluttet:
            return "Avsluttet";
        default:
            return tilstand;
    }
}

export const hentVariantForVirksomhetTilstand = (
    tilstand: VirksomhetIATilstand,
): TagProps["variant"] => {
    switch (tilstand) {
        case VirksomhetIATilstandEnum.enum.VirksomhetVurderes:
            return "info-moderate";
        case VirksomhetIATilstandEnum.enum.VirksomhetErVurdert:
            return "error-moderate";
        case VirksomhetIATilstandEnum.enum.VirksomhetHarAktiveSamarbeid:
            return "success-moderate";
        case VirksomhetIATilstandEnum.enum.AlleSamarbeidIVirksomhetErAvsluttet:
            return "neutral-moderate";
        default:
            return "neutral-moderate";
    }
};
