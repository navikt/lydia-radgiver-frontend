import { Label } from "@navikt/ds-react";
import { Næringsgruppe } from "../../domenetyper";
import {StyledReactSelect, reactSelectStyle} from "../../components/ReactSelect/StyledReactSelect";

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
                placeholder={""}
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
