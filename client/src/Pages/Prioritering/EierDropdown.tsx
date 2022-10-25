import {useState} from "react";
import {Label} from "@navikt/ds-react";
import {reactSelectStyle, StyledReactSelect} from "../../components/ReactSelect/StyledReactSelect";
import {sorterAlfabetisk} from "../../util/sortering";
import { Eier } from "../../domenetyper";

const eierDropdownId = "EierDropdown"

interface Props {
    onEierBytteCallback: (eiere: Eier[]) => void
    filtrerbareEiere: Eier[]
}

export const EierDropdown = ({onEierBytteCallback, filtrerbareEiere}: Props) => {
    const [valgteEiere, setValgteEiere] = useState<Eier[]>([]);
    const options = filtrerbareEiere.sort((a, b) => sorterAlfabetisk(a.navn, b.navn))

    const håndterEierBytte = (nyEier: Eier | null) => {
        const nyeEiere = nyEier !== null ? [nyEier] : []
        onEierBytteCallback(nyeEiere)
        setValgteEiere(nyeEiere)
    }

    return (
        <div style={{minWidth: "15rem"}}>
            <Label id={eierDropdownId}>Eier</Label>
            <StyledReactSelect
                aria-labelledby={eierDropdownId}
                defaultValue={valgteEiere}
                value={valgteEiere}
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
    )
}
