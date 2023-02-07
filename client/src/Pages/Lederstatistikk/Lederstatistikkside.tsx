import styled from "styled-components";
import { contentSpacing } from "../../styling/contentSpacing";
import { Filtervisning } from "../Prioritering/Filter/Filtervisning";
import { useFiltervisningState } from "../Prioritering/Filter/filtervisning-reducer";
import { useFilterverdier, useHentLederstatistikk } from "../../api/lydia-api";
import React, { useEffect, useState } from "react";
import { Lederstatistikk } from "../../domenetyper/lederstatistikk";
import { Loader, Table } from "@navikt/ds-react";
import { StatusBadge } from "../../components/Badge/StatusBadge";

const Container = styled.div`
  padding: ${contentSpacing.mobileY} 0;
`;

export const Lederstatistikkside = () => {
    const [lederstatistikkListe, setLederstatistikkListe] =
        useState<Lederstatistikk[]>();
    const [skalSøke, setSkalSøke] = useState(false);

    const [filtervisningLoaded, setFiltervisningLoaded] = useState(false);
    const harSøktMinstEnGang = lederstatistikkListe !== undefined;
    const fantResultaterISøk =
        harSøktMinstEnGang && lederstatistikkListe.length > 0;
    const skalViseTabell = fantResultaterISøk && !skalSøke;

    const {data: filterverdier} = useFilterverdier();
    const filtervisning = useFiltervisningState();

    const {
        data: lederstatistikkResultatFraApi,
        error,
        loading,
    } = useHentLederstatistikk({
        filterstate: filtervisning.state,
        initierSøk: skalSøke,
    });


    useEffect(() => {
        if (filterverdier && !filtervisningLoaded) {
            filtervisning.lastData({filterverdier});
            setFiltervisningLoaded(true);
        }
    });

    useEffect(() => {
        if (lederstatistikkResultatFraApi) {
            setLederstatistikkListe(lederstatistikkResultatFraApi.data);
            setSkalSøke(false);
        }
    }, [lederstatistikkResultatFraApi]);

    return (
        <Container>
            <Filtervisning
                filtervisning={filtervisning}
                søkPåNytt={() => {
                    setSkalSøke(true);
                }}
            />
            <br />
            {skalViseTabell ? (
                <Table>
                    <Table.Header>
                        <Table.Row>
                            <Table.HeaderCell scope="col">Status</Table.HeaderCell>
                            <Table.HeaderCell scope="col">Antall bedrifter</Table.HeaderCell>
                        </Table.Row>
                    </Table.Header>
                    <Table.Body>
                        {lederstatistikkListe?.map(({status, antall}, i) => {
                            return (
                                <Table.Row key={i + status}>
                                    <Table.HeaderCell scope="row"><StatusBadge status={status} /></Table.HeaderCell>
                                    <Table.DataCell>{antall}</Table.DataCell>
                                </Table.Row>
                            );
                        })}
                    </Table.Body>
                </Table>
            ) : (
                harSøktMinstEnGang && !loading && <p style={{textAlign: "center"}}>Søket ga ingen resultater</p>
            )}
            <div style={{ textAlign: "center" }}>
                {loading && (
                    <Loader
                        title={"Henter lederstatistikk"}
                        variant={"interaction"}
                        size={"xlarge"}
                    />
                )}
                {error && (
                    <p>
                        {" "}
                        Noe gikk galt under uthenting av lederstatistikk
                    </p>
                )}
            </div>
        </Container>
    )
}
