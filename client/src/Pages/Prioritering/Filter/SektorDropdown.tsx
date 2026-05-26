import { Label } from "@navikt/ds-react";
import { Sektor } from "../../../domenetyper/virksomhet";
import {
    reactSelectStyle,
    StyledReactSelect,
} from "../../../components/ReactSelect/StyledReactSelect";

interface Props {
    valgteSektorer?: Sektor[];
    endreSektorer: (sektor: Sektor[]) => void;
    alleSektorer: Sektor[];
}

export const SektorDropdown = ({
    valgteSektorer,
    endreSektorer,
    alleSektorer,
}: Props) => {
    return (
        <div style={{ flex: "1" }}>
            <Label id="sektorDropdown">Sektor</Label>
            <StyledReactSelect
                aria-labelledby="sektorDropdown"
                defaultValue={valgteSektorer}
                value={valgteSektorer}
                noOptionsMessage={() => "Ingen sektorer å velge"}
                options={alleSektorer}
                getOptionLabel={(v) => (v as Sektor).beskrivelse}
                getOptionValue={(v) => (v as Sektor).kode}
                isMulti
                styles={reactSelectStyle()}
                placeholder=""
                onChange={(verdier) => {
                    endreSektorer(verdier as Sektor[]);
                }}
            />
        </div>
    );
};
