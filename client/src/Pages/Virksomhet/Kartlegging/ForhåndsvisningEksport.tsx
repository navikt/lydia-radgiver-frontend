import { BodyShort, Button, Heading } from "@navikt/ds-react";
import React from "react";
import { FilePdfIcon } from "@navikt/aksel-icons";
import { Spørreundersøkelse } from "../../../domenetyper/spørreundersøkelse";
import VirksomhetsEksportHeader from "../../../components/pdfEksport/VirksomhetsEksportHeader";
import useEksportFilnavn from "../../../components/pdfEksport/useEksportFilnavn";
import jsPDF from "jspdf";
import { loggEksportertTilPdf } from "../../../util/amplitude-klient";
import { useHentSpørreundersøkelseMedInnhold } from "../../../api/lydia-api/spørreundersøkelse";
import {
    useSpørreundersøkelse,
    useSpørreundersøkelseType,
} from "../../../components/Spørreundersøkelse/SpørreundersøkelseContext";
import { GruppertSpørsmålRenderer } from "./SpørreundersøkelseForhåndsvisningModal/Forhåndsvisning";
import {
    SpørsmålDto,
    TemaDto,
} from "../../../domenetyper/spørreundersøkelseMedInnhold";
import { SquareIcon } from "@navikt/aksel-icons";
import { getGraffargeFromTema } from "../../../components/Spørreundersøkelse/TemaResultat";
import { toCanvas } from "html-to-image";

import styles from './forhåndsvisningEksport.module.scss';

interface ResultatEksportVisningProps {
    erIEksportMode: boolean;
    setErIEksportMode: (erIEksportMode: boolean) => void;
    spørreundersøkelse: Spørreundersøkelse;
}

class pdfEksport {
    static H_PADDING = 7;
    static V_PADDING = 14;
    pdf!: jsPDF;
    targetRef: React.RefObject<HTMLDivElement>;
    position!: number;
    pageHeight!: number;
    eksportfilnavn: string;

    constructor(
        targetRef: React.RefObject<HTMLDivElement>,
        eksportfilnavn: string,
    ) {
        this.targetRef = targetRef;
        this.eksportfilnavn = eksportfilnavn;
        this.initPdf();
    }

    private initPdf() {
        this.pdf = new jsPDF("p", "px", "a4", true);
        this.pageHeight =
            this.pdf.internal.pageSize.getHeight() - pdfEksport.H_PADDING * 2;
        this.position = pdfEksport.H_PADDING;
    }

    private async addContent(
        canvas: HTMLCanvasElement,
        reducedVpadding = false,
        addHPadding = true,
    ) {
        const hPadding = addHPadding ? pdfEksport.H_PADDING : 0;
        const vPadding = reducedVpadding
            ? pdfEksport.V_PADDING * 0.75
            : pdfEksport.V_PADDING;
        const imgWidth = this.pdf.internal.pageSize.getWidth() - vPadding * 2;
        const imgHeight = imgWidth * (canvas.height / canvas.width);

        if (this.position + imgHeight > this.pageHeight) {
            this.pdf.addPage();
            this.position = pdfEksport.H_PADDING;
        }

        this.pdf.addImage(
            canvas,
            "JPEG",
            vPadding,
            this.position + hPadding,
            imgWidth,
            imgHeight,
        );

        this.position += imgHeight + hPadding;
    }

    async runExport() {
        this.initPdf();

        if (this.targetRef.current === null) {
            return false;
        }

        const children = this.targetRef.current.childNodes;
        const imagePromises = [];

        for (let i = 0; i < children.length; i++) {
            const child = children[i] as HTMLElement;

            imagePromises.push(
                toCanvas(child as HTMLElement, { backgroundColor: "white" }),
            );
        }

        for (const image of await Promise.all(imagePromises)) {
            this.addContent(image, true);
        }

        this.pdf.save(this.eksportfilnavn);
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
    const eksportfilnavn = useEksportFilnavn(
        `${type}_forhandsvisning`,
        null,
        samarbeid.navn,
    );

    React.useEffect(() => {
        if (targetRef.current !== null && erIEksportMode && erLastet) {
            const pdfe = new pdfEksport(
                targetRef as React.RefObject<HTMLDivElement>,
                eksportfilnavn,
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
                    loggEksportertTilPdf(type.toLowerCase(), true);
                    setErIEksportMode(true);
                }}
            >
                Last ned
            </Button>
            <div className={styles.exportDiv} style={{ display: erIEksportMode ? "block" : "none" }} ref={targetRef}>
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
    const { iaSak, samarbeid } = useSpørreundersøkelse();
    const { data: spørreundersøkelseForhåndsvisning } =
        useHentSpørreundersøkelseMedInnhold(
            iaSak.orgnr,
            iaSak.saksnummer,
            samarbeid.id,
            "EVALUERING",
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
                    <Heading style={{
                        color: getGraffargeFromTema(tema.navn, true),
                        marginBottom: 0,
                    }} level="3" size="large">
                        {tema.navn}
                    </Heading>
                    <GruppertSpørsmålRenderer
                        tema={tema}
                        useFarge
                        defaultOpen
                        ItemRenderer={ItemRenderer}
                        Container={({ children }) => children}
                    />
                </React.Fragment>
            ))}
        </>
    );
}

function ItemRenderer({ tema }: { tema: TemaDto }) {
    const spørsmålIPar = React.useMemo(() => {
        const output = [];
        for (const spørsmål of tema.spørsmålOgSvaralternativer) {
            if (output[output.length - 1]?.length < 2) {
                output[output.length - 1].push(spørsmål);
            } else {
                output.push([spørsmål]);
            }
        }

        return output;
    }, [tema]);

    return spørsmålIPar.map((par, index) => (
        <div className={styles.spørsmålParContainer} key={index}>
            {par.map((spørsmål: SpørsmålDto) => (
                <div className={styles.spørsålContainer} key={spørsmål.id}>
                    <Heading className={styles.spørsmålHeading} level="3" size="small">
                        {spørsmål.spørsmål}
                    </Heading>
                    {spørsmål.svaralternativer.map((svar) => (
                        <BodyShort className={styles.spørsmålBody} key={svar.svarId}>
                            <SquareIcon className={styles.svarIkon} />
                            {svar.svartekst}
                        </BodyShort>
                    ))}
                </div>
            ))}
        </div>
    ));
}

export default ForhåndsvisningEksport;
