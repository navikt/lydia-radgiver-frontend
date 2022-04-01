import {Label} from "@navikt/ds-react";
import {Kommune} from "../../domenetyper";
import {sorterAlfabetisk} from "./Filtervisning";
import {StyledReactSelect, reactSelectStyle} from "../../components/ReactSelect/StyledReactSelect";

const kommuneDropdownId = "kommunedropdown"

interface Props {
    kommuner: Kommune[]
    valgtKommuner?: Kommune[]
    endreKommuner: (kommuner: Kommune[]) => void
}

export const Kommunedropdown = ({ kommuner, endreKommuner, valgtKommuner = [] }: Props) => (
    <>
        <Label id={kommuneDropdownId}>Kommuner</Label>
        <StyledReactSelect
            aria-labelledby={kommuneDropdownId}
            defaultValue={valgtKommuner}
            value={valgtKommuner}
            noOptionsMessage={() => "Ingen kommuner å velge"}
            options={kommuner.sort((a,b) => sorterAlfabetisk(a.navn, b.navn))}
            getOptionLabel={(v) => (v as Kommune).navn }
            getOptionValue={(v) => (v as Kommune).nummer }
            isMulti
            styles={reactSelectStyle()}
            placeholder="Velg kommune"
            onChange={(verdier) => {
                endreKommuner(verdier as Kommune[])
            }}
        />
    </>
)