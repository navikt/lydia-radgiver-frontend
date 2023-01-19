import { VirksomhetStatusBrreg, VirksomhetStatusBrregEnum } from "../../../domenetyper";
import styled from "styled-components";
import { Tag } from "@navikt/ds-react";

const BrregStatusTag = styled(Tag)`
  align-self: center;
`;

interface Props {
    status: VirksomhetStatusBrreg;
}

export const BrregStatus = ({ status }: Props) => {
    if (status === VirksomhetStatusBrregEnum.enum.AKTIV) {
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
