import styled from "styled-components";
import ReactSelect, { CSSObjectWithLabel, StylesConfig } from "react-select";
import { NavFarger } from "../../styling/farger";
import { BorderRadius } from "../../styling/borderRadius";

export const StyledReactSelect = styled(ReactSelect)`
    margin-top: var(--a-spacing-2);
`;

export const reactSelectStyle = (): StylesConfig => ({
    control: (provided, state) =>
        ({
            ...provided,
            border: `1px solid ${NavFarger.border}`,
            borderRadius: `${BorderRadius.medium}`,
            boxShadow: state.isFocused ? `0 0 0 3px ${NavFarger.focus};` : "",
            ":hover": {
                border: `1px solid ${NavFarger.interactionPrimary}`,
            },
        }) as CSSObjectWithLabel,
    placeholder: (provided) =>
        ({
            ...provided,
            color: "-internal-light-dark(black, white);",
        }) as CSSObjectWithLabel,
    dropdownIndicator: (provided) =>
        ({
            ...provided,
            color: "initial",
            ":hover": {
                color: "initial",
            },
        }) as CSSObjectWithLabel,
    valueContainer: (provided) =>
        ({
            ...provided,
            padding: "0.5rem",
        }) as CSSObjectWithLabel,
});
