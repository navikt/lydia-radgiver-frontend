import { Modal } from "@navikt/ds-react";
import styled from "styled-components";
import { mobileAndUp } from "../../styling/breakpoints";

export const StyledModal = styled(Modal)`
    padding: 0rem;
    max-width: 42rem;
    --a-spacing-6: 0.5rem;

    ${mobileAndUp} {
        padding: 1.5rem;
        --a-spacing-6: var(
            --a-spacing-6
        ); // Vi prøver å hente ut originalverdien frå designsystemet
    }
`;
