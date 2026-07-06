import {
    VirksomhetIATilstand,
    VirksomhetIATilstandEnum,
} from "../../domenetyper/domenetyper";
import { GenericProps, GenericStatusBadge } from "./StatusBadge";
import { TagProps } from "@navikt/ds-react";
import { exhaustive } from "../../util/exhaustive_types";

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
                hentTagProps={hentTagPropsForVirksomhetTilstand}
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
            exhaustive(tilstand);
            return tilstand;
    }
}

function hentTagPropsForVirksomhetTilstand(
    tilstand: VirksomhetIATilstand,
): Partial<TagProps> {
    switch (tilstand) {
        case VirksomhetIATilstandEnum.enum.VirksomhetVurderes:
            return { variant: "outline", "data-color": "meta-lime" };
        case VirksomhetIATilstandEnum.enum.VirksomhetErVurdert:
            return { variant: "strong", "data-color": "meta-lime" };
        case VirksomhetIATilstandEnum.enum.VirksomhetHarAktiveSamarbeid:
            return { variant: "outline", "data-color": "brand-blue" };
        case VirksomhetIATilstandEnum.enum.AlleSamarbeidIVirksomhetErAvsluttet:
        case VirksomhetIATilstandEnum.enum.VirksomhetKlarTilVurdering:
            break;
        default:
            exhaustive(tilstand);
    }

    return { variant: "strong", "data-color": "neutral" };
}
