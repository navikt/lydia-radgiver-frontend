import {Label} from "@navikt/ds-react";
import {Kommune} from "../../domenetyper";
import {GroupedKommune} from "./Filtervisning";
import {StyledReactSelect, reactSelectStyle} from "../../components/ReactSelect/StyledReactSelect";
import {CSSProperties} from "react";
import {sorterAlfabetisk} from "../../util/sortering";

const kommuneDropdownId = "kommunedropdown"

interface Props {
    kommuneGroup: GroupedKommune[]
    valgtKommuner?: Kommune[]
    endreKommuner: (kommuner: Kommune[]) => void
    style?: CSSProperties
}

export const Kommunedropdown = ({ kommuneGroup, endreKommuner, valgtKommuner = [], style }: Props) => {
    const sorterteKommuner = kommuneGroup.map(kg => ({
        label: kg.label,
        options: kg.options.sort((k1, k2) => sorterAlfabetisk(k1.navn, k2.navn))
    }))
    return (
        <div style={style}>
            <Label id={kommuneDropdownId}>Kommuner</Label>
            <StyledReactSelect
                aria-labelledby={kommuneDropdownId}
                defaultValue={valgtKommuner}
                value={valgtKommuner}
                noOptionsMessage={() => "Ingen kommuner å velge"}
                options={sorterteKommuner}
                getOptionLabel={(v) => (v as Kommune).navn}
                getOptionValue={(v) => (v as Kommune).nummer}
                isMulti
                styles={reactSelectStyle()}
                placeholder=""
                onChange={(verdier) => {
                    endreKommuner(verdier as Kommune[])
                }}
            />
        </div>
    );
}
