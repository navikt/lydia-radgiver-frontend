import { CSSProperties } from "react";
import { Label } from "@navikt/ds-react";
import { reactSelectStyle, StyledReactSelect } from "../../../components/ReactSelect/StyledReactSelect";
import { sorterAlfabetisk } from "../../../util/sortering";
import { Fylke, FylkeMedKommuner } from "../../../domenetyper/fylkeOgKommune";

const fylkeDropdownId = "fylkedropdown";

interface Props {
    fylkerOgKommuner: FylkeMedKommuner[];
    valgteFylker?: Fylke[];
    endreFylker: (fylker: Fylke[]) => void;
    style?: CSSProperties;
}

export const FylkeMultidropdown = ({ fylkerOgKommuner, valgteFylker, endreFylker, style}: Props) => {
    const sorterteFylker =
        fylkerOgKommuner
            .sort((a, b) =>
                sorterAlfabetisk(a.fylke.navn, b.fylke.navn))
            .map((fylkeMedKommuner) => (fylkeMedKommuner.fylke))

    return (
        <div style={style}>
            <Label id={fylkeDropdownId}>Fylker</Label>
            <StyledReactSelect
                aria-labelledby={fylkeDropdownId}
                defaultValue={valgteFylker}
                value={valgteFylker}
                noOptionsMessage={() => "Ingen kommuner å velge"}
                options={sorterteFylker}
                getOptionLabel={(v) => (v as Fylke).navn}
                getOptionValue={(v) => (v as Fylke).nummer}
                isMulti
                styles={reactSelectStyle()}
                placeholder=""
                onChange={(verdier) => {
                    console.log("Verdier!", verdier)
                    endreFylker(verdier as Fylke[]);
                }}
            />
        </div>
    );
};
