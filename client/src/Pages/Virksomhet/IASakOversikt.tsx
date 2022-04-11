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
                onChange={(_) => {}}
            >
                <option value={iaProsessStatus} key={iaProsessStatus}>
                    {hentBadgeFraStatus(iaProsessStatus).text}
                </option>
            </Select>
            <div hidden={true}>
                <br/>
                <Label>Innsatsteam</Label>
                <p>{jaEllerNei(innsatsteam)}</p>
            </div>
        </div>
    )
}


export const StyledIaSakOversikt = styled(IASakOversikt)`
    padding: 1rem;
    width: 100%;
    border-radius: 0px 0px 10px 10px;
    background-color: ${props => hentBadgeFraStatus(props.iaProsessStatus).backgroundColor};
`
