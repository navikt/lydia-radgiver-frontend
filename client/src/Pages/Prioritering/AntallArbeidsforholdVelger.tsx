import { useState } from "react";
import { Label } from "@navikt/ds-react";
import { Range } from "./SykefraværsprosentVelger";
import { StyledNumericTextField } from "./StyledNumericTextField";
import { RangeFieldset } from "./RangeFieldset";

interface InputProps {
    value: number;
    label: string;
    hideLabel?: boolean;
    endreAntallArbeidsforhold: (verdi: number) => void;
}

function AntallArbeidsforholdInput({value, label, hideLabel = false, endreAntallArbeidsforhold}: InputProps) {
    const [antallArbeidsforhold, setAntallArbeidsforhold] = useState(isNaN(value) ? "" : value.toString())

    return (
        <StyledNumericTextField
            type={"number"}
            min={"0"}
            value={antallArbeidsforhold}
            label={label}
            hideLabel={hideLabel}
            onChange={(e) => {
                // -- validering - må være et positivt heltall
                if (isNaN(e.target.valueAsNumber)) {
                    setAntallArbeidsforhold("")
                    endreAntallArbeidsforhold(NaN)
                } else {
                    const endretAntallArbeidsforhold = Math.floor(Math.abs(e.target.valueAsNumber))
                    setAntallArbeidsforhold(String(endretAntallArbeidsforhold))
                    endreAntallArbeidsforhold(endretAntallArbeidsforhold)
                }

            }}
        />
    );
}

interface ArbeidsforholdVelgerProps {
    antallArbeidsforhold: Range;
    endreAntallArbeidsforhold: (verdi: Range) => void;
}

export const AntallArbeidsforholdVelger = ({
    antallArbeidsforhold,
    endreAntallArbeidsforhold
}: ArbeidsforholdVelgerProps) => (
    <RangeFieldset legend={"Antall arbeidsforhold"}>
        <AntallArbeidsforholdInput
            label={"Fra"}
            value={antallArbeidsforhold.fra}
            endreAntallArbeidsforhold={(arbeidsforholdFra: number) => {
                endreAntallArbeidsforhold({
                    fra: arbeidsforholdFra,
                    til: antallArbeidsforhold.til
                })
            }}
        />
        <Label>-</Label>
        <AntallArbeidsforholdInput
            label={"Til"}
            hideLabel
            value={antallArbeidsforhold.til}
            endreAntallArbeidsforhold={(arbeidsforholdTil: number) => {
                endreAntallArbeidsforhold({
                    fra: antallArbeidsforhold.fra,
                    til: arbeidsforholdTil
                })
            }}
        />
    </RangeFieldset>
);
