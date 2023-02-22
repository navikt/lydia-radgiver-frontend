import { CSSProperties } from "react";
import { Label } from "@navikt/ds-react";
import { reactSelectStyle, StyledReactSelect } from "../../../components/ReactSelect/StyledReactSelect";
import { sorterAlfabetisk } from "../../../util/sortering";
import { FylkeMedKommuner, Kommune } from "../../../domenetyper/fylkeOgKommune";

const kommuneDropdownId = "kommunedropdown";

interface Props {
    relevanteFylkerMedKommuner: FylkeMedKommuner[];
    valgteKommuner?: Kommune[];
    endreKommuner: (kommuner: Kommune[]) => void;
    style?: CSSProperties;
}

export const Kommunedropdown = ({ relevanteFylkerMedKommuner, endreKommuner, valgteKommuner = [], style, }: Props) => {
    const sorterteKommuner = relevanteFylkerMedKommuner.map(
        (fylkeMedKommuner) => ({
            label: fylkeMedKommuner.fylke.navn,
            options: fylkeMedKommuner.kommuner.sort((k1, k2) =>
                sorterAlfabetisk(k1.navn, k2.navn)
            ),
        })
    );

    return (
        <div style={style}>
            <Label id={kommuneDropdownId}>Kommuner</Label>
            <StyledReactSelect
                aria-labelledby={kommuneDropdownId}
                defaultValue={valgteKommuner}
                value={valgteKommuner}
                noOptionsMessage={() => "Ingen kommuner å velge"}
                options={sorterteKommuner}
                getOptionLabel={(v) => (v as Kommune).navn}
                getOptionValue={(v) => (v as Kommune).nummer}
                isMulti
                styles={reactSelectStyle()}
                placeholder=""
                onChange={(verdier) => {
                    endreKommuner(verdier as Kommune[]);
                }}
            />
        </div>
    );
};
