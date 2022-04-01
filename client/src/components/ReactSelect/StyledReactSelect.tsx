import styled from "styled-components";
import ReactSelect, {StylesConfig} from "react-select";

export const StyledReactSelect = styled(ReactSelect)`
    margin-top: var(--navds-spacing-2);
`;

export const reactSelectStyle = (): StylesConfig => ({
    control: (provided, state) => ({
        ...provided,
        border: "2px solid var(--navds-text-field-color-border)",
        borderRadius: "4px",
        boxShadow: state.isFocused
            ? `0 0 0 3px var(--navds-semantic-color-focus);`
            : "",
        ":hover": {
            border: `2px solid var(--navds-semantic-color-link)`,
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