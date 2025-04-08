import "@navikt/ds-css";
import styled from "styled-components";
import { Tag, TagProps } from "@navikt/ds-react";

export interface GenericProps<T> {
    status: T;
    ariaLive?: "off" | "polite" | "assertive";
    ariaLabel?: string;
    penskrivStatus: (status: T) => string;
    hentVariant: (status: T) => TagProps["variant"];
}

export function GenericStatusBadge<T>({
    status,
    ariaLive,
    ariaLabel,
    penskrivStatus,
    hentVariant,
}: GenericProps<T>) {
    return (
        <StatusBadgeWrapper>
            <StyledStatusTag variant={hentVariant(status)} aria-live={ariaLive} aria-label={ariaLabel}>
                {penskrivStatus(status)}
            </StyledStatusTag>
        </StatusBadgeWrapper>
    );
}

export const StyledStatusTag = styled(Tag).attrs({ size: "small" })`
    min-width: 6em;
    width: fit-content;
    height: fit-content;
`;

const StatusBadgeWrapper = styled.div`
    &:focus,
    &:hover,
    &:visited,
    &:link,
    &:active {
        text-decoration: none;
    }
`;
