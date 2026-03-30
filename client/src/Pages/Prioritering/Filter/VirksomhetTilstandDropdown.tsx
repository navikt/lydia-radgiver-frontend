import { ChangeEvent } from "react";
import { Select } from "@navikt/ds-react";
import { VirksomhetIATilstand } from "../../../domenetyper/domenetyper";
import { penskrivVirksomhetTilstand } from "../../../components/Badge/VirksomhetTilstandStatusBadge";

interface Props {
    valgtVirksomhetTilstand?: VirksomhetIATilstand;
    endreVirksomhetTilstand: (status?: VirksomhetIATilstand) => void;
    tilstander: VirksomhetIATilstand[];
}

export const VirksomhetTilstandDropdown = ({
    valgtVirksomhetTilstand,
    endreVirksomhetTilstand,
    tilstander,
}: Props) => {
    const onChange = (event: ChangeEvent<HTMLSelectElement>) => {
        endreVirksomhetTilstand(
            (!!event.target.value &&
                (event.target.value as VirksomhetIATilstand)) ||
                undefined,
        );
    };

    return (
        <Select
            label="Tilstand"
            value={valgtVirksomhetTilstand || ""}
            onChange={onChange}
        >
            <option key="empty-status" value={""}>
                Alle
            </option>
            {tilstander.map((tilstand) => (
                <option key={tilstand} value={tilstand}>
                    {penskrivVirksomhetTilstand(tilstand)}
                </option>
            ))}
        </Select>
    );
};
