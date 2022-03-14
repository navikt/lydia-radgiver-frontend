import { ChangeEvent, useState } from "react";
import { TextField } from "@navikt/ds-react";

type Validering = {
  suksess: boolean;
  feilmelding?: string;
};

const feil = (feilmelding: string): Validering => {
  return {
    suksess: false,
    feilmelding: feilmelding,
  };
};

const riktig = (): Validering => {
  return {
    suksess: true,
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

function SykefraværsprosentInput(props: {
  value: number;
  valideringsfeil: string[];
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
}) {
  return (
    <TextField
      label={"Sykefraværsprosent fra"}
      value={props.value}
      error={
        props.valideringsfeil.length > 0 ? props.valideringsfeil : undefined
      }
      onChange={props.onChange}
    />
  );
}

interface SykefraværsProsentProps {
  sykefraværsprosentRange: Range;
  endre: (verdi: Range) => void;
}

export const SykefraværsprosentVelger = ({
  sykefraværsprosentRange,
  endre,
}: SykefraværsProsentProps) => {
  const [valideringsfeilFra, setValideringsfeilFra] = useState<string[]>([]);
  const [valideringsfeilTil, setValideringsfeilTil] = useState<string[]>([]);
  return (
    <div>
      <SykefraværsprosentInput
        value={sykefraværsprosentRange.fra}
        valideringsfeil={valideringsfeilFra}
        onChange={(e) => {
          const validering = validerSykefraværsprosent(e.target.value);
          setSykefraværsprosent({
            ...sykefraværsProsent,
            fra: e.target.value,
          });
          if (!validering.suksess) {
            setValideringsfeilFra([validering.feilmelding!]);
          } else {
            setValideringsfeilFra([]);
            endre(sykefraværsprosentRange);
          }
        }}
      />
      <TextField
        label={"Sykefraværsprosent til"}
        value={sykefraværsProsent.til}
        error={valideringsfeilTil.length > 0 ? valideringsfeilTil : undefined}
        onChange={(e) => {
          const validering = validerSykefraværsprosent(e.target.value);
          setSykefraværsprosentTilInput(e.target.value);
          if (!validering.suksess) {
            setValideringsfeilTil([validering.feilmelding!]);
          } else {
            setValideringsfeilTil([]);
            endreSykefraværsprosentTil(Number(e.target.value));
          }
        }}
      />
    </div>
  );
};
