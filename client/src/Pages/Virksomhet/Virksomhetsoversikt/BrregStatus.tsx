import { VirksomhetStatus, VirksomhetStatusEnum } from "../../../domenetyper";
import styled from "styled-components";
import { Tag } from "@navikt/ds-react";

const BrregStatusTag = styled(Tag)`
  align-self: center;
`;

interface Props {
    status: VirksomhetStatus;
}

export const BrregStatus = ({ status }: Props) => {
    /* Trenger ingen tag om virksomheten er aktiv hos Brønnøysundregistrene */
    if (status === VirksomhetStatusEnum.enum.AKTIV) {
        return null;
    }

    const capitalizeFirstLetterOnly = (string: string) => {
        return string.charAt(0).toUpperCase() + string.slice(1).toLowerCase();
    }

    return (
        <BrregStatusTag variant="neutral">
            {`${capitalizeFirstLetterOnly(status)} hos Brønnøysundregistrene`}
        </BrregStatusTag>
    );
}