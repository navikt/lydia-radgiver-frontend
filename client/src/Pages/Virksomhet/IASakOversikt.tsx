import {Label, Select} from "@navikt/ds-react";
import {IAProsessStatusType} from "../../domenetyper";
import styled from "styled-components";
import {hentBadgeFraStatus} from "../Prioritering/StatusBadge";

export interface IASakOversiktProps {
    saksnummer: string,
    iaProsessStatus: IAProsessStatusType,
    innsatsteam : boolean,
    className? : string,
}

const jaEllerNei = (b : boolean) => b ? "Ja" : "Nei"

const IASakOversikt = ({ saksnummer, iaProsessStatus, innsatsteam, className } : IASakOversiktProps) => {
    return (
        <div className={className}>
            <Label>Saksnummer</Label>
            <p>{saksnummer}</p>
            <Select
                label="Status"
                value={iaProsessStatus}
                onChange={() => {}}
            >
                <option value={iaProsessStatus} key={iaProsessStatus}>
                    {hentBadgeFraStatus(iaProsessStatus).text}
                </option>
            </Select>
            <br/>
            <Label>Innsatsteam</Label>
            <p>{jaEllerNei(innsatsteam)}</p>
        </div>
    )
}


export const StyledIaSakOversikt = styled(IASakOversikt)`
    padding: 1rem;
    background-color: ${props => hentBadgeFraStatus(props.iaProsessStatus).backgroundColor};
`
