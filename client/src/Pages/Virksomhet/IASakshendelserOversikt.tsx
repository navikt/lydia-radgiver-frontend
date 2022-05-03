import {IASakshendelse, IASakshendelseType, IASakshendelseTypeEnum} from "../../domenetyper";
import styled from "styled-components";
import {hvitRammeMedBoxShadow} from "../../styling/containere";
import {Table, Heading, Detail} from "@navikt/ds-react";

export interface IASakHendelserOversiktProps {
    sakshendelser: IASakshendelse[]
    className? : string
}


const IASakshendelserOversikt = ({sakshendelser, className}: IASakHendelserOversiktProps) => {
    return (
        <div className={className}>
            <Heading size="medium" level={"2"} style={{ padding : "1rem 3rem", borderBottom : "1px solid black"}}>
                Samarbeidshistorikk
            </Heading>
            {sakshendelser.length > 0
                ? <IASakshendelserTabell sakshendelser={sakshendelser}/>
                : <IngenHendelserPåSak/>
            }
        </div>
    )
}

const IngenHendelserPåSak = () => {
    return <Detail size="small" style={{ padding : "1rem 3rem"}}>Fant ingen samarbeidshistorikk på denne virksomheten</Detail>
}

export const oversettNavnPåSakshendelsestype = (hendelsestype : IASakshendelseType) => {
    switch(hendelsestype) {
        case IASakshendelseTypeEnum.enum.VIRKSOMHET_VURDERES:
            return "Virksomhet vurderes"
        case IASakshendelseTypeEnum.enum.OPPRETT_SAK_FOR_VIRKSOMHET:
            return "Opprett sak for virksomhet"
        case IASakshendelseTypeEnum.enum.TA_EIERSKAP_I_SAK:
            return "Ta eierskap i sak"
        case IASakshendelseTypeEnum.enum.VIRKSOMHET_SKAL_KONTAKTES:
            return "Virksomhet skal kontaktes"
        case IASakshendelseTypeEnum.enum.VIRKSOMHET_ER_IKKE_AKTUELL:
            return "Virksomhet er ikke aktuell"
    }
}

const IASakshendelserTabell = ({sakshendelser}: { sakshendelser: IASakshendelse[] }) => {
    const kolonneNavn = ["Hendelse", "Tidspunkt", "Person"]

    return <>
        <Table zebraStripes>
            <Table.Header>
                <Table.Row>
                    {kolonneNavn.map(navn => (<Table.HeaderCell scope="col" key={navn}>{navn}</Table.HeaderCell>))}
                </Table.Row>
            </Table.Header>
            <Table.Body>
                {sakshendelser.map((sakshendelse) => (
                    <Table.Row key={sakshendelse.id}>
                        <Table.DataCell>{oversettNavnPåSakshendelsestype(sakshendelse.hendelsestype)}</Table.DataCell>
                        <Table.DataCell>{sakshendelse.opprettetTidspunkt.toLocaleString()}</Table.DataCell>
                        <Table.DataCell>{sakshendelse.opprettetAv}</Table.DataCell>
                    </Table.Row>
                ))}
            </Table.Body>
        </Table>
    </>;
}

export const StyledIASakshendelserOversikt = styled(IASakshendelserOversikt)`
    ${hvitRammeMedBoxShadow}
`
