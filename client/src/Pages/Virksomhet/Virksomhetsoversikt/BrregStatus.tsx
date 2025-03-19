import styled from "styled-components";
import { Tag } from "@navikt/ds-react";
import {
    VirksomhetStatusBrreg,
    VirksomhetStatusBrregEnum,
} from "../../../domenetyper/virksomhet";
import capitalizeFirstLetterLowercaseRest from "../../../util/formatering/capitalizeFirstLetterLowercaseRest";

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

    return (
        <BrregStatusTag variant="neutral">
            {`${capitalizeFirstLetterLowercaseRest(status)} hos Brønnøysundregistrene`}
        </BrregStatusTag>
    );
};
