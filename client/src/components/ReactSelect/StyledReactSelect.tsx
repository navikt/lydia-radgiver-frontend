import styles from './reactSelect.module.scss';
import ReactSelect, { CSSObjectWithLabel, StylesConfig } from "react-select";

export function StyledReactSelect(props: React.ComponentProps<typeof ReactSelect>) {
    return <ReactSelect className={`${styles.styledSelect}`} {...props} />;
}


export const reactSelectStyle = (): StylesConfig => ({
    control: (provided, state) =>
        ({
            ...provided,
            border: `1px solid var(--a-gray-600)`,
            borderRadius: `var(--a-border-radius-medium)`,
            boxShadow: state.isFocused ? `0 0 0 3px var(--a-blue-800);` : "",
            ":hover": {
                border: `1px solid var(--a-blue-500)`,
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
