import {CSSProperties} from "react";
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
    valgtEier?: Eier
    eierBytte: (eier: Eier) => void
    style?: CSSProperties
    eiere?: Eier[]
}

export const EierDropdown = ({eierBytte, style, eiere, valgtEier}: Props) => {
    const options = [ALLE, MINE].concat(
        eiere?.sort((a, b) => sorterAlfabetisk(a.navn, b.navn)) ?? [])
    
    return (
        <div style={style}>
            <Label id={eierDropdownId}>Eier</Label>
            <StyledReactSelect
                aria-labelledby={eierDropdownId}
                defaultValue={ALLE.id}
                value={valgtEier ?? ALLE}
                noOptionsMessage={() => "Ingen eiere å velge"}
                options={options}
                getOptionLabel={(v) => (v as Eier).navn}
                getOptionValue={(v) => (v as Eier).id}
                isMulti={false}
                styles={reactSelectStyle()}
                placeholder=""
                onChange={(verdi) => {
                    eierBytte(verdi as Eier)
                }}
            />
        </div>
    )
}