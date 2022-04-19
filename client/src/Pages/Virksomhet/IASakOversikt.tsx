import {Button} from "@navikt/ds-react";
import {IASak} from "../../domenetyper";
import styled from "styled-components";
import {hentBadgeFraStatus} from "../Prioritering/StatusBadge";
import {HorizontalFlexboxDiv} from "../Prioritering/HorizontalFlexboxDiv";

export interface IASakOversiktProps {
    iaSak?: IASak,
    className? : string,
}

function IngenAktiveSaker({className}: {className?: string}) {
    return (
        <div className={className}>
            <p>Status: {hentBadgeFraStatus("IKKE_AKTIV").text}</p>
            <p><Button>Vurderes</Button></p>
        </div>
    )
}

const IASakOversikt = ({ iaSak, className } : IASakOversiktProps) => {
    if (!iaSak)
        return (<IngenAktiveSaker className={className} />)

    return (
        <div className={className}>
            <p><b>Saksnummer:</b> {iaSak.saksnummer}</p>
            <p>Status: {hentBadgeFraStatus(iaSak.status).text}</p>
            {iaSak.eidAv && <p>Eier: {iaSak.endretAv}</p>}
            <HorizontalFlexboxDiv>
                {iaSak.gyldigeNesteHendelser.map(hendelse => {
                    return <Button key={hendelse}>{hendelse}</Button>
                })}
            </HorizontalFlexboxDiv>
        </div>
    )
}

export const StyledIaSakOversikt = styled(IASakOversikt)`
    padding: 1rem;
    width: 100%;
    border-radius: 0px 0px 10px 10px;
    background-color: ${props => hentBadgeFraStatus(props.iaSak?.status || "IKKE_AKTIV").backgroundColor};
`
