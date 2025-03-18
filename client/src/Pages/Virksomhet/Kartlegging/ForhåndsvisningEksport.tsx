import { BodyShort, Button, Heading } from "@navikt/ds-react";
import React from "react";
import { FilePdfIcon } from "@navikt/aksel-icons";
import { Spørreundersøkelse } from "../../../domenetyper/spørreundersøkelse";
import VirksomhetsEksportHeader from "../../../components/pdfEksport/VirksomhetsEksportHeader";
import useEksportFilnavn from "../../../components/pdfEksport/useEksportFilnavn";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import { loggEksportertTilPdf } from "../../../util/amplitude-klient";
import { useHentSpørreundersøkelseMedInnhold } from "../../../api/lydia-api/spørreundersøkelse";
import { useSpørreundersøkelse, useSpørreundersøkelseType } from "../../../components/Spørreundersøkelse/SpørreundersøkelseContext";
import { GruppertSpørsmålRenderer } from "./SpørreundersøkelseForhåndsvisningModal/Forhåndsvisning";
import { SpørsmålDto, TemaDto } from "../../../domenetyper/spørreundersøkelseMedInnhold";
import { SquareIcon } from '@navikt/aksel-icons';
import { getGraffargeFromTema } from "../../../components/Spørreundersøkelse/TemaResultat";

interface ResultatEksportVisningProps {
    erIEksportMode: boolean;
    setErIEksportMode: (erIEksportMode: boolean) => void;
    spørreundersøkelse: Spørreundersøkelse;
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
        this.pdf = new jsPDF("p", "mm", "a4", true);
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

    private async addBody() {
        if (this.targetRef.current === null) {
            return false;
        }
        const children = this.targetRef.current.childNodes;
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
        this.addContent(await html2canvas(child as HTMLElement, { scale: 1 }));
    }

    private async exportPDF() {
        return this.pdf.save(this.eksportfilnavn);
    }

    async runExport() {
        await this.addBody();
        await this.exportPDF();
    }
}

const ForhåndsvisningEksport = ({
    erIEksportMode,
    setErIEksportMode,
    spørreundersøkelse,
}: ResultatEksportVisningProps) => {
    const targetRef = React.useRef<HTMLDivElement>(null);
    const [erLastet, setErLastet] = React.useState(false);
    const type = useSpørreundersøkelseType();
    const { samarbeid } = useSpørreundersøkelse();
    const eksportfilnavn = useEksportFilnavn(`${type}_forhandsvisning`, null, samarbeid.navn);

    React.useEffect(() => {
        if (targetRef.current !== null && erIEksportMode && erLastet) {
            const pdfe = new pdfEksport(
                targetRef as React.RefObject<HTMLDivElement>,
                eksportfilnavn,
                EXPORT_INTERNAL_WIDTH,
            );

            pdfe.runExport().then(() => {
                setErIEksportMode(false);
            });

        }
    }, [erIEksportMode, erLastet]);

    return (
        <>
            <Button
                loading={erIEksportMode}
                icon={<FilePdfIcon fontSize="1.5rem" aria-hidden />}
                variant="secondary"
                size="small"
                onClick={(e) => {
                    e.stopPropagation();
                    loggEksportertTilPdf("kartlegging");
                    setErIEksportMode(true);
                }}
            >
                Last ned
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
                        type={type}
                        visDato={false}
                        samarbeid={samarbeid}
                    />
                    <EksportInnhold
                        erLastet={erLastet}
                        setErLastet={setErLastet}
                        spørreundersøkelse={spørreundersøkelse}
                    />
                </div>
            </div>
        </>
    );
};

function EksportInnhold({
    spørreundersøkelse,
    erLastet,
    setErLastet,
}: {
    spørreundersøkelse: Spørreundersøkelse;
    erLastet: boolean;
    setErLastet: (erLastet: boolean) => void;
}) {
    const { iaSak, samarbeid } =
        useSpørreundersøkelse();
    const { data: spørreundersøkelseForhåndsvisning } =
        useHentSpørreundersøkelseMedInnhold(
            iaSak.orgnr,
            iaSak.saksnummer,
            samarbeid.id,
            "Evaluering",
            spørreundersøkelse.id,
        );
    React.useEffect(() => {
        if (spørreundersøkelseForhåndsvisning && !erLastet) {
            setErLastet(true);
        }
    }, [spørreundersøkelseForhåndsvisning, erLastet]);

    return (<>
        {spørreundersøkelseForhåndsvisning?.temaer.map((tema) => (
            <React.Fragment key={tema.temaId}>
                <Heading level="3" size="large" style={{ marginBottom: 0, color: getGraffargeFromTema(tema.navn, true) }}>
                    {tema.navn}
                </Heading>
                <GruppertSpørsmålRenderer tema={tema} useFarge defaultOpen ItemRenderer={ItemRenderer} />
            </React.Fragment>
        ))}

    </>);
}

function ItemRenderer({ tema }: { tema: TemaDto }) {
    const spørsmålIPar = React.useMemo(() => {
        const output = [];
        for (const spørsmål of tema.spørsmålOgSvaralternativer) {
            if (output[output.length - 1]?.length < 2) {
                output[output.length - 1].push(spørsmål);

            }
            output.push([spørsmål]);
        }

        return output;
    }, [tema]);

    return spørsmålIPar.map((par, index) => (
        <div key={index} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', flexWrap: 'wrap', marginLeft: '-1rem', marginRight: '-1rem' }}>
            {par.map((spørsmål: SpørsmålDto) => (
                <div key={spørsmål.id} style={{ padding: '1.5rem', border: '1px solid #fff', margin: '1rem', borderRadius: "1rem", marginTop: 0 }}>
                    <Heading level="3" size="small" style={{ marginTop: 0 }}>{spørsmål.spørsmål}</Heading>
                    {spørsmål.svaralternativer.map((svar) => (
                        <BodyShort key={svar.svarId} style={{ display: "flex", alignItems: "center", marginTop: "0.5rem" }}><SquareIcon style={{ marginRight: '0.5rem' }} fontSize="1.5rem" />{svar.svartekst}</BodyShort>
                    ))}
                </div>
            ))}
        </div>
    ));
}

export default ForhåndsvisningEksport;
