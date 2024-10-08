import styled from "styled-components";
import { Table } from "@navikt/ds-react";
import { NavFarger } from "../styling/farger";
import { Skygger } from "../styling/skygger";
import { BorderRadius } from "../styling/borderRadius";

export const StyledTable = styled(Table).attrs({
    zebraStripes: true,
    size: "small",
})`
    background-color: ${NavFarger.white};
    box-shadow: ${Skygger.small};
    border-radius: ${BorderRadius.medium};
`;
