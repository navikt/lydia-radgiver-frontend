import { Label } from "@navikt/ds-react";
import ReactSelect, { StylesConfig } from "react-select";
import styled from "styled-components";
import { Næringsgruppe } from "../../domenetyper";

interface ReactSelectOptions {
    label: string,
    value: string
}

function mapnæringsGruppeTilReactSelectOptions(gruppe: Næringsgruppe): ReactSelectOptions {
    return {
        label: gruppe.navn,
        value: gruppe.kode,
    };
}

const reactSelectStyle = (): StylesConfig => ({
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

const StyledReactSelect = styled(ReactSelect)`
    margin-top: var(--navds-spacing-2);
`;

export const Næringsgruppedropdown = ({
    næringsgrupper,
    valgtNæringsgruppe,
    endreNæringsgrupper,
}: {
    næringsgrupper: Næringsgruppe[];
    valgtNæringsgruppe: Næringsgruppe[];
    endreNæringsgrupper: (value: string[]) => void;
}) => {
    const options = næringsgrupper.map(mapnæringsGruppeTilReactSelectOptions);
    const ariaLabelId = "næringsgruppe-aria-label";
    return (
        <>
            <Label id={ariaLabelId}>Næringsgruppe</Label>
            <StyledReactSelect
                aria-labelledby={ariaLabelId}
                noOptionsMessage={() => "Ingen næringsgrupper"}
                options={options}
                defaultValue={valgtNæringsgruppe.map(
                    mapnæringsGruppeTilReactSelectOptions
                )}
                placeholder={"Velg næringsgruppe"}
                isMulti
                styles={reactSelectStyle()}
                onChange={(verdier) => {
                    endreNæringsgrupper(
                        (verdier as ReactSelectOptions[]).map(({ value: næringsgruppe }) => næringsgruppe)
                    );
                }}
            />
        </>
    );
};
