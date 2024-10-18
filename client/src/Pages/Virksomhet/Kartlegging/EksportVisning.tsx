import { BodyShort, Button, Loader } from "@navikt/ds-react";
import React from "react";
import { FilePdfIcon } from "@navikt/aksel-icons";
import { IASak } from "../../../domenetyper/domenetyper";
import { IASakKartlegging } from "../../../domenetyper/iaSakKartlegging";
import { useHentKartleggingResultat } from "../../../api/lydia-api";
import styled from "styled-components";
import { TemaResultat } from "./TemaResultat";
import VirksomhetsEksportHeader from "../../../components/pdfEksport/VirksomhetsEksportHeader";
import useEksportFilnavn from "../../../components/pdfEksport/useEksportFilnavn";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import { useVirksomhetContext } from "../VirksomhetContext";
import { loggEksportertTilPdf } from "../../../util/amplitude-klient";

interface EksportVisningProps {
    erIEksportMode: boolean;
    setErIEksportMode: (erIEksportMode: boolean) => void;
    iaSak: IASak;
    kartlegging: IASakKartlegging;
}
const EXPORT_INTERNAL_WIDTH = 1280;

class pdfEksport {
    static H_PADDING = 7;
    static V_PADDING = 14;
    pdf: jsPDF;
    targetRef: React.RefObject<HTMLDivElement>;
    position: number;
    pageWidth: number;
    pixelRatio: number;
    pageHeight: number;
    eksportfilnavn: string;

    constructor(
        targetRef: React.RefObject<HTMLDivElement>,
        eksportfilnavn: string,
        width: number,
    ) {
        this.pdf = new jsPDF("p", "mm", "a4");
        this.pageHeight =
            this.pdf.internal.pageSize.getHeight() - pdfEksport.H_PADDING * 2;
        this.pageWidth =
            this.pdf.internal.pageSize.getWidth() - pdfEksport.V_PADDING * 2;
        this.targetRef = targetRef;
        this.pixelRatio = this.pageWidth / width;
        this.eksportfilnavn = eksportfilnavn;
        this.position = pdfEksport.H_PADDING;
    }

    private async addContent(
        canvas: HTMLCanvasElement,
        reducedVpadding = false,
        addHPadding = true,
    ) {
        const imgData = canvas.toDataURL("image/png");
        const imgWidth = canvas.width * this.pixelRatio;
        const imgHeight = canvas.height * this.pixelRatio;
        const hPadding = addHPadding ? pdfEksport.H_PADDING : 0;
        const vPadding = reducedVpadding
            ? pdfEksport.V_PADDING * 0.75
            : pdfEksport.V_PADDING;

        if (this.position + imgHeight > this.pageHeight) {
            this.addPage();
        }

        this.pdf.addImage(
            imgData,
            "PNG",
            vPadding,
            this.position + hPadding,
            imgWidth,
            imgHeight,
        );
        this.position += imgHeight + hPadding;
    }

    private async addPage() {
        this.pdf.addPage();
        this.position = pdfEksport.H_PADDING;
    }

    private async addInlineContent(
        canvasL: HTMLCanvasElement,
        canvasR?: HTMLCanvasElement,
    ) {
        if (!canvasR) {
            return this.addContent(canvasL);
        }
        const imgDataL = canvasL.toDataURL("image/png");
        const imgDataR = canvasR.toDataURL("image/png");
        const imgWidthL = canvasL.width * this.pixelRatio;
        const imgWidthR = canvasR.width * this.pixelRatio;
        const imgHeight =
            Math.max(canvasL.height, canvasR.height) * this.pixelRatio;

        if (this.position + imgHeight > this.pageHeight) {
            this.addPage();
        }

        this.pdf.addImage(
            imgDataL,
            "PNG",
            pdfEksport.V_PADDING,
            this.position + pdfEksport.H_PADDING,
            imgWidthL,
            imgHeight,
        );
        this.pdf.addImage(
            imgDataR,
            "PNG",
            imgWidthL + pdfEksport.V_PADDING * 1.5,
            this.position + pdfEksport.H_PADDING,
            imgWidthR,
            imgHeight,
        );
        this.position += imgHeight + pdfEksport.H_PADDING;
    }

    private async addHeader() {
        const headerTopCanvas = await html2canvas(
            this?.targetRef?.current?.childNodes[0]
                ?.childNodes?.[0] as HTMLElement,
            { scale: 1 },
        );
        const headerBottomCanvas = await html2canvas(
            this?.targetRef?.current?.childNodes[0]
                ?.childNodes?.[1] as HTMLElement,
            { scale: 1 },
        );
        await this.addContent(headerTopCanvas, true, true);
        await this.addContent(headerBottomCanvas, false, true);
    }

    private async addBody() {
        if (this.targetRef.current === null) {
            return false;
        }
        const children = this.targetRef.current.childNodes[1].childNodes;
        for (let i = 0; i < children.length; i++) {
            const child = children[i] as HTMLElement;

            // if child is div it is a graph container
            if (child.tagName === "DIV") {
                await this.addGraphs(child);
            } else {
                const canvas = await html2canvas(child as HTMLElement, {
                    scale: 1,
                });
                if (
                    this.nextPageCantFitHeaderAndGraph(
                        child,
                        children[i + 1] as HTMLElement,
                    )
                ) {
                    this.addPage();
                }
                await this.addContent(canvas);
            }
        }
        return true;
    }

    private nextPageCantFitHeaderAndGraph(
        header: HTMLElement,
        graph: HTMLElement,
    ) {
        return (
            this.position +
                header.clientHeight * this.pixelRatio +
                graph.clientHeight * this.pixelRatio >
            this.pageHeight
        );
    }

    private async addGraphs(child: Node) {
        for (let i = 0; i < child.childNodes.length; i += 2) {
            const canvasL = await html2canvas(
                child.childNodes[i] as HTMLElement,
                { scale: 1 },
            );
            const canvasR = child.childNodes[i + 1]
                ? await html2canvas(child.childNodes[i + 1] as HTMLElement, {
                      scale: 1,
                  })
                : undefined;
            await this.addInlineContent(canvasL, canvasR);
        }
    }

    private async exportPDF() {
        return this.pdf.save(this.eksportfilnavn);
    }

    async runExport() {
        await this.addHeader();
        await this.addBody();
        await this.exportPDF();
    }
}

const EksportVisning = ({
    erIEksportMode,
    setErIEksportMode,
    iaSak,
    kartlegging,
}: EksportVisningProps) => {
    /* 	toPDF har returntypen void, men i den faktiske koden har den returntypen Promise<void>
        Må caste til Promise<void> for å sette loadingindikator */
    const targetRef = React.useRef<HTMLDivElement>(null);
    const [erLastet, setErLastet] = React.useState(false);
    const eksportfilnavn = useEksportFilnavn("Behovsvurdering");

    React.useEffect(() => {
        if (targetRef.current !== null && erIEksportMode && erLastet) {
            const pdfe = new pdfEksport(
                targetRef,
                eksportfilnavn,
                EXPORT_INTERNAL_WIDTH,
            );
            pdfe.runExport().then(() => {
                setErIEksportMode(false);
            });
        }
    }, [erIEksportMode, erLastet]);

    if (kartlegging.status !== "AVSLUTTET") {
        return null;
    }

    return (
        <>
            <Button
                loading={erIEksportMode}
                icon={<FilePdfIcon fontSize="1.5rem" />}
                variant="secondary"
                size="small"
                onClick={(e) => {
                    e.stopPropagation();
                    loggEksportertTilPdf("kartlegging");
                    setErIEksportMode(true);
                }}
            >
                Eksporter
            </Button>
            <div
                style={{ height: 0, overflow: "hidden", position: "absolute" }}
            >
                <div
                    ref={targetRef}
                    style={{
                        display: erIEksportMode ? "block" : "none",
                        width: EXPORT_INTERNAL_WIDTH,
                    }}
                >
                    <VirksomhetsEksportHeader
                        type="Behovsvurdering"
                        dato={kartlegging.endretTidspunkt}
                    />
                    <EksportInnhold
                        erLastet={erLastet}
                        setErLastet={setErLastet}
                        kartlegging={kartlegging}
                        iaSak={iaSak}
                    />
                </div>
            </div>
        </>
    );
};

const Container = styled.div`
    height: 100%;
    padding-left: 2rem;
    padding-right: 2rem;

    display: flex;
    flex-direction: column;
`;

function EksportInnhold({
    kartlegging,
    iaSak,
    erLastet,
    setErLastet,
}: {
    kartlegging: IASakKartlegging;
    iaSak: IASak;
    erLastet: boolean;
    setErLastet: (erLastet: boolean) => void;
}) {
    //const { loading: lasterKartleggingResultat } =
    const { data: kartleggingResultat, loading: lasterKartleggingResultat } =
        useHentKartleggingResultat(
            iaSak.orgnr,
            iaSak.saksnummer,
            kartlegging.kartleggingId,
        );

    //const kartleggingResultat = dummyKartleggingResultat;
    const { virksomhet } = useVirksomhetContext();
    const { navn: virksomhetsnavn } = virksomhet;

    React.useEffect(() => {
        if (!lasterKartleggingResultat && kartleggingResultat && !erLastet) {
            setErLastet(true);
        }
    }, [lasterKartleggingResultat, kartleggingResultat, setErLastet, erLastet]);

    if (lasterKartleggingResultat) {
        return <Loader />;
    }

    if (!kartleggingResultat) {
        return <BodyShort>Kunne ikke hente resultater</BodyShort>;
    }

    return (
        <Container>
            <BodyShort>{virksomhetsnavn}</BodyShort>
            {kartleggingResultat.spørsmålMedSvarPerTema.map((tema) => (
                <TemaResultat
                    key={tema.navn}
                    spørsmålResultat={tema.spørsmålMedSvar}
                    navn={tema.navn}
                    erIEksportMode={true}
                    headingSize="large"
                />
            ))}
        </Container>
    );
}

export default EksportVisning;
