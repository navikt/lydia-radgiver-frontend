import { Checkbox, CheckboxGroup } from "@navikt/ds-react";
import { Sektor } from "../../../domenetyper/virksomhet";

interface Props {
    valgtSektor?: string[];
    endreSektor: (sektor: string[]) => void;
    sektorer: Sektor[];
}

export const Sektorer = ({ valgtSektor, endreSektor, sektorer }: Props) => {
    return (
        <CheckboxGroup
            legend="Sektor"
            size={"small"}
            onChange={endreSektor}
            value={valgtSektor}
        >
            {sektorer.map((sektor) => (
                <Checkbox key={sektor.kode} value={sektor.kode}>
                    {sektor.beskrivelse}
                </Checkbox>
            ))}
        </CheckboxGroup>
    );
};
