import { Label } from "@navikt/ds-react";
import { Næringsgruppe } from "../../../domenetyper/domenetyper";
import {
    StyledReactSelect,
    reactSelectStyle,
} from "../../../components/ReactSelect/StyledReactSelect";

interface ReactSelectOptions {
    label: string;
    value: string;
}

const mapbransjeprogramTilReactSelect = (bransjeprogram: string) => ({
    label: penskriv(bransjeprogram),
    value: bransjeprogram.toUpperCase(),
});

function mapnæringsGruppeTilReactSelectOptions(
    gruppe: Næringsgruppe
): ReactSelectOptions {
    return {
        label: `${gruppe.kode} - ${gruppe.navn}`,
        value: gruppe.kode,
    };
}

const penskriv = (s: string) =>
    `${s.charAt(0).toUpperCase()}${s.slice(1).toLowerCase()}`;

interface Props {
    næringsgrupper: Næringsgruppe[];
    bransjeprogram: string[];
    valgtNæringsgruppe: Næringsgruppe[];
    valgtBransjeprogram: string[];
    endreNæringsgrupper: (value: string[]) => void;
}

export const Næringsgruppedropdown = ({
    næringsgrupper,
    valgtNæringsgruppe,
    endreNæringsgrupper,
    valgtBransjeprogram,
    bransjeprogram,
}: Props) => {
    const næringsgruppeOptions = næringsgrupper
        .sort((a, b) => +a.kode - +b.kode)
        .map(mapnæringsGruppeTilReactSelectOptions);
    const næringOgbransjeprogramOptions = [
        {
            label: "Bransjeprogram",
            options: bransjeprogram?.map(mapbransjeprogramTilReactSelect),
        },
        { label: "Næringsgrupper", options: næringsgruppeOptions },
    ];
    const valgteVerdier = [
        ...valgtNæringsgruppe.map(mapnæringsGruppeTilReactSelectOptions),
        ...valgtBransjeprogram.map(mapbransjeprogramTilReactSelect),
    ];
    const ariaLabelId = "næringsgruppe-aria-label";

    return (
        <div style={{flex: "1"}}>
            <Label id={ariaLabelId}>Bransjer og næringsgrupper</Label>
            <StyledReactSelect
                aria-labelledby={ariaLabelId}
                noOptionsMessage={() => "Ingen næringsgrupper"}
                options={næringOgbransjeprogramOptions}
                value={valgteVerdier}
                placeholder={""}
                isMulti
                styles={reactSelectStyle()}
                onChange={(verdier) => {
                    endreNæringsgrupper(
                        (verdier as ReactSelectOptions[]).map(
                            ({ value: næringsgruppe }) => næringsgruppe
                        )
                    );
                }}
            />
        </div>
    );
};
