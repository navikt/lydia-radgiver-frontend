import { BodyShort, Button, Heading } from "@navikt/ds-react";
import React from "react";
import { FilePdfIcon } from "@navikt/aksel-icons";
import { Spørreundersøkelse } from "../../../domenetyper/spørreundersøkelse";
import VirksomhetsEksportHeader from "../../../components/pdfEksport/VirksomhetsEksportHeader";
import useEksportFilnavn from "../../../components/pdfEksport/useEksportFilnavn";
import jsPDF from "jspdf";
import { loggEksportertTilPdf } from "../../../util/amplitude-klient";
import { useHentSpørreundersøkelseMedInnhold } from "../../../api/lydia-api/spørreundersøkelse";
import { useSpørreundersøkelse, useSpørreundersøkelseType } from "../../../components/Spørreundersøkelse/SpørreundersøkelseContext";
import { GruppertSpørsmålRenderer } from "./SpørreundersøkelseForhåndsvisningModal/Forhåndsvisning";
import { SpørsmålDto, TemaDto } from "../../../domenetyper/spørreundersøkelseMedInnhold";
import { SquareIcon } from '@navikt/aksel-icons';
import { getGraffargeFromTema } from "../../../components/Spørreundersøkelse/TemaResultat";
import styled from "styled-components";
import { toCanvas } from "html-to-image";

interface ResultatEksportVisningProps {
    erIEksportMode: boolean;
    setErIEksportMode: (erIEksportMode: boolean) => void;
    spørreundersøkelse: Spørreundersøkelse;
}
const EXPORT_INTERNAL_WIDTH = 1280;

class pdfEksport {
    static H_PADDING = 7;
    static V_PADDING = 14;
    pdf!: jsPDF;
    targetRef: React.RefObject<HTMLDivElement>;
    position!: number;
    pageWidth!: number;
    pixelRatio!: number;
    pageHeight!: number;
    eksportfilnavn: string;

    constructor(
        targetRef: React.RefObject<HTMLDivElement>,
        eksportfilnavn: string,
        width: number,
    ) {
        this.targetRef = targetRef;
        this.eksportfilnavn = eksportfilnavn;
        this.initPdf(width);
    }

    private initPdf(width: number) {
        this.pdf = new jsPDF("p", "mm", "a4", true);
        this.pageHeight =
            this.pdf.internal.pageSize.getHeight() - pdfEksport.H_PADDING * 2;
        this.pageWidth =
            this.pdf.internal.pageSize.getWidth() - pdfEksport.V_PADDING * 2;
        this.pixelRatio = this.pageWidth / width;
        this.position = pdfEksport.H_PADDING;

    }

    private async addContent(
        canvas: HTMLCanvasElement,
        reducedVpadding = false,
        addHPadding = true,
    ) {
        const imgData = canvas.toDataURL("image/jpeg");
        const imgWidth = canvas.width * this.pixelRatio;
        const imgHeight = canvas.height * this.pixelRatio;
        const hPadding = addHPadding ? pdfEksport.H_PADDING : 0;
        const vPadding = reducedVpadding
            ? pdfEksport.V_PADDING * 0.75
            : pdfEksport.V_PADDING;

        if (this.position + imgHeight > this.pageHeight) {
            this.pdf.addPage();
            this.position = pdfEksport.H_PADDING;
        }

        this.pdf.addImage(
            imgData,
            "JPEG",
            vPadding,
            this.position + hPadding,
            imgWidth,
            imgHeight,
        );
        this.position += imgHeight + hPadding;
    }

    async runExport() {
        this.initPdf(EXPORT_INTERNAL_WIDTH);

        if (this.targetRef.current === null) {
            return false;
        }

        const children = this.targetRef.current.childNodes;
        const imagePromises = [];

        for (let i = 0; i < children.length; i++) {
            const child = children[i] as HTMLElement;

            imagePromises.push(toCanvas(child as HTMLElement, { backgroundColor: "white" }));
        }

        for (const image of await Promise.all(imagePromises)) {
            this.addContent(image, true);
        }

        this.pdf.save(this.eksportfilnavn);
    };
}

const ExportDiv = styled.div<{ $erIEksportMode: boolean }>`
    display: ${({ $erIEksportMode }) => ($erIEksportMode ? "block" : "none")};
    height: 0;
    overflow: hidden;
    position: absolute;
    width: ${EXPORT_INTERNAL_WIDTH}px;
`;

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
            <ExportDiv
                $erIEksportMode={erIEksportMode}
                ref={targetRef}
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
            </ExportDiv>
        </>
    );
};

const TemaHeading = styled(Heading) <{ $temanavn: string }>`
    color: ${({ $temanavn }) => getGraffargeFromTema($temanavn, true)};
    margin-bottom: 0;
`;

function EksportInnhold({
    spørreundersøkelse,
    erLastet,
    setErLastet,
}: {
    spørreundersøkelse: Spørreundersøkelse;
    erLastet: boolean;
    setErLastet: (erLastet: boolean) => void;
}) {
    const { iaSak, samarbeid } = useSpørreundersøkelse();
    const { data: spørreundersøkelseForhåndsvisning } = useHentSpørreundersøkelseMedInnhold(
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

    return (
        <>
            {spørreundersøkelseForhåndsvisning?.temaer.map((tema) => (
                <React.Fragment key={tema.temaId}>
                    <TemaHeading $temanavn={tema.navn} level="3" size="large">
                        {tema.navn}
                    </TemaHeading>
                    <GruppertSpørsmålRenderer tema={tema} useFarge defaultOpen ItemRenderer={ItemRenderer} Container={({ children }) => children} />
                </React.Fragment>
            ))}
        </>
    );
}

const SpørsmålParContainer = styled.div`
    display: flex;
    flex-direction: row;
    margin-left: -1rem;
    margin-right: -1rem;
`;

const SpørsmålContainer = styled.div`
    padding: 0 1.5rem;
    margin: 0 1rem;
    margin-top: 0;
    width: 50%;
`;

const SpørsmålHeading = styled(Heading)`
    margin-top: 0;
`;

const SvarBody = styled(BodyShort)`
    display: flex;
    align-items: center;
    margin-top: 0.5rem;
`;

const SvarIkon = styled(SquareIcon)`
    margin-right: 0.5rem;
    font-size: 1.5rem;
`;

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
        <SpørsmålParContainer key={index}>
            {par.map((spørsmål: SpørsmålDto) => (
                <SpørsmålContainer key={spørsmål.id}>
                    <SpørsmålHeading level="3" size="small">{spørsmål.spørsmål}</SpørsmålHeading>
                    {spørsmål.svaralternativer.map((svar) => (
                        <SvarBody key={svar.svarId}><SvarIkon />{svar.svartekst}</SvarBody>
                    ))}
                </SpørsmålContainer>
            ))}
        </SpørsmålParContainer>
    ));
}

export default ForhåndsvisningEksport;
