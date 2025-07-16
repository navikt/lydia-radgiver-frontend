import React from "react";
import {
    SpørsmålDto,
    SvaralternativDto,
    TemaDto,
} from "../../../../domenetyper/spørreundersøkelseMedInnhold";
import {
    Accordion,
    BodyShort,
    Checkbox,
    CheckboxGroup,
    Heading,
    Radio,
    RadioGroup,
} from "@navikt/ds-react";
import { useHentSpørreundersøkelseMedInnhold } from "../../../../api/lydia-api/spørreundersøkelse";
import { useSpørreundersøkelse } from "../../../../components/Spørreundersøkelse/SpørreundersøkelseContext";
import { lokalDatoMedKlokkeslett } from "../../../../util/dato";
import styled from "styled-components";
import { getGraffargeFromTema } from "../../../../components/Spørreundersøkelse/TemaResultat";
import capitalizeFirstLetterLowercaseRest from "../../../../util/formatering/capitalizeFirstLetterLowercaseRest";

export default function Forhåndsvisning({
    spørreundersøkelseid,
    setModaltittel,
}: {
    spørreundersøkelseid: string;
    setModaltittel: (tittel: string) => void;
}) {
    const { iaSak, samarbeid, spørreundersøkelseType } =
        useSpørreundersøkelse();
    const { data: spørreundersøkelseForhåndsvisning } =
        useHentSpørreundersøkelseMedInnhold(
            iaSak.orgnr,
            iaSak.saksnummer,
            samarbeid.id,
            "EVALUERING",
            spørreundersøkelseid,
        );
    React.useEffect(() => {
        if (spørreundersøkelseForhåndsvisning) {
            setModaltittel(
                `${capitalizeFirstLetterLowercaseRest(spørreundersøkelseType)} opprettet ${lokalDatoMedKlokkeslett(spørreundersøkelseForhåndsvisning.opprettetTidspunkt)}`,
            );
        }
    }, [spørreundersøkelseForhåndsvisning, setModaltittel]);

    return (
        <>
            {spørreundersøkelseForhåndsvisning?.temaer.map((tema) => (
                <React.Fragment key={tema.temaId}>
                    <Tematittel level="3" size="large">
                        {tema.navn}
                    </Tematittel>
                    <GruppertSpørsmålRenderer tema={tema} />
                </React.Fragment>
            ))}
        </>
    );
}

const Tematittel = styled(Heading)`
    margin-top: 1rem;
`;

const Spørsmålsgruppe = styled.div`
    padding: 1rem;
`;

function getGrupperteSpørsmål(tema: TemaDto) {
    return React.useMemo(
        () =>
            tema.spørsmålOgSvaralternativer.reduce(
                (acc, spørsmål) => {
                    if (spørsmål.undertemanavn) {
                        acc[spørsmål.undertemanavn] =
                            acc[spørsmål.undertemanavn] || [];
                        acc[spørsmål.undertemanavn].push(spørsmål);
                    } else {
                        acc["Uten gruppe"] = acc["Uten gruppe"] || [];
                        acc["Uten gruppe"].push(spørsmål);
                    }
                    return acc;
                },
                {} as { [key: string]: SpørsmålDto[] },
            ),
        [tema],
    );
}

export function GruppertSpørsmålRenderer({
    tema,
    defaultOpen = false,
    useFarge = false,
    ItemRenderer = SpørsmålRenderer,
    Container = Spørsmålsgruppe,
}: {
    tema: TemaDto;
    useFarge?: boolean;
    defaultOpen?: boolean;
    ItemRenderer?: React.ComponentType<{
        tema: TemaDto;
        defaultOpen?: boolean;
    }>;
    Container?: React.ComponentType<{ children: React.ReactNode }>;
}) {
    const { spørreundersøkelseType } = useSpørreundersøkelse();
    const grupperteSpørsmål = getGrupperteSpørsmål(tema);

    return (
        <>
            {Object.entries(grupperteSpørsmål).map(([kategori, spørsmål]) => (
                <Container key={kategori}>
                    {spørreundersøkelseType !== "BEHOVSVURDERING" && (
                        <Kategori
                            useFarge={useFarge}
                            tittel={kategori}
                            temanavn={tema.navn}
                        />
                    )}
                    <ItemRenderer
                        defaultOpen={defaultOpen}
                        tema={{ ...tema, spørsmålOgSvaralternativer: spørsmål }}
                    />
                </Container>
            ))}
        </>
    );
}

const KATEGORI_BESKRIVELSER: { [key: string]: string } = {
    //Arbeidsmiljø
    "Utvikle arbeidsmiljøet":
        "Mål: Øke anvendelse og kompetanse innen verktøy og bransjerettet kunnskap for å jobbe målrettet og kunnskapsbasert med eget arbeidsmiljø.",
    "Endring og omstilling":
        "Mål: Øke kunnskap om hvordan ivareta arbeidsmiljø og forebygge sykefravær under endring og omstilling.",
    "Oppfølging av arbeidsmiljøundersøkelser":
        "Mål: Øke ferdigheter og gi støtte til hvordan man kan jobbe med forhold på arbeidsplassen som belyses i egne arbeidsmiljøundersøkelser.",
    "Livsfaseorientert personalpolitikk":
        "Mål: Utvikle kultur og personalpolitikk som ivaretar medarbeideres ulike behov, krav, begrensninger og muligheter i ulike livsfaser.",
    "Psykisk helse":
        "Mål: Gi innsikt i hvordan psykiske utfordringer kan komme til uttrykk i arbeidshverdagen og øke ferdigheter for hvordan man møter medarbeidere med psykiske helseutfordringer.",
    HelseIArbeid:
        "Mål: Øke kompetansen og få ansatte til å mestre jobb, selv med muskel/skjelett- og psykiske helseplager.",
    //Sykefraværsarbeid
    Sykefraværsrutiner:
        "Mål: Jobbe systematisk og forebyggende med sykefravær, samt forbedre rutiner og oppfølging av ansatte som er sykmeldte eller står i fare for å bli det.",
    Oppfølgingssamtaler:
        "Mål:  Øke kompetanse og ferdigheter for hvordan man gjennomfører gode oppfølgingssamtaler, både gjennom teori og praksis.",
    "Tilretteleggings- og medvirkningsplikt":
        "Mål: Utvikle rutiner og kultur for tilrettelegging og medvirkning, samt kartlegging av tilretteleggingsmuligheter på arbeidsplassen.",
    "Sykefravær - enkeltsaker":
        "Mål: Øke kompetanse og ferdigheter for hvordan man tar tak i, følger opp og løser enkeltsaker.",
    //Partssamarbeid
    "Utvikle partssamarbeidet":
        "Mål: Styrke og strukturere samarbeidet mellom leder, tillitsvalgt og verneombud, samt øke kunnskap og ferdigheter for å jobbe systematisk og forebyggende med sykefravær og arbeidsmiljø.",
};

const KategoriHeader = styled.div`
    margin-bottom: 1rem;
`;

const Kategoritittel = styled(Heading)<{ $farge: string }>`
    color: ${(props) => props.$farge || "var(--a-blue-500)"};
    margin-bottom: 0.25rem;
`;

const Kategorimål = styled(BodyShort)`
    color: var(--a-text-subtle);
`;

function Kategori({
    tittel,
    useFarge = false,
    temanavn = "",
}: {
    tittel: string;
    useFarge?: boolean;
    temanavn?: string;
}) {
    if (KATEGORI_BESKRIVELSER[tittel]) {
        return (
            <KategoriHeader>
                <Kategoritittel
                    level="4"
                    size="xsmall"
                    $farge={
                        useFarge
                            ? getGraffargeFromTema(temanavn)
                            : "var(--a-text-default)"
                    }
                >
                    {tittel}
                </Kategoritittel>
                <Kategorimål size="small">
                    {KATEGORI_BESKRIVELSER[tittel]}
                </Kategorimål>
            </KategoriHeader>
        );
    }

    if (tittel === "Uten gruppe") {
        return null;
    }

    return (
        <KategoriHeader>
            <Kategoritittel
                level="4"
                size="xsmall"
                $farge={
                    useFarge
                        ? getGraffargeFromTema(temanavn)
                        : "var(--a-text-default)"
                }
            >
                {tittel}
            </Kategoritittel>
        </KategoriHeader>
    );
}

function SpørsmålRenderer({
    tema,
    defaultOpen = false,
}: {
    tema: TemaDto;
    defaultOpen?: boolean;
}) {
    const boxRef = React.useRef<HTMLDivElement>(null);
    React.useEffect(() => {
        if (boxRef !== null) {
            boxRef?.current?.scrollIntoView({
                block: "end",
                inline: "center",
            });
        }
    }, []);

    return (
        <Accordion>
            {tema.spørsmålOgSvaralternativer.map((spørsmål) => (
                <SpørsmålAccordionItem
                    key={spørsmål.id}
                    spørsmål={spørsmål}
                    defaultOpen={defaultOpen}
                />
            ))}
        </Accordion>
    );
}

const StyledAccordionHeader = styled(Accordion.Header)`
    color: var(--a-blue-500);
    --a-font-weight-bold: 400;
`;

const StyledAccordionItem = styled(Accordion.Item)`
    &:last-child > :where(.navds-accordion__header) {
        box-shadow:
            var(--__ac-accordion-header-shadow),
            inset 0 0 0 0 var(--__ac-accordion-header-shadow-color);
    }
`;

function SpørsmålAccordionItem({
    spørsmål,
    defaultOpen = false,
}: {
    spørsmål: SpørsmålDto;
    defaultOpen?: boolean;
}) {
    return (
        <StyledAccordionItem defaultOpen={defaultOpen}>
            <StyledAccordionHeader>{spørsmål.spørsmål}</StyledAccordionHeader>
            <Accordion.Content>
                <Svaralternativer
                    svaralternativer={spørsmål.svaralternativer}
                    flervalg={spørsmål.flervalg}
                />
            </Accordion.Content>
        </StyledAccordionItem>
    );
}

const DisabletCheckbox = styled(Checkbox)`
    pointer-events: none;

    label::before {
        opacity: 0.5;
    }
`;

const DisabletRadio = styled(Radio)`
    pointer-events: none;

    label::before {
        opacity: 0.5;
    }
`;

function Svaralternativer({
    svaralternativer,
    flervalg,
}: {
    svaralternativer: SvaralternativDto[];
    flervalg: boolean;
}) {
    const OptionGroup = flervalg ? CheckboxGroup : RadioGroup;

    return (
        <OptionGroup hideLegend legend={""}>
            {svaralternativer.map((svaralternativ) => {
                if (flervalg) {
                    return (
                        <DisabletCheckbox
                            key={svaralternativ.svarId}
                            value={svaralternativ.svarId}
                            disabled
                        >
                            {svaralternativ.svartekst}
                        </DisabletCheckbox>
                    );
                }
                return (
                    <DisabletRadio
                        key={svaralternativ.svarId}
                        value={svaralternativ.svarId}
                    >
                        {svaralternativ.svartekst}
                    </DisabletRadio>
                );
            })}
        </OptionGroup>
    );
}
