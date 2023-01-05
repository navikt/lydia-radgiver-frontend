import styled from "styled-components";
import {TextField} from "@navikt/ds-react";

export const TallInput = styled(TextField)`
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
