import "@navikt/ds-css";
import {
    spørreundersøkelseStatusEnum,
    SpørreundersøkelseStatus,
} from "../../domenetyper/domenetyper";
import { GenericProps, GenericStatusBadge } from "./StatusBadge";
import { TagProps } from "@navikt/ds-react";

function hentTagPropsForSpørreundersøkelseStatus(
    status: SpørreundersøkelseStatus,
): Partial<TagProps> {
    switch (status) {
        case spørreundersøkelseStatusEnum.enum.PÅBEGYNT:
            return { variant: "outline", "data-color": "meta-purple" };
        case spørreundersøkelseStatusEnum.enum.OPPRETTET:
            return { variant: "moderate", "data-color": "neutral" };
        case spørreundersøkelseStatusEnum.enum.AVSLUTTET:
            return { variant: "moderate", "data-color": "success" };
        case spørreundersøkelseStatusEnum.enum.SLETTET:
            return { variant: "outline", "data-color": "danger" };
    }
    return {};
}

export function penskrivSpørreundersøkelseStatus(
    status: SpørreundersøkelseStatus,
): string {
    switch (status) {
        case spørreundersøkelseStatusEnum.enum.OPPRETTET:
            return "Opprettet";
        case spørreundersøkelseStatusEnum.enum.PÅBEGYNT:
            return "Påbegynt";
        case spørreundersøkelseStatusEnum.enum.AVSLUTTET:
            return "Fullført";
        case spørreundersøkelseStatusEnum.enum.SLETTET:
            return "Slettet";
    }
}

type Props = Omit<
    GenericProps<SpørreundersøkelseStatus>,
    "penskrivStatus" | "hentVariant"
>;

export const SpørreundersøkelseStatusBadge = (props: Props) => (
    <GenericStatusBadge
        {...props}
        penskrivStatus={penskrivSpørreundersøkelseStatus}
        hentTagProps={hentTagPropsForSpørreundersøkelseStatus}
    />
);
