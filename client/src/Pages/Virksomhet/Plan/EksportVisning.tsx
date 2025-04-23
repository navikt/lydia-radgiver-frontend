import { Plan, PlanTema } from "../../../domenetyper/plan";
import { ActionMenu, BodyShort, Heading } from "@navikt/ds-react";
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
import { loggEksportertTilPdf } from "../../../util/amplitude-klient";

const EXPORT_INTERNAL_WIDTH = 1280;

const EksportStyleContainer = styled.div`
    // Vi må override litt farger før eksport.
    --ac-timeline-period-danger-border: #c30000;
    --ac-timeline-period-danger-bg: #c30000;
    --ac-timeline-period-success-border: #06893a;
    --ac-timeline-period-success-bg: #06893a;
    --ac-timeline-period-info-border: #368da8;
    --ac-timeline-period-info-bg: #368da8;
    --ac-timeline-period-warning-border: #c77300;
    --ac-timeline-period-warning-bg: #c77300;
    font-family: Arial, sans-serif;
`;

export default function EksportVisning({
    samarbeidsplan,
    samarbeid,
    setLagrer,
}: {
    samarbeidsplan: Plan;
    samarbeid: IaSakProsess;
    setLagrer: React.Dispatch<React.SetStateAction<boolean>>;
}) {
    const virksomhetdata = useVirksomhetContext();
    const doc = new jsPDF("p", "mm", "a4", true);
    const doc2 = doc;
    const eksportfilnavn = useEksportFilnavn("Samarbeidsplan");
    const Eksportside = (
        <VirksomhetContext.Provider value={virksomhetdata}>
            <div style={{ width: EXPORT_INTERNAL_WIDTH, padding: "2rem" }}>
                <EksportStyleContainer>
                    <EksportInnhold
                        plan={samarbeidsplan}
                        samarbeid={samarbeid}
                    />
                </EksportStyleContainer>
            </div>
        </VirksomhetContext.Provider>
    );

    return (
        <ActionMenu.Item
            onClick={(e) => {
                setLagrer(true);
                e.stopPropagation();
                loggEksportertTilPdf("plan");
                doc.html(ReactDOMServer.renderToStaticMarkup(Eksportside), {
                    callback: () => {
                        doc.save(eksportfilnavn);
                    },
                    autoPaging: "text",
                    html2canvas: {
                        scale:
                            doc.internal.pageSize.getWidth() /
                            EXPORT_INTERNAL_WIDTH,
                        onclone: (doc) => {
                            const target = doc.querySelector("#eksportdiv");
                            if (target !== null) {
                                const images = target.querySelectorAll("img");

                                const targetRect = target.getBoundingClientRect();

                                images.forEach((img) => {
                                    if (!img.classList.contains("nav-logo")) {
                                        const rect = img.getBoundingClientRect();
                                        doc2.addImage(img, "JPEG", targetRect.x - rect.x, targetRect.y - rect.y, rect.width, rect.height, undefined, "FAST");
                                        img.remove();
                                    }
                                });
                            }
                        }

                    },
                }).then(() => {
                    setLagrer(false);
                });
            }}
        >
            <FilePdfIcon aria-hidden fontSize="1.25rem" />
            Eksporter
        </ActionMenu.Item>
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

function EksportInnhold({
    plan,
    samarbeid,
}: {
    plan: Plan;
    samarbeid: IaSakProsess;
}) {
    return (
        <div id="eksportdiv">
            <VirksomhetsEksportHeader
                type="Samarbeidsplan"
                samarbeid={samarbeid}
            />
            {plan.temaer
                .filter((tema) => tema.inkludert)
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
        </div>
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
                .filter((undertema) => undertema.inkludert)
                .sort((a, b) => {
                    return a.id - b.id;
                })
                .map((undertema, index) => (
                    <React.Fragment key={index}>
                        <Heading
                            level="4"
                            size="small"
                            spacing
                            style={{ minWidth: "20rem" }}
                        >
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
