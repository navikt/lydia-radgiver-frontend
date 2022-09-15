import {HorizontalFlexboxDivGap1Rem} from "./HorizontalFlexboxDiv";
import {useState} from "react";
import {Range} from "./SykefraværsprosentVelger";
import {StyledNumericTextField} from "./StyledNumericTextField";
import {Label} from "@navikt/ds-react";
import {VerticalFlexboxDiv} from "./VerticalFlexboxDiv";

function AntallArbeidsforholdInput({label, value, endreAntallArbeidsforhold}: {label: string, value: number, endreAntallArbeidsforhold: (verdi: number) => void}) {
    const [antallArbeidsforhold, setAntallArbeidsforhold] = useState<string>(isNaN(value) ? "" : value.toString())
    return (
        <StyledNumericTextField
            label={label}
            type={"number"}
            min={"0"}
            value={antallArbeidsforhold}
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

export const AntallArbeidsforholdVelger = ({antallArbeidsforhold, endreAntallArbeidsforhold}: {antallArbeidsforhold: Range, endreAntallArbeidsforhold: (verdi: Range) => void}) => {
    return (
        <>
            <VerticalFlexboxDiv className="navds-form-field">
                <Label>Antall arbeidsforhold</Label>
                <HorizontalFlexboxDivGap1Rem>
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
                    <AntallArbeidsforholdInput
                        label={"-"}
                        value={antallArbeidsforhold.til}
                        endreAntallArbeidsforhold={(arbeidsforholdTil: number) => {
                            endreAntallArbeidsforhold({
                                fra: antallArbeidsforhold.fra,
                                til: arbeidsforholdTil
                            })
                        }}
                    />
                </HorizontalFlexboxDivGap1Rem>
            </VerticalFlexboxDiv>
        </>
    );
};
