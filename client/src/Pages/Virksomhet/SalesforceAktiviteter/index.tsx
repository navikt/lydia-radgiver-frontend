import { useHentSalesforceAktiviteter } from "../../../api/lydia-api/nyFlyt";
import { IASak } from "../../../domenetyper/domenetyper";
import { IaSakProsess } from "../../../domenetyper/iaSakProsess";
import { Box, Table, Tag } from "@navikt/ds-react";
import { lokalDato } from "../../../util/dato";
import styles from "./salesforceaktiviteter.module.scss";

type SalesforceAktiviteterProps = {
    iaSak: IASak;
    samarbeid: IaSakProsess;
};

export default function SalesforceAktiviteter({
    iaSak,
    samarbeid,
}: SalesforceAktiviteterProps) {
    const { data: salesforceAktiviteter } = useHentSalesforceAktiviteter(
        iaSak.orgnr,
        iaSak.saksnummer,
        samarbeid.id,
    );
    if (!salesforceAktiviteter?.length) {
        return (
            <p>Ingen aktiviteter i Salesforce knyttet til dette samarbeidet.</p>
        );
    }
    return (
        <Box
            className={styles.salesforceAktiviteterBoks}
            background={"default"}
            borderColor={"neutral-subtle"}
            borderWidth={"1"}
            borderRadius={"8"}
            padding={"space-24"}
        >
            <Table className={styles.aktiviteterTabell}>
                <Table.Header className={styles.noWrap}>
                    <Table.Row>
                        <Table.HeaderCell scope="col">
                            Sist endret
                        </Table.HeaderCell>
                        <Table.HeaderCell scope={"col"}>
                            Status
                        </Table.HeaderCell>
                        <Table.HeaderCell scope="col">Type</Table.HeaderCell>
                        <Table.HeaderCell scope="col">Emne</Table.HeaderCell>
                        <Table.HeaderCell scope="col">Tema</Table.HeaderCell>
                        <Table.HeaderCell scope="col">
                            Undertema
                        </Table.HeaderCell>
                        <Table.HeaderCell scope={"col"}>
                            Planlagt
                        </Table.HeaderCell>
                        <Table.HeaderCell scope={"col"}>
                            Fullført
                        </Table.HeaderCell>
                        <Table.HeaderCell scope={"col"}>
                            Møtetid
                        </Table.HeaderCell>
                    </Table.Row>
                </Table.Header>
                <Table.Body>
                    {salesforceAktiviteter?.map((aktivitet) => (
                        <Table.Row key={aktivitet.id}>
                            <Table.DataCell>
                                {lokalDato(aktivitet.sistEndretISalesforce)}
                            </Table.DataCell>
                            <Table.DataCell>
                                {aktivitet.status ? (
                                    <StatusTag status={aktivitet.status} />
                                ) : (
                                    "–"
                                )}
                            </Table.DataCell>
                            <Table.DataCell>
                                <TypeTag type={aktivitet.type} />
                            </Table.DataCell>
                            <Table.DataCell style={{ minWidth: "15rem" }}>
                                {aktivitet.emne ?? "–"}
                            </Table.DataCell>
                            <Table.DataCell>{aktivitet.tema}</Table.DataCell>
                            <Table.DataCell style={{ minWidth: "18rem" }}>
                                {aktivitet.undertema.length <= 1 ? (
                                    (aktivitet.undertema?.[0] ?? "–")
                                ) : (
                                    <ul role="list">
                                        {aktivitet.undertema.map((u) => (
                                            <li key={u}>{u}</li>
                                        ))}
                                    </ul>
                                )}
                            </Table.DataCell>
                            <Table.DataCell>
                                {lokalDatoEllerStrek(aktivitet.planlagt)}
                            </Table.DataCell>
                            <Table.DataCell>
                                {lokalDatoEllerStrek(aktivitet.fullført)}
                            </Table.DataCell>
                            <Table.DataCell>
                                {aktivitet.møteStart && aktivitet.møteSlutt ? (
                                    <span className={styles.noWrap}>
                                        {`${lokalDato(aktivitet.møteStart)} – ${lokalDato(aktivitet.møteSlutt)}`}
                                    </span>
                                ) : (
                                    "–"
                                )}
                            </Table.DataCell>
                        </Table.Row>
                    ))}
                </Table.Body>
            </Table>
        </Box>
    );
}

function StatusTag({ status }: { status: "Åpen" | "Fullført" }) {
    const fellesProps = {
        variant: "strong",
        size: "xsmall",
        children: status,
    } as const;
    if (status === "Åpen") {
        return <Tag data-color={"neutral"} {...fellesProps} />;
    }
    return <Tag data-color={"success"} {...fellesProps} />;
}

function TypeTag({ type }: { type: "Oppgave" | "Møte" }) {
    const fellesProps = {
        variant: "strong",
        size: "xsmall",
        children: type,
    } as const;
    if (type === "Oppgave") {
        return <Tag data-color={"brand-beige"} {...fellesProps} />;
    } else return <Tag data-color={"accent"} {...fellesProps} />;
}

const lokalDatoEllerStrek = (dato: Date | null) => {
    return dato ? lokalDato(dato) : "–";
};
