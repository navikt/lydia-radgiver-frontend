import { IASakshendelse } from "../../domenetyper";
import styled from "styled-components";
import { hvitRammeMedBoxShadow } from "../../styling/containere";
import { Table, Heading, Detail } from "@navikt/ds-react";
import { dato } from "../../util/DatoFormatter";
import { oversettNavnPåSakshendelsestype } from "./IASakshendelseKnapp";

export interface IASakHendelserOversiktProps {
    sakshendelser: IASakshendelse[];
    className?: string;
}

const IASakshendelserOversikt = ({
    sakshendelser,
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
            {sakshendelser.length > 0 ? (
                <IASakshendelserTabell
                    sakshendelser={sakshendelser.sort(
                        (a, b) =>
                            b.opprettetTidspunkt.getTime() -
                            a.opprettetTidspunkt.getTime()
                    )}
                />
            ) : (
                <IngenHendelserPåSak />
            )}
        </div>
    );
};

const IngenHendelserPåSak = () => {
    return (
        <Detail size="small" style={{ padding: "1rem 3rem" }}>
            Fant ingen samarbeidshistorikk på denne virksomheten
        </Detail>
    );
};

const IASakshendelserTabell = ({
    sakshendelser,
}: {
    sakshendelser: IASakshendelse[];
}) => {
    const kolonneNavn = ["Hendelse", "Tidspunkt", "Person"];

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
                    {sakshendelser.map((sakshendelse) => {
                        return (
                            <Table.Row key={sakshendelse.id}>
                                <Table.DataCell>
                                    {oversettNavnPåSakshendelsestype(
                                        sakshendelse.hendelsestype
                                    )}
                                </Table.DataCell>
                                <Table.DataCell>
                                    {dato(sakshendelse.opprettetTidspunkt)}
                                </Table.DataCell>
                                <Table.DataCell>
                                    {sakshendelse.opprettetAv}
                                </Table.DataCell>
                            </Table.Row>
                        );
                    })}
                </Table.Body>
            </Table>
        </>
    );
};

export const StyledIASakshendelserOversikt = styled(IASakshendelserOversikt)`
    ${hvitRammeMedBoxShadow}
`;
