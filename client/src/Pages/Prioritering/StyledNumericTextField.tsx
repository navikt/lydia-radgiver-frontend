import styled from "styled-components";
import {TextField} from "@navikt/ds-react";

export const StyledNumericTextField = styled(TextField)`
    display: flex;
    flex-direction: row;
    align-items: center;
    
    label {
        margin-right: 1rem;
    }
    input {
        width: 5rem;
    }
`
