import "@navikt/ds-css";
import styled from "styled-components";
import { Tag, TagProps } from "@navikt/ds-react";

export interface GenericProps<T> extends Omit<TagProps, "variant" | "children"> {
    status: T;
    penskrivStatus: (status: T) => string;
    hentVariant: (status: T) => TagProps["variant"];
}

export function GenericStatusBadge<T>({
    status,
    penskrivStatus,
    hentVariant,
    ...remainingProps
}: GenericProps<T>) {
    return (
        <StatusBadgeWrapper>
            <StyledStatusTag {...remainingProps} variant={hentVariant(status)}>
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
