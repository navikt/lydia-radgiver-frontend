import {Sakshistorikk} from "../../domenetyper";
import styled from "styled-components";
import {hvitRammeMedBoxShadow} from "../../styling/containere";
import {Table, Heading, Detail} from "@navikt/ds-react";
import {lokalDatoMedTid} from "../../util/datoFormatering";
import {StatusBadge} from "../Prioritering/StatusBadge";
import {NavIdentMedLenke} from "../../components/NavIdentMedLenke";

export interface IASakHendelserOversiktProps {
    samarbeidshistorikk: Sakshistorikk[];
    className?: string;
}

const Samarbeidshistorikk = ({
                                 samarbeidshistorikk,
                                 className,
                             }: IASakHendelserOversiktProps) => {
    return (
        <div className={className}>
            <Heading
                size="medium"
                level={"2"}
                style={{
                    padding: "1rem 3rem",
                    borderBottom: "1px solid black",
                }}
            >
                Samarbeidshistorikk
            </Heading>
            {samarbeidshistorikk.length > 0 ? (
                samarbeidshistorikk.map(sakshistorikk =>
                    <SakshistorikkTabell
                        key={sakshistorikk.saksnummer}
                        sakshistorikk={sakshistorikk}
                    />
                )
            ) : (
                <IngenHendelserPåSak/>
            )}
        </div>
    );
};

const IngenHendelserPåSak = () => {
    return (
        <Detail size="small" style={{padding: "1rem 3rem"}}>
            Fant ingen samarbeidshistorikk på denne virksomheten
        </Detail>
    );
};

const SakshistorikkTabell = ({
                                 sakshistorikk
                             }: {
    sakshistorikk: Sakshistorikk;
}) => {
    const kolonneNavn = ["Status", "Tidspunkt", "Begrunnelse", "Ansvarlig"];

    return (
        <>
            <Table zebraStripes>
                <Table.Header>
                    <Table.Row>
                        {kolonneNavn.map((navn) => (
                            <Table.HeaderCell scope="col" key={navn}>
                                {navn}
                            </Table.HeaderCell>
                        ))}
                    </Table.Row>
                </Table.Header>
                <Table.Body>
                    {sakshistorikk.sakshendelser.sort(
                        (a, b) =>
                            b.tidspunktForSnapshot.getTime() -
                            a.tidspunktForSnapshot.getTime()
                    ).map((sakSnapshot, index) => {
                        return (
                            <Table.Row key={index}>
                                <Table.DataCell>
                                    <StatusBadge status={sakSnapshot.status}/>
                                </Table.DataCell>
                                <Table.DataCell>
                                    {lokalDatoMedTid(sakSnapshot.tidspunktForSnapshot)}
                                </Table.DataCell>
                                <Table.DataCell>
                                    <ul style={{margin: "0"}}>
                                        {sakSnapshot.begrunnelser.map(begrunnelse =>
                                            (<li key={begrunnelse}>
                                                <Detail size={"small"}>{begrunnelse}</Detail>
                                            </li>)
                                        )}
                                    </ul>
                                </Table.DataCell>
                                <Table.DataCell>
                                    <NavIdentMedLenke navIdent={sakSnapshot.eier}/>
                                </Table.DataCell>
                            </Table.Row>
                        );
                    })}
                </Table.Body>
            </Table>
        </>
    );
};

export const StyledSamarbeidshistorikk = styled(Samarbeidshistorikk)`
    ${hvitRammeMedBoxShadow}
`;
