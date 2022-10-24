import {CSSProperties, useState} from "react";
import {Label} from "@navikt/ds-react";
import {reactSelectStyle, StyledReactSelect} from "../../components/ReactSelect/StyledReactSelect";
import {sorterAlfabetisk} from "../../util/sortering";

const eierDropdownId = "EierDropdown"

export type Eier = {
    navn: string
    id: string
}

const ALLE: Eier = {
    navn: "Alle",
    id: "alle"
}
const MINE: Eier = {
    navn: "Mine",
    id: "mine"
}

interface Props {
    eierBytte: (eier: Eier) => void
    style?: CSSProperties
    søkbareEiere?: Eier[]
}

export const EierDropdown = ({eierBytte, style, søkbareEiere}: Props) => {
    const [valgtEier, setValgtEier] = useState<Eier>(ALLE);

    const options = [ALLE, MINE].concat(
        søkbareEiere?.sort((a, b) => sorterAlfabetisk(a.navn, b.navn)) ?? [])
    
    return (
        <div style={style}>
            <Label id={eierDropdownId}>Eier</Label>
            <StyledReactSelect
                aria-labelledby={eierDropdownId}
                defaultValue={ALLE.id}
                value={valgtEier}
                noOptionsMessage={() => "Ingen eiere å velge"}
                options={options}
                getOptionLabel={(eier) => (eier as Eier).navn}
                getOptionValue={(eier) => (eier as Eier).id}
                isMulti={false}
                styles={reactSelectStyle()}
                placeholder=""
                onChange={(eier) => {
                    eierBytte(eier as Eier)
                    setValgtEier(eier as Eier)
                }}
            />
        </div>
    )
}
