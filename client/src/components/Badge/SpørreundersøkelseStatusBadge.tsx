import "@navikt/ds-css";
import {
    spørreundersøkelseStatusEnum,
    SpørreundersøkelseStatus,
} from "../../domenetyper/domenetyper";
import { GenericProps, GenericStatusBadge } from "./StatusBadge";

export const hentVariantForSpørreundersøkelseStatus = (
    status: SpørreundersøkelseStatus,
) => {
    switch (status) {
        case spørreundersøkelseStatusEnum.enum.PÅBEGYNT:
            return "alt1-moderate";
        case spørreundersøkelseStatusEnum.enum.OPPRETTET:
            return "neutral-moderate";
        case spørreundersøkelseStatusEnum.enum.AVSLUTTET:
            return "success-moderate";
        case spørreundersøkelseStatusEnum.enum.SLETTET:
            return "error-moderate";
    }
};

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
        hentVariant={hentVariantForSpørreundersøkelseStatus}
    />
);
