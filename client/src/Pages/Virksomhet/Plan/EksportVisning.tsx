import { Plan, PlanTema } from "../../../domenetyper/plan";
import { BodyShort, Button, Heading } from "@navikt/ds-react";
import { FilePdfIcon } from "@navikt/aksel-icons";
import React from "react";
import styled from "styled-components";
import PlanGraf from "./PlanGraf";
import { PrettyInnholdsDato } from "./InnholdsBlokk";
import VirksomhetsEksportHeader from "../../../components/pdfEksport/VirksomhetsEksportHeader";
import useEksportFilnavn from "../../../components/pdfEksport/useEksportFilnavn";
import jsPDF from "jspdf";
import VirksomhetContext, { useVirksomhetContext } from "../VirksomhetContext";
import ReactDOMServer from "react-dom/server";
import { IaSakProsess } from "../../../domenetyper/iaSakProsess";

const EXPORT_INTERNAL_WIDTH = 1280;

export default function EksportVisning({
    samarbeidsplan,
    samarbeid,
}: {
    samarbeidsplan: Plan;
    samarbeid: IaSakProsess;
}) {
    const [lagrer, setLagrer] = React.useState(false);
    const virksomhetdata = useVirksomhetContext();
    const doc = new jsPDF("p", "mm", "a4");
    const eksportfilnavn = useEksportFilnavn("Sammarbeidsplan");
    const Eksportside = (
        <VirksomhetContext.Provider value={virksomhetdata}>
            <div style={{ width: EXPORT_INTERNAL_WIDTH, padding: "2rem" }}>
                <EksportInnhold plan={samarbeidsplan} samarbeid={samarbeid} />
            </div>
        </VirksomhetContext.Provider>
    );

    return (
        <Button
            loading={lagrer}
            icon={<FilePdfIcon fontSize="1.5rem" />}
            variant="secondary"
            size="small"
            onClick={(e) => {
                setLagrer(true);
                e.stopPropagation();
                doc.html(ReactDOMServer.renderToStaticMarkup(Eksportside), {
                    callback: () => {
                        doc.save(eksportfilnavn);
                    },
                    autoPaging: "text",
                    html2canvas: {
                        scale:
                            doc.internal.pageSize.getWidth() /
                            EXPORT_INTERNAL_WIDTH,
                    },
                }).then(() => {
                    setLagrer(false);
                });
            }}
        >
            Eksporter
        </Button>
    );
}

const Container = styled.div`
    height: 100%;
    display: flex;
    flex-direction: column;
    gap: 3rem;
    margin-top: 2rem;
    border-top: 1px solid var(--a-gray-300);
    padding: 2rem;
`;

function EksportInnhold({ plan, samarbeid }: { plan: Plan, samarbeid: IaSakProsess }) {
    return (
        <>
            <VirksomhetsEksportHeader type="Sammarbeidsplan" samarbeid={samarbeid} />
            {plan.temaer
                .filter((tema) => tema.planlagt)
                .sort((a, b) => {
                    return a.id - b.id;
                })
                .map((tema, index) => {
                    return (
                        <Container key={index}>
                            <Heading level="3" size="medium" spacing={true}>
                                {tema.navn}
                            </Heading>
                            <PlanGraf undertemaer={tema.undertemaer} hidePin />
                            <UndertemaInnhold tema={tema} />
                        </Container>
                    );
                })}
        </>
    );
}

function UndertemaInnhold({ tema }: { tema: PlanTema }) {
    return (
        <div
            style={{
                paddingBottom: "2rem",
                display: "grid",
                gridTemplateColumns: "min-content 1fr 1fr",
            }}
        >
            {tema.undertemaer
                .filter((undertema) => undertema.planlagt)
                .sort((a, b) => {
                    return a.id - b.id;
                })
                .map((undertema, index) => (
                    <React.Fragment key={index}>
                        <Heading level="4" size="small" spacing style={{ minWidth: "20rem" }}>
                            {undertema.navn}:
                        </Heading>
                        <BodyShort style={{ marginLeft: "2rem" }}>
                            {undertema.status?.charAt(0)?.toLocaleUpperCase()}
                            {undertema.status
                                ?.substring(1)
                                ?.toLocaleLowerCase()}
                        </BodyShort>
                        <BodyShort
                            style={{ marginLeft: "2rem", textAlign: "end" }}
                        >
                            {undertema.startDato && (
                                <PrettyInnholdsDato
                                    date={undertema.startDato}
                                />
                            )}{" "}
                            -{" "}
                            {undertema.sluttDato && (
                                <PrettyInnholdsDato
                                    date={undertema.sluttDato}
                                />
                            )}
                        </BodyShort>
                        <BodyShort
                            spacing
                            style={{
                                gridColumnStart: 0,
                                gridColumnEnd: "span 3",
                                marginBottom: "2rem",
                            }}
                        >
                            Mål: {undertema.målsetning}
                        </BodyShort>
                    </React.Fragment>
                ))}
        </div>
    );
}
