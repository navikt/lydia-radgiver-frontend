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
import { getGraffargeFromTema } from "../../../../components/Spørreundersøkelse/TemaResultat";
import capitalizeFirstLetterLowercaseRest from "../../../../util/formatering/capitalizeFirstLetterLowercaseRest";
import styles from './spørreundersøkelseForhåndsvisningModal.module.scss';

export default function Forhåndsvisning({
    spørreundersøkelseid,
    setModaltittel,
}: {
    spørreundersøkelseid: string;
    setModaltittel: (tittel: string) => void;
}) {
    const { iaSak, samarbeid } =
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
                `${capitalizeFirstLetterLowercaseRest(spørreundersøkelseForhåndsvisning.type)} opprettet ${lokalDatoMedKlokkeslett(spørreundersøkelseForhåndsvisning.opprettetTidspunkt)}`,
            );
        }
    }, [spørreundersøkelseForhåndsvisning, setModaltittel]);

    return (
        <>
            {spørreundersøkelseForhåndsvisning?.temaer.map((tema) => (
                <React.Fragment key={tema.temaId}>
                    <Heading className={styles.tematittel} level="3" size="large">
                        {tema.navn}
                    </Heading>
                    <GruppertSpørsmålRenderer tema={tema} />
                </React.Fragment>
            ))}
        </>
    );
}

function Spørsmålsgruppe({ className = "", ...props }: { children: React.ReactNode } & React.HTMLAttributes<HTMLDivElement>) {
    return <div {...props} className={`${styles.spørsmålsgruppe} ${className}`} />;
}

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
            <div className={styles.kategoriheader}>
                <Heading
                    className={styles.kategoritittel}
                    level="4"
                    size="xsmall"
                    style={{ color: useFarge ? getGraffargeFromTema(temanavn) : "var(--a-text-default)" }}
                >
                    {tittel}
                </Heading>
                <BodyShort className={styles.kategorimål} size="small">
                    {KATEGORI_BESKRIVELSER[tittel]}
                </BodyShort>
            </div>
        );
    }

    if (tittel === "Uten gruppe") {
        return null;
    }

    return (
        <div className={styles.kategoriheader}>
            <Heading
                className={styles.kategoritittel}
                level="4"
                size="xsmall"
                style={{ color: useFarge ? getGraffargeFromTema(temanavn) : "var(--a-text-default)" }}
            >
                {tittel}
            </Heading>
        </div>
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

function SpørsmålAccordionItem({
    spørsmål,
    defaultOpen = false,
}: {
    spørsmål: SpørsmålDto;
    defaultOpen?: boolean;
}) {
    return (
        <Accordion.Item className={styles.accordionItem} defaultOpen={defaultOpen}>
            <Accordion.Header className={styles.accordionHeader}>{spørsmål.spørsmål}</Accordion.Header>
            <Accordion.Content>
                <Svaralternativer
                    svaralternativer={spørsmål.svaralternativer}
                    flervalg={spørsmål.flervalg}
                />
            </Accordion.Content>
        </Accordion.Item>
    );
}

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
                        <Checkbox
                            key={svaralternativ.svarId}
                            value={svaralternativ.svarId}
                            className={styles.disabledCheckbox}
                            disabled
                        >
                            {svaralternativ.svartekst}
                        </Checkbox>
                    );
                }
                return (
                    <Radio
                        key={svaralternativ.svarId}
                        value={svaralternativ.svarId}
                        className={styles.disabledRadio}
                    >
                        {svaralternativ.svartekst}
                    </Radio>
                );
            })}
        </OptionGroup>
    );
}
