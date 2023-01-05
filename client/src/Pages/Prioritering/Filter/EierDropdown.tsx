import { Label } from "@navikt/ds-react";
import {
    reactSelectStyle,
    StyledReactSelect,
} from "../../../components/ReactSelect/StyledReactSelect";
import { sorterAlfabetisk } from "../../../util/sortering";
import { Eier } from "../../../domenetyper";

const eierDropdownId = "EierDropdown";

interface Props {
    onEierBytteCallback: (eiere: Eier[]) => void;
    filtrerbareEiere: Eier[];
    eier?: Eier[];
}

export const EierDropdown = ({
    onEierBytteCallback,
    filtrerbareEiere,
    eier,
}: Props) => {
    const options = filtrerbareEiere.sort((a, b) =>
        sorterAlfabetisk(a.navn, b.navn)
    );

    const håndterEierBytte = (nyEier: Eier | null) => {
        const nyeEiere = nyEier !== null ? [nyEier] : [];
        onEierBytteCallback(nyeEiere);
    };

    return (
        <div style={{ minWidth: "15rem" }}>
            <Label id={eierDropdownId}>Eier</Label>
            <StyledReactSelect
                aria-labelledby={eierDropdownId}
                defaultValue={eier}
                value={eier}
                noOptionsMessage={() => "Ingen eiere å velge"}
                options={options}
                getOptionLabel={(eier) => (eier as Eier).navn}
                getOptionValue={(eier) => (eier as Eier).navIdent}
                isMulti={false}
                isClearable={true}
                styles={reactSelectStyle()}
                placeholder=""
                onChange={(eier) => håndterEierBytte(eier as Eier | null)}
            />
        </div>
    );
};
