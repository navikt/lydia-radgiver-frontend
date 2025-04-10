import { Range } from "./SykefraværsprosentVelger";
import { TallInput } from "./TallInput";
import { FraTilFieldset } from "./FraTilFieldset";

interface InputProps {
    value: number;
    label: string;
    hideLabel?: boolean;
    endreAntallArbeidsforhold: (verdi: number) => void;
}

function AntallArbeidsforholdInput({
    value,
    label,
    hideLabel = false,
    endreAntallArbeidsforhold,
}: InputProps) {
    return (
        <TallInput
            type={"number"}
            min={"0"}
            value={value || undefined}
            label={label}
            hideLabel={hideLabel}
            onChange={(e) => {
                endreAntallArbeidsforhold(e.target.valueAsNumber);
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
    endreAntallArbeidsforhold,
}: ArbeidsforholdVelgerProps) => {
    return (
        <FraTilFieldset legend={"Antall arbeidsforhold"}>
            <AntallArbeidsforholdInput
                label={"Fra"}
                value={antallArbeidsforhold.fra}
                endreAntallArbeidsforhold={(arbeidsforholdFra: number) => {
                    endreAntallArbeidsforhold({
                        fra: arbeidsforholdFra,
                        til: antallArbeidsforhold.til,
                    });
                }}
            />
            <p className="navds-label">-</p>
            <AntallArbeidsforholdInput
                label={"Til"}
                hideLabel
                value={antallArbeidsforhold.til}
                endreAntallArbeidsforhold={(arbeidsforholdTil: number) => {
                    endreAntallArbeidsforhold({
                        fra: antallArbeidsforhold.fra,
                        til: arbeidsforholdTil,
                    });
                }}
            />
        </FraTilFieldset>
    );
};
