import { useState } from "react";
import { Fieldset, Label } from "@navikt/ds-react";
import { StyledNumericTextField } from "./StyledNumericTextField";
import styled from "styled-components";

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

interface Props {
    value: number;
    label: string;
    hideLabel?: boolean;
    onChange: EndreSykefraværsprosent;
}

function SykefraværsprosentInput({value, label, hideLabel = false, onChange}: Props) {
    const [sykefraværsprosentInput, setSykefraværsprosentInput] =
        useState<string>(value.toString());
    const [valideringsfeil, setValideringsfeil] = useState<string[]>([]);

    return (
        <StyledNumericTextField
            min={"0"}
            max={"100"}
            label={label}
            hideLabel={hideLabel}
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

const StyledFieldset = styled(Fieldset)`
  display: flex;
  gap: 1rem;
  align-items: center;
`;

interface SykefraværsProsentProps {
    sykefraværsprosentRange: Range;
    endre: EndreSykefraværsprosentRange;
}

export const SykefraværsprosentVelger = ({sykefraværsprosentRange, endre}: SykefraværsProsentProps) =>
    <StyledFieldset legend="Sykefravær (%)">
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
        <Label>-</Label>
        <SykefraværsprosentInput
            value={sykefraværsprosentRange.til}
            label={"Til"}
            hideLabel
            onChange={(prosentVerdi: number) =>
                endre({
                    fra: sykefraværsprosentRange.fra,
                    til: prosentVerdi,
                })
            }
        />
    </StyledFieldset>;
