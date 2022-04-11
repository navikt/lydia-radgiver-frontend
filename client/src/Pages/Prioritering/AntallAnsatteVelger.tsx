import {HorizontalFlexboxDiv} from "./HorizontalFlexboxDiv";
import {TextField} from "@navikt/ds-react";
import {useState} from "react";
import {Range} from "./SykefraværsprosentVelger";

function AntallAnsatteInput({label, value, endreAntallAnsatte}: {label: string, value: number, endreAntallAnsatte: (verdi: number) => void}) {
    const [ansatte, setAnsatte] = useState<string>(isNaN(value) ? "" : value.toString)
    return (
        <TextField
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
                    let nyAnsatte = Math.floor(Math.abs(e.target.valueAsNumber))
                    setAnsatte(String(nyAnsatte))
                    endreAntallAnsatte(nyAnsatte)
                }

            }}
            placeholder={"antall ansatte"}
        />
    );
}


export const AntallAnsatteVelger = ({antallAnsatte, endreAntallAnsatte}: {antallAnsatte: Range, endreAntallAnsatte: (verdi: Range) => void}) => {
    return (
        <HorizontalFlexboxDiv>
            <AntallAnsatteInput
                label={"Ansatte fra"}
                value={antallAnsatte.fra}
                endreAntallAnsatte={(ansatteFra: number) => {
                    endreAntallAnsatte({
                        fra: ansatteFra,
                        til: antallAnsatte.til
                    })
                }}
            />
            <AntallAnsatteInput
                label={"Ansatte til"}
                value={antallAnsatte.til}
                endreAntallAnsatte={(ansatteTil: number) => {
                    endreAntallAnsatte({
                        fra: antallAnsatte.fra,
                        til: ansatteTil
                    })
                }}
            />
        </HorizontalFlexboxDiv>
    );
};