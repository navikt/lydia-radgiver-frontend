import styled from "styled-components";
import ReactSelect, { StylesConfig } from "react-select";
import { NavFarger } from "../../styling/farger";
import { BorderRadius } from "../../styling/borderRadius";

export const StyledReactSelect = styled(ReactSelect)`
  margin-top: var(--navds-spacing-2);
`;

export const reactSelectStyle = (): StylesConfig => ({
    control: (provided, state) => ({
        ...provided,
        border: `1px solid ${NavFarger.border}`,
        borderRadius: `${BorderRadius.medium}`,
        boxShadow: state.isFocused
            ? `0 0 0 3px ${NavFarger.focus};`
            : "",
        ":hover": {
            border: `1px solid ${NavFarger.interactionPrimary}`,
        },
    }),
    placeholder: (provided) => ({
        ...provided,
        color: "-internal-light-dark(black, white);",
    }),
    dropdownIndicator: (provided) => ({
        ...provided,
        color: "initial",
        ":hover": {
            color: "initial",
        },
    }),
    valueContainer: (provided) => ({
        ...provided,
        padding: "0.5rem",
    }),
});
