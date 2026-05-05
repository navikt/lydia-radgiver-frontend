import { Label } from "@navikt/ds-react";
import { CSSProperties } from "react";
import {
    reactSelectStyle,
    StyledReactSelect,
} from "@/components/ReactSelect/StyledReactSelect";
import { FylkeMedKommuner } from "@/domenetyper/fylkeOgKommune";
import { sorterAlfabetisk } from "@/util/sortering";

const fylkeDropdownId = "fylkedropdown";

interface Props {
    fylkerOgKommuner: FylkeMedKommuner[];
    valgteFylker?: FylkeMedKommuner[];
    endreFylker: (fylker: FylkeMedKommuner[]) => void;
    style?: CSSProperties;
}

export const FylkeMultidropdown = ({
    fylkerOgKommuner,
    valgteFylker,
    endreFylker,
    style,
}: Props) => {
    const sorterteFylker = fylkerOgKommuner.sort((a, b) =>
        sorterAlfabetisk(a.fylke.navn, b.fylke.navn),
    );

    return (
        <div style={style}>
            <Label id={fylkeDropdownId}>Fylker</Label>
            <StyledReactSelect
                aria-labelledby={fylkeDropdownId}
                defaultValue={valgteFylker}
                value={valgteFylker}
                noOptionsMessage={() => "Ingen kommuner å velge"}
                options={sorterteFylker}
                getOptionLabel={(v) => (v as FylkeMedKommuner).fylke.navn}
                getOptionValue={(v) => (v as FylkeMedKommuner).fylke.nummer}
                isMulti
                styles={reactSelectStyle()}
                placeholder=""
                onChange={(verdier) => {
                    endreFylker(verdier as FylkeMedKommuner[]);
                }}
            />
        </div>
    );
};
