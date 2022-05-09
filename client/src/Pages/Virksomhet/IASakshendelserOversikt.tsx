import {
    IASakshendelse,
    IASakshendelseType,
    IASakshendelseTypeEnum,
} from "../../domenetyper";
import styled from "styled-components";
import { hvitRammeMedBoxShadow } from "../../styling/containere";
import { Table, Heading, Detail } from "@navikt/ds-react";
import { dato } from "../../util/DatoFormatter";

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
                <IASakshendelserTabell sakshendelser={sakshendelser} />
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

export interface HendelseData {
    text: string;
    buttonVariant: "primary" | "secondary" | "tertiary" | "danger";
}

// TODO: splitt opp i to funksjoner og evt. returner hele knappen som en egen funksjon
export const oversettNavnPåSakshendelsestype = (
    hendelsestype: IASakshendelseType
): HendelseData => {
    switch (hendelsestype) {
        case IASakshendelseTypeEnum.enum.VIRKSOMHET_VURDERES:
            return {
                text: "Virksomhet vurderes",
                buttonVariant: "primary",
            };
        case IASakshendelseTypeEnum.enum.OPPRETT_SAK_FOR_VIRKSOMHET:
            return {
                text: "Opprett sak for virksomhet",
                buttonVariant: "primary",
            };
        case IASakshendelseTypeEnum.enum.TA_EIERSKAP_I_SAK:
            return {
                text: "Ta eierskap i sak",
                buttonVariant: "primary",
            };
        case IASakshendelseTypeEnum.enum.VIRKSOMHET_SKAL_KONTAKTES:
            return {
                text: "Virksomhet skal kontaktes",
                buttonVariant: "primary",
            };
        case IASakshendelseTypeEnum.enum.VIRKSOMHET_ER_IKKE_AKTUELL:
            return {
                text: "Virksomhet er ikke aktuell",
                buttonVariant: "danger",
            };
    }
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
                        console.log(typeof sakshendelse.opprettetTidspunkt);
                        return (
                            <Table.Row key={sakshendelse.id}>
                                <Table.DataCell>
                                    {
                                        oversettNavnPåSakshendelsestype(
                                            sakshendelse.hendelsestype
                                        ).text
                                    }
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
