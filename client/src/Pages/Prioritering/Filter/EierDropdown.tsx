import { Label } from "@navikt/ds-react";
import {
    reactSelectStyle,
    StyledReactSelect,
} from "../../../components/ReactSelect/StyledReactSelect";
import { sorterAlfabetisk } from "../../../util/sortering";
import { Eier } from "../../../domenetyper/domenetyper";

interface Props {
    onEierBytteCallback: (eiere: Eier[]) => void;
    filtrerbareEiere: Eier[];
    eiere: Eier[];
}

export const EierDropdown = ({
    onEierBytteCallback,
    filtrerbareEiere,
    eiere,
}: Props) => {
    const options = filtrerbareEiere.sort((a, b) =>
        sorterAlfabetisk(a.navn, b.navn),
    );

    const eierDropdownId = "EierDropdown";

    return (
        <div style={{ minWidth: "15rem" }}>
            <Label id={eierDropdownId}>Eier</Label>
            <StyledReactSelect
                aria-labelledby={eierDropdownId}
                defaultValue={eiere}
                value={eiere}
                noOptionsMessage={() => "Ingen eiere å velge"}
                options={options}
                getOptionLabel={(eier) => (eier as Eier).navn}
                getOptionValue={(eier) => (eier as Eier).navIdent}
                isMulti={true}
                isClearable={true}
                styles={reactSelectStyle()}
                placeholder=""
                onChange={(eiere) => onEierBytteCallback(eiere as Eier[])}
            />
        </div>
    );
};
