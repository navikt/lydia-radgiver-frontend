import { Label } from "@navikt/ds-react";
import { Næringsgruppe } from "../../domenetyper";
import { StyledReactSelect, reactSelectStyle } from "../../components/ReactSelect/StyledReactSelect";

interface ReactSelectOptions {
    label: string,
    value: string
}

function mapnæringsGruppeTilReactSelectOptions(gruppe: Næringsgruppe): ReactSelectOptions {
    return {
        label: `${gruppe.kode} - ${gruppe.navn}`,
        value: gruppe.kode,
    };
}

const penskriv = (s: string) => `${s.charAt(0).toUpperCase()}${s.slice(1).toLowerCase()}`

interface Props {
    næringsgrupper: Næringsgruppe[];
    bransjeprogram: string[]
    valgtNæringsgruppe: Næringsgruppe[];
    endreNæringsgrupper: (value: string[]) => void;
}

export const Næringsgruppedropdown = ({
    næringsgrupper,
    valgtNæringsgruppe,
    endreNæringsgrupper,
    bransjeprogram
}: Props) => {
    const næringsgruppeOptions = næringsgrupper
        .sort((a, b) => +a.kode - +b.kode)
        .map(mapnæringsGruppeTilReactSelectOptions);
    const næringOgbransjeprogramOptions = [{
        label: "Bransjeprogram",
        options: bransjeprogram?.map(bp => ({label: penskriv(bp), value: bp}))
    }, {label: "Næringsgrupper", options: næringsgruppeOptions}]
    const ariaLabelId = "næringsgruppe-aria-label";

    return (
        <>
            <Label id={ariaLabelId}>Bransjer og næringsgrupper</Label>
            <StyledReactSelect
                aria-labelledby={ariaLabelId}
                noOptionsMessage={() => "Ingen næringsgrupper"}
                options={næringOgbransjeprogramOptions}
                defaultValue={valgtNæringsgruppe.map(
                    mapnæringsGruppeTilReactSelectOptions
                )}
                placeholder={""}
                isMulti
                styles={reactSelectStyle()}
                onChange={(verdier) => {
                    endreNæringsgrupper(
                        (verdier as ReactSelectOptions[]).map(({value: næringsgruppe}) => næringsgruppe)
                    );
                }}
            />
        </>
    );
};
