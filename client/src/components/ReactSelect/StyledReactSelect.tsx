import styles from "./reactSelect.module.scss";
import ReactSelect, { CSSObjectWithLabel, StylesConfig } from "react-select";

export function StyledReactSelect(
    props: React.ComponentProps<typeof ReactSelect>,
) {
    return <ReactSelect className={`${styles.styledSelect}`} {...props} />;
}

export const reactSelectStyle = (): StylesConfig => ({
    control: (provided, state) =>
        ({
            ...provided,
            border: `1px solid var(--ax-neutral-700)`,
            borderRadius: `var(--ax-radius-8)`,
            boxShadow: state.isFocused ? `0 0 0 3px var(--ax-accent-900);` : "",

            ":hover": {
                border: `1px solid var(--ax-accent-600)`,
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
