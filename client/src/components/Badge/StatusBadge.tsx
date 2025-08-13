import "@navikt/ds-css";
import styled from "styled-components";
import { Tag, TagProps } from "@navikt/ds-react";

export interface GenericProps<T> extends Omit<TagProps, "variant" | "children"> {
    status: T;
    penskrivStatus: (status: T) => string;
    hentVariant: (status: T) => TagProps["variant"];
    slim?: boolean;
}

export function GenericStatusBadge<T>({
    status,
    penskrivStatus,
    hentVariant,
    slim = false,
    ...remainingProps
}: GenericProps<T>) {
    return (
        <StatusBadgeWrapper>
            <StyledStatusTag {...remainingProps} variant={hentVariant(status)} $slim={slim}>
                {penskrivStatus(status)}
            </StyledStatusTag>
        </StatusBadgeWrapper>
    );
}

export const StyledStatusTag = styled(Tag).attrs({ size: "small" }) <{ $slim?: boolean }>`
    min-width: ${({ $slim }) => ($slim ? "fit-content" : "6em")};
    margin: ${({ $slim }) => ($slim ? "0.25em 0.5em" : 0)};
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
