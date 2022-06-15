import {HorizontalFlexboxDivGap1Rem, HorizontalFlexboxDivGap3RemAlignItemsEnd} from "./HorizontalFlexboxDiv";
import {useState} from "react";
import {Range} from "./SykefraværsprosentVelger";
import {StyledNumericTextField} from "./StyledNumericTextField";
import {Label} from "@navikt/ds-react";
import {VerticalFlexboxDiv} from "./VerticalFlexboxDiv";

function AntallAnsatteInput({label, value, endreAntallAnsatte}: {label: string, value: number, endreAntallAnsatte: (verdi: number) => void}) {
    const [ansatte, setAnsatte] = useState<string>(isNaN(value) ? "" : value.toString())
    return (
        <StyledNumericTextField
            label={label}
            type={"number"}
            min={"0"}
            value={ansatte}
            onChange={(e) => {
                // -- validering - må være et positivt heltall
                if (isNaN(e.target.valueAsNumber)) {
                    setAnsatte("")
                    endreAntallAnsatte(NaN)
                } else {
                    const nyAnsatte = Math.floor(Math.abs(e.target.valueAsNumber))
                    setAnsatte(String(nyAnsatte))
                    endreAntallAnsatte(nyAnsatte)
                }

            }}
        />
    );
}

export const AntallAnsatteVelger = ({antallAnsatte, endreAntallAnsatte}: {antallAnsatte: Range, endreAntallAnsatte: (verdi: Range) => void}) => {
    return (
        <>
            <VerticalFlexboxDiv>
                <Label>Antall ansatte</Label>
                <HorizontalFlexboxDivGap1Rem>
                    <AntallAnsatteInput
                        label={"Fra"}
                        value={antallAnsatte.fra}
                        endreAntallAnsatte={(ansatteFra: number) => {
                            endreAntallAnsatte({
                                fra: ansatteFra,
                                til: antallAnsatte.til
                            })
                        }}
                    />
                    <AntallAnsatteInput
                        label={"-"}
                        value={antallAnsatte.til}
                        endreAntallAnsatte={(ansatteTil: number) => {
                            endreAntallAnsatte({
                                fra: antallAnsatte.fra,
                                til: ansatteTil
                            })
                        }}
                    />
                </HorizontalFlexboxDivGap1Rem>
            </VerticalFlexboxDiv>
        </>
    );
};
