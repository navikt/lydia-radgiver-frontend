import { Select } from "@navikt/ds-react";
import { ChangeEvent } from "react";
import { penskrivVirksomhetTilstand } from "@/components/Badge/VirksomhetTilstandStatusBadge";
import { VirksomhetIATilstand } from "@/domenetyper/domenetyper";

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
            label="Status"
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
