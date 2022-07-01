import {useState} from "react";
import {Label} from "@navikt/ds-react";
import {HorizontalFlexboxDivGap1Rem} from "./HorizontalFlexboxDiv";
import {StyledNumericTextField} from "./StyledNumericTextField";
import {VerticalFlexboxDiv} from "./VerticalFlexboxDiv";

type Validering = {
    suksess: boolean;
    feilmelding: string[];
};

const feil = (feilmelding: string): Validering => {
    return {
        suksess: false,
        feilmelding: [feilmelding],
    };
};

const riktig = (): Validering => {
    return {
        suksess: true,
        feilmelding: [],
    };
};

export interface Range {
    fra: number;
    til: number;
}

const validerSykefraværsprosent = (inputVerdi: string): Validering => {
    if (inputVerdi === "") {
        return feil("Du må velge en verdi");
    }
    const verdi = Number(inputVerdi);
    if (isNaN(verdi) || verdi < 0.0 || verdi > 100.0) {
        return feil("Ugyldig verdi. Tallet må være mellom 0.00 og 100.00");
    }
    return riktig();
};

type EndreSykefraværsprosentRange = (verdi: Range) => void;
type EndreSykefraværsprosent = (verdi: number) => void;

function SykefraværsprosentInput({
    value,
    label,
    onChange,
}: {
    value: number;
    label: string;
    onChange: EndreSykefraværsprosent;
}) {
    const [sykefraværsprosentInput, setSykefraværsprosentInput] =
        useState<string>(value.toString());
    const [valideringsfeil, setValideringsfeil] = useState<string[]>([]);
    return (
        <StyledNumericTextField
            min={"0"}
            max={"100"}
            label={label}
            type={"number"}
            value={sykefraværsprosentInput}
            error={valideringsfeil.length > 0 ? valideringsfeil : undefined}
            onChange={(e) => {
                setSykefraværsprosentInput(e.target.value);
                const validering = validerSykefraværsprosent(e.target.value);
                if (!validering.suksess) {
                    setValideringsfeil(validering.feilmelding);
                } else {
                    setValideringsfeil([]);
                    onChange(+e.target.value);
                }
            }}
        />
    );
}

interface SykefraværsProsentProps {
    sykefraværsprosentRange: Range;
    endre: EndreSykefraværsprosentRange;
}

export const SykefraværsprosentVelger = ({
    sykefraværsprosentRange,
    endre,
}: SykefraværsProsentProps) => {
    return (
        <>
            <VerticalFlexboxDiv>
                <Label>Sykefraværsprosent</Label>
                <HorizontalFlexboxDivGap1Rem>
                    <SykefraværsprosentInput
                        value={sykefraværsprosentRange.fra}
                        label="Fra"
                        onChange={(prosentVerdi: number) =>
                            endre({
                                fra: prosentVerdi,
                                til: sykefraværsprosentRange.til,
                            })
                        }
                    />
                    <SykefraværsprosentInput
                        value={sykefraværsprosentRange.til}
                        label={"-"}
                        onChange={(prosentVerdi: number) =>
                            endre({
                                fra: sykefraværsprosentRange.fra,
                                til: prosentVerdi,
                            })
                        }
                    />
                </HorizontalFlexboxDivGap1Rem>
            </VerticalFlexboxDiv>
        </>
    );
};
