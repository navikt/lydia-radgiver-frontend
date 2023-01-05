import { TallInput } from "./TallInput";
import { FraTilFieldset } from "./FraTilFieldset";

export interface Range {
    fra: number;
    til: number;
}

type EndreSykefraværsprosentRange = (verdi: Range) => void;
type EndreSykefraværsprosent = (verdi: number) => void;

interface InputProps {
    value: number;
    label: string;
    hideLabel?: boolean;
    onChange: EndreSykefraværsprosent;
}

function SykefraværsprosentInput({
    value,
    label,
    hideLabel = false,
    onChange,
}: InputProps) {
    return (
        <TallInput
            type={"number"}
            min={"0"}
            max={"100"}
            value={`${value}`}
            label={label}
            hideLabel={hideLabel}
            onChange={(e) => {
                onChange(e.target.valueAsNumber);
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
}: SykefraværsProsentProps) => (
    <FraTilFieldset legend="Sykefravær (%)">
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
        <p className="navds-label">-</p>
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
    </FraTilFieldset>
);
